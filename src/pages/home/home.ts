import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../../providers/utils/utils';
import { Subscription } from 'rxjs/Subscription';
import * as io from 'socket.io-client';

// import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy, OnInit {
  MapmyIndia: any;
  private map;
  public bus;
  private locationWatch;
  private socket;
  private drivePath = [];

  constructor(
    private server: ServerProvider,
    private geolocation: Geolocation,
    private utils: UtilsProvider) {
    this.MapmyIndia = (<any>window).MapmyIndia;
  }

  ngOnInit() {
    this.socket = io('ws://52.66.155.37:8080/transportws/');
  }

  ngAfterViewInit() {
    this.geolocation.getCurrentPosition().then(data => {
      var center = (<any>window).L.LatLng(data.coords.latitude, data.coords.longitude);
      this.map = new this.MapmyIndia.Map('map', { center: center, zoomControl: true, hybrid: true });
      this.server.map = this.map;
    })
  }

  selectBus(bus) {
    this.utils.toast('TRIP: ' + bus.tripId + '; BUS: ' + bus.busId + '  ;');
    if (bus.role === 'DRIVER') {
      this.drive(bus);
    } else {
      this.socket.on('/subscribe/busposition/' + bus.tripId + '/' + bus.busId, (data) => {
        console.log(data);
      });
      // this.socket.subscribe((message: Message) => {
      //   console.log(`Received: ${message.body}`);
      // });
    }
  }

  ngOnDestroy() {
    this.locationWatch.unsubscribe();
  }

  addMarker(lat, lng) {
    (<any>window).L.marker([lat, lng]).addTo(this.map);
  }

  drive(bus) {
    this.locationWatch = this.geolocation.watchPosition();
    this.locationWatch.subscribe((data) => {
      let position = {
        busId: bus.busId,
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      };
      this.socket.emit('/publish/busposition/' + bus.tripId + '/' + bus.busId, JSON.stringify(position));

      this.addMarker(data.coords.latitude, data.coords.longitude);
      this.map.panTo([data.coords.latitude, data.coords.longitude]);
      // this.utils.toast('Lat:' + data.coords.latitude + '; Lng:' + data.coords.longitude);

      var center = new (<any>window).L.LatLng(data.coords.latitude, data.coords.longitude);
      this.drivePath.push(center);
      var polylineParam = { weight: 4, opacity: 0.5 }
      var poly = new (<any>window).L.Polyline(this.drivePath, polylineParam);
      this.map.addLayer(poly);
    });
  }

  plotLine(result) {
    this.addMarker(result.current_position.latitude, result.current_position.longitude);
    this.map.panTo([result.current_position.latitude, result.current_position.longitude]);
    let points = [];
    result.visited_bus_stops.forEach(stop => {
      let stopDetails = (<any>Object).entries(stop);
      let stopName = stopDetails[0][0];
      let stopCords = stopDetails[0][1];
      this.addMarker(stopCords.latitude, stopCords.longitude);
      points.push(new (<any>window).L.LatLng(stopCords.latitude, stopCords.longitude));
    });

    var polylineParam = { weight: 4, opacity: 0.5 }
    var poly = new (<any>window).L.Polyline(points, polylineParam);
    this.map.addLayer(poly);
  }



}
