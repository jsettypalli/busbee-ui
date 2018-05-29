import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../../providers/utils/utils';
import { MockDataProvider } from '../../providers/mock-data/mock-data';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy, OnInit {
  MapmyIndia: any;
  private map;
  private bus;
  private locationWatch;
  private stompClient;
  private drivePath = [];
  private serverUrl = 'http://52.66.155.37:8080/transportws';
  private wsConnected = false;
  private polylines = {
    current: null,
    last: null,
    previous: []
  };
  private markers = {
    bus: null,
    stops: []
  }
  private currentLocation = {
    latitude: 0,
    longitude: 0
  };
  private travelledPath = [];
  public message;
  private subscriptions = [];

  constructor(
    private server: ServerProvider,
    private geolocation: Geolocation,
    private utils: UtilsProvider,
    private mockData: MockDataProvider) {
    this.MapmyIndia = (<any>window).MapmyIndia;
    this.geolocation.getCurrentPosition().then(data => {
      this.currentLocation = data.coords;
    })
  }

  ngOnInit() {
    this.connectWS(() => { }, () => { });
  }

  ngAfterViewInit() {
    // var center = (<any>window).L.LatLng(this.currentLocation.latitude, this.currentLocation.longitude);
    this.map = new this.MapmyIndia.Map('map', { zoomControl: true, hybrid: true });
    this.server.map = this.map;
  }

  selectBus(bus) {
    this.bus = bus;
    this.closeSubscriptions();
    this.clearPolyLines();
    this.utils.toast('TRIP: ' + this.bus.tripId + '; BUS: ' + this.bus.busId + '  ;' + ' Role: ' + this.bus.role + ' ;');
    // this.bus not started. TODO: isStarted flag
    if (!this.bus.inTransit) {
      this.message = {
        text: 'The bus #' + this.bus.busId + ' is scheduled to start at ',
        time: this.bus.startDateTime
      }
      this.utils.alert('Bus not started', 'The bus #' + this.bus.busId + ' is scheduled to start at ' + new Date(this.bus.startDateTime))
      // TODO: switch to active mode. how to?
    }
    if (this.bus.role === 'DRIVER') {
      this.plotRoute();
      this.drive();
    } else {
      this.plotRoute();
      this.connectWS(() => {
        let busPositionSubscription = this.stompClient.subscribe('/subscribe/busposition/' + this.bus.tripId + '/' + this.bus.busId, (message) => {
          console.log(message);
          let data = JSON.parse(message.body);
          if (message.next_bus_stop_latitude) {
            this.bus.nextBusStop = {
              location: {
                latitude: message.next_bus_stop_latitude,
                longitude: message.next_bus_stop_longitude
              }
            };
          }
          let location = {
            latitude: data.latitude,
            longitude: data.longitude
          }
          this.moveBus(location, this.bus.nextBusStop);
        });
        this.subscriptions.push(busPositionSubscription);
      }, () => { });
    }
    this.watchToStop();
  }

  ngOnDestroy() {
    this.closeSubscriptions();
    if (this.wsConnected)
      this.stompClient.ws.close();
    this.clearPolyLines();
  }

  closeSubscriptions() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  connectWS(onSuccess, onFailure) {
    if (this.wsConnected) {
      onSuccess();
    } else {
      let ws = new SockJS(this.serverUrl);
      // let ws = new WebSocket('ws://52.66.155.37:8080/transportws');
      this.stompClient = Stomp.over(ws);
      let that = this;
      this.stompClient.connect({}, function(frame) {
        console.log(frame);
        that.wsConnected = true;
        onSuccess();
      }, function(error) {
        that.wsConnected = false;
        that.stompClient.ws.close();
        that.utils.toast('WebSocket Error: ' + error);
        onFailure();
      });
    }
  }

  watchForNextStop() {
    this.connectWS(() => {
      let nextBusStopSubscription = this.stompClient.subscribe('/subscribe/next_busstop_location/' + this.bus.tripId + '/' + this.bus.busId, (message) => {
        this.bus.nextBusStop = {
          location: {
            latitude: message.next_bus_stop_latitude,
            longitude: message.next_bus_stop_longitude
          }
        }
      });
      this.subscriptions.push(nextBusStopSubscription);
    }, () => { });
  }

  watchToStop() {
    this.connectWS(() => {
      let stopPublishSubscription = this.stompClient.subscribe('/subscribe/stop_sending_busposition/' + this.bus.tripId + '/' + this.bus.busId, (message) => {
        this.locationWatch.unsubscribe();
        this.stompClient.ws.close();
      });
      this.subscriptions.push(stopPublishSubscription);
    }, () => { });
  }

  addMarker(lat, lng, isBus?, title?) {
    var w = 40,
      h = 50;
    let icon = (<any>window).L.icon({
      iconUrl: isBus ? 'assets/imgs/bus.png' : 'assets/imgs/marker.png',
      iconAnchor: [w / 2, h / 2], //Handles the marker anchor point. For a correct anchor point [ImageWidth/2,ImageHeight/2]
      iconSize: [w, h]
    })
    let options = {
      icon: icon,
      title: title ? title : null
    }
    let marker = (<any>window).L.marker([lat, lng], options).addTo(this.map);
    return marker;
  }

  drive() {
    if (this.mockData.useMockData)
      this.locationWatch = this.mockData.watchPosition();
    else
      this.locationWatch = this.geolocation.watchPosition();
    let locationWatchSubscription = this.locationWatch.subscribe((data) => {
      this.moveBus(data.coords, this.bus.nextBusStop);
      let position = {
        busId: this.bus.busId,
        latitude: data.latitude || data.coords.latitude,
        longitude: data.longitude || data.coords.longitude
      };
      this.connectWS(() => {
        this.stompClient.send('/publish/busposition/' + this.bus.tripId + '/' + this.bus.busId, {}, JSON.stringify(position));
      }, () => { });
      var center = new (<any>window).L.LatLng(data.coords.latitude, data.coords.longitude);
      this.map.panTo(center);
      this.drivePath.push(center);
    });
    this.watchForNextStop();
    this.subscriptions.push(locationWatchSubscription);
  }

  plotLine(points, color) {
    var polylineParam = { weight: 6, opacity: 1, color: color }
    var poly = new (<any>window).L.Polyline(points, polylineParam);
    this.map.addLayer(poly);
    return poly;
  }

  plotRoute() {
    if (this.bus.currentLocation) {
      let busMarker = this.addMarker(this.bus.currentLocation.latitude, this.bus.currentLocation.longitude, true);
      this.markers.bus = busMarker;
      var center = new (<any>window).L.LatLng(this.bus.currentLocation.latitude, this.bus.currentLocation.longitude);
      this.map.panTo(center);
    }
    // current to next
    // TODO: how to get nextBusStop on websocket
    if (this.bus.currentLocation)
      this.getRoutes(this.bus.currentLocation, this.bus.nextBusStop.location, '#148d73').then(poly => {
        if (poly) {
          this.map.fitBounds(poly.getBounds());
          let nextBusStopMarker = this.addMarker(this.bus.nextBusStop.location.latitude, this.bus.nextBusStop.location.longitude, false, this.bus.nextBusStop.busStopName);
          this.markers.stops.push(nextBusStopMarker);
          this.polylines.current = poly;
        }
      })

    // last to current
    if (this.bus.visitedBusStops && this.bus.visitedBusStops.length) {
      let last = this.bus.visitedBusStops[this.bus.visitedBusStops.length - 1];
      let lastBusStopMarker = this.addMarker(last.location.latitude, last.location.longitude, false, last.busStopName);
      this.markers.stops.push(lastBusStopMarker);
      this.getRoutes(last.location, this.bus.currentLocation, 'blue', true).then(poly => {
        this.polylines.last = poly;
      })
    }
    // previous
    if (this.bus.visitedBusStops && this.bus.visitedBusStops.length > 1) {
      let first = this.bus.visitedBusStops[0];
      let firstBusStopMarker = this.addMarker(first.location.latitude, first.location.longitude, false, first.busStopName);
      this.markers.stops.push(firstBusStopMarker);
      for (let key in this.bus.visitedBusStops) {
        let i = parseInt(key);
        if (i !== (this.bus.visitedBusStops.length - 1)) {
          let start = this.bus.visitedBusStops[i];
          let stop = this.bus.visitedBusStops[i + 1];
          let busStopMarker = this.addMarker(stop.location.latitude, stop.location.longitude, false, stop.busStopName);
          this.markers.stops.push(busStopMarker);
          this.getRoutes(stop.location, start.location, 'blue').then(poly => {
            this.polylines.previous.push(poly);
          })
        }
      };
    }
  }

  moveBus(coords, nextBusStop) {
    // TODO: need real data to test
    let latlng = new (<any>window).L.LatLng(coords.latitude, coords.longitude);
    this.travelledPath.push(latlng);
    // redraw lastTravelled line
    let lastPolyline = this.plotLine(this.travelledPath, 'blue');
    if (this.polylines.last)
      this.map.removeLayer(this.polylines.last);
    this.polylines.last = lastPolyline;
    // redraw current line
    this.getRoutes(coords, nextBusStop.location, '#148d73').then(poly => {
      if (poly) {
        if (this.polylines.current)
          this.map.removeLayer(this.polylines.current);
        this.polylines.current = poly;
        if (this.markers.bus)
          this.map.removeLayer(this.markers.bus);
        let busMarker = this.addMarker(coords.latitude, coords.longitude, true);
        this.markers.bus = busMarker;
      }
    })

    // let decorator = (<any>window).L.PolylineDecorator(this.polylines.current).addTo(this.map);
    // let offset = 0;
    // var w = 40,
    //   h = 50;
    // //offset and repeat can be each defined as a number,in pixels,or in percentage of the line's length,as a string
    // window.setInterval(function() {
    //   decorator.setPatterns([{
    //     offset: offset + '%', //Offset value for first pattern symbol,from the start point of the line. Default is 0.
    //     repeat: 0, //repeat pattern at every x offset. 0 means no repeat.
    //     //Symbol type.
    //     symbol: (<any>window).L.Symbol.marker({
    //       rotate: true, //move marker along the line. false value may cause the custom marker to shift away from a curved polyline. Default is false.
    //       markerOptions: {
    //         icon: (<any>window).L.icon({
    //           iconUrl: 'this.bus.png',
    //           iconAnchor: [w / 2, h / 2], //Handles the marker anchor point. For a correct anchor point [ImageWidth/2,ImageHeight/2]
    //           iconSize: [w, h]
    //         })
    //       }
    //     })
    //   }]);
    //   if ((offset += 0.03) > 100) //Sets offset. Smaller the value smoother the movement.
    //     offset = 0;
    // }, 30); //Time in ms. Increases/decreases the speed of the marker movement on decrement/increment of 1 respectively. values should not be less than 1.

  }

  clearPolyLines() {
    if (this.polylines.current)
      this.map.removeLayer(this.polylines.current);
    if (this.polylines.last)
      this.map.removeLayer(this.polylines.last);
    if (this.polylines.previous.length)
      this.polylines.previous.forEach(poly => this.map.removeLayer(poly));
    if (this.markers.bus)
      this.map.removeLayer(this.markers.bus);
    if (this.markers.stops.length)
      this.markers.stops.forEach(stopMarket => this.map.removeLayer(stopMarket));
  }

  getRoutes(start, stop, color, isLastTravelled?) {
    return this.server.getRoute(start, stop).toPromise().then((data: any) => {
      let points;
      if (data.results.trips.length)
        points = this.utils.decode(data.results.trips[0].pts);
      if (isLastTravelled)
        this.travelledPath = points;
      return this.plotLine(points, color);
    }).catch(error => {
      console.log(error);
      this.utils.alert('Map Routing error', error.message);
    });
  }

}
