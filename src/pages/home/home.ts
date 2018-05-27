import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../../providers/utils/utils';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy, OnInit {
  MapmyIndia: any;
  private map;
  public bus;
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
  public message;

  constructor(
    private server: ServerProvider,
    private geolocation: Geolocation,
    private utils: UtilsProvider) {
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
    this.clearPolyLines();
    this.utils.toast('TRIP: ' + bus.tripId + '; BUS: ' + bus.busId + '  ;' + ' Role: ' + bus.role + ' ;');
    // bus not started. TODO: isStarted flag
    if (!bus.inTransit) {
      this.message = {
        id: bus.busId,
        time: bus.startDateTime
      }
      this.utils.alert('Bus not started', 'The bus #' + bus.busId + ' is scheduled to start at ' + new Date(bus.startDateTime))
      // TODO: switch to active mode. how to?
    } else
      if (bus.role === 'DRIVER') {
        this.plotRoute(bus);
        this.drive(bus);
      } else {
        this.plotRoute(bus);
        this.connectWS(() => {
          this.stompClient.subscribe('/subscribe/busposition/' + bus.tripId + '/' + bus.busId, (message) => {
            console.log(message);
            this.moveBus();
          });
        }, () => { });
        // TODO: need real data to test
        this.moveBus();
      }
  }

  ngOnDestroy() {
    this.locationWatch.unsubscribe();
    this.stompClient.ws.close();
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

  drive(bus) {
    this.locationWatch = this.geolocation.watchPosition();
    this.locationWatch.subscribe((data) => {
      this.moveBus();
      let position = {
        busId: bus.busId,
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      };
      this.connectWS(() => {
        this.stompClient.send('/publish/busposition/' + bus.tripId + '/' + bus.busId, {}, JSON.stringify(position));
      }, () => { });
      var center = new (<any>window).L.LatLng(data.coords.latitude, data.coords.longitude);
      this.map.panTo(center);
      this.drivePath.push(center);
    });
  }

  plotLine(points, color) {
    var polylineParam = { weight: 6, opacity: 1, color: color }
    var poly = new (<any>window).L.Polyline(points, polylineParam);
    this.map.addLayer(poly);
    return poly;
  }

  plotRoute(bus) {
    if (bus.currentLocation) {
      let busMarker = this.addMarker(bus.currentLocation.latitude, bus.currentLocation.longitude, true);
      this.markers.bus = busMarker;
      var center = new (<any>window).L.LatLng(bus.currentLocation.latitude, bus.currentLocation.longitude);
      this.map.panTo(center);
    }
    // current to next
    // TODO: how to get nextBusStop on websocket
    if (bus.currentLocation)
      this.getRoutes(bus.currentLocation, bus.nextBusStop.location, '#148d73').then(poly => {
        this.map.fitBounds(poly.getBounds());
        let nextBusStopMarker = this.addMarker(bus.nextBusStop.location.latitude, bus.nextBusStop.location.longitude, false, bus.nextBusStop.busStopName);
        this.markers.stops.push(nextBusStopMarker);
        this.polylines.current = poly;
      })

    // last to current
    if (bus.visitedBusStops && bus.visitedBusStops.length) {
      let last = bus.visitedBusStops[bus.visitedBusStops.length - 1];
      let lastBusStopMarker = this.addMarker(last.location.latitude, last.location.longitude, false, last.busStopName);
      this.markers.stops.push(lastBusStopMarker);
      this.getRoutes(last.location, bus.currentLocation, 'blue').then(poly => {
        this.polylines.last = poly;
      })
    }
    // previous
    if (bus.visitedBusStops && bus.visitedBusStops.length > 1) {
      let first = bus.visitedBusStops[0];
      let firstBusStopMarker = this.addMarker(first.location.latitude, first.location.longitude, false, first.busStopName);
      this.markers.stops.push(firstBusStopMarker);
      for (let key in bus.visitedBusStops) {
        let i = parseInt(key);
        if (i !== (bus.visitedBusStops.length - 1)) {
          let start = bus.visitedBusStops[i];
          let stop = bus.visitedBusStops[i + 1];
          let busStopMarker = this.addMarker(stop.location.latitude, stop.location.longitude, false, stop.busStopName);
          this.markers.stops.push(busStopMarker);
          this.getRoutes(stop.location, start.location, 'blue').then(poly => {
            this.polylines.previous.push(poly);
          })
        }
      };
    }
  }

  moveBus() {
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
    //           iconUrl: 'bus.png',
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

  getRoutes(start, stop, color) {
    return this.server.getRoute(start, stop).toPromise().then((data: any) => {
      let points;
      if (data.results.trips.length)
        points = this.utils.decode(data.results.trips[0].pts);
      return this.plotLine(points, color);
    }).catch(error => {
      console.log(error);
      this.utils.alert('Map Routing error', error.message);
    });
  }


}
