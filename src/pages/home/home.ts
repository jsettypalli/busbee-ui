import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../../providers/utils/utils';
import { Subscription } from 'rxjs/Subscription';

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
    last: null
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

  mockBus = {
    'role': 'PARENT',
    'tripId': 1,
    'busId': 2,
    'startDateTime': '2018-05-09 7:00 AM IST',
    'currentLocation': { 'latitude': 12.9670893, 'longitude': 80.2432824 },
    'visitedBusStops': [
      {
        busStopName: 'Madhya Kailash',
        location: { 'latitude': 13.0065521, 'longitude': 80.2447926 }
      },
      {
        busStopName: 'Thiruvanmiyur',
        location: { 'latitude': 12.9832548, 'longitude': 80.2491742 }
      }
    ],
    'nextBusStop': {
      busStopName: 'Medavakkam',
      location: { 'latitude': 12.9181872, 'longitude': 80.1949488 }
    }
  };

  selectBus(bus) {
    bus = this.mockBus;
    this.utils.toast('TRIP: ' + bus.tripId + '; BUS: ' + bus.busId + '  ;');
    // bus not started. TODO: isStarted flag
    if (!bus.currentLocation) {
      this.message = {
        id: bus.busId,
        time: bus.startDateTime
      }
      // TODO: switch to active mode. how to?
    } else
      if (bus.role === 'DRIVER') {
        this.drive(bus);
        this.plotRoute(bus);
      } else {
        this.connectWS(() => {
          this.stompClient.subscribe('/subscribe/busposition/' + bus.tripId + '/' + bus.busId, (message) => {
            console.log(message);
            this.moveBus();
          });
        }, () => { });
        this.plotRoute(bus);
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
      h = 100;
    let icon = (<any>window).L.icon({
      iconUrl: isBus ? 'assets/imgs/bus.png' : 'assets/imgs/marker.png',
      iconAnchor: [w / 2, h / 2], //Handles the marker anchor point. For a correct anchor point [ImageWidth/2,ImageHeight/2]
      iconSize: [40, 100]
    })
    let options = {
      icon: icon,
      title: title ? title : null
    }
    let marker = (<any>window).L.marker([lat, lng], options).addTo(this.map);
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
      this.addMarker(bus.currentLocation.latitude, bus.currentLocation.longitude, true);
      var center = new (<any>window).L.LatLng(bus.currentLocation.latitude, bus.currentLocation.longitude);
      this.map.panTo(center);
    }
    // current to next
    // TODO: how to get nextBusStop on websocket
    if (bus.currentLocation)
      this.getRoutes(bus.currentLocation, bus.nextBusStop.location, 'blue').then(poly => {
        this.map.fitBounds(poly.getBounds());
        this.addMarker(bus.nextBusStop.location.latitude, bus.nextBusStop.location.longitude, false, bus.nextBusStop.busStopName);
        this.polylines.current = poly;
      })

    // last to current
    if (bus.visitedBusStops && bus.visitedBusStops.length) {
      let last = bus.visitedBusStops[bus.visitedBusStops.length - 1];
      this.addMarker(last.location.latitude, last.location.longitude, false, last.busStopName);
      this.getRoutes(last.location, bus.currentLocation, '#148d73').then(poly => {
        this.map.fitBounds(poly.getBounds());
        this.polylines.last = poly;
      })
    }
    // previous
    if (bus.visitedBusStops && bus.visitedBusStops.length > 1) {
      let first = bus.visitedBusStops[0];
      this.addMarker(first.location.latitude, first.location.longitude, false, first.busStopName);
      for (let key in bus.visitedBusStops) {
        let i = parseInt(key);
        if (i !== (bus.visitedBusStops.length - 1)) {
          let start = bus.visitedBusStops[i];
          let stop = bus.visitedBusStops[i + 1];
          this.addMarker(stop.location.latitude, stop.location.longitude, false, stop.busStopName);
          this.getRoutes(stop.location, start.location, 'green').then(poly => {
            this.map.fitBounds(poly.getBounds());
            this.polylines.last = poly;
          })
        }
      };
    }
  }

  moveBus() {

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
