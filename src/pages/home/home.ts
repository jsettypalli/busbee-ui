import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  MapmyIndia: any;
  private map;

  constructor(public navCtrl: NavController, private server: ServerProvider, private geolocation: Geolocation,
    private toastController: ToastController) {
    this.MapmyIndia = (<any>window).MapmyIndia;
  }

  ngAfterViewInit() {
    this.map = new this.MapmyIndia.Map("map", { center: [28.61, 77.23], zoomControl: true, hybrid: true });
    this.server.initialise().then(result => {
      if (result.role === 'DRIVER') {
        this.drive();
      }
      this.plotLine(result)
    });
  }

  drive() {
    this.toast('I am a Driver');
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log(data);
      (<any>window).L.marker([data.coords.latitude, data.coords.longitude]).addTo(this.map);
      // this.map.panTo([data.coords.latitude, data.coords.longitude]);
      this.toast('Lat:' + data.coords.latitude + '; Lng:' + data.coords.longitude);

      // var center = new (<any>window).L.LatLng(data.coords.latitude, data.coords.longitude);
      // var pts1 = [
      //   new (<any>window).L.LatLng(center.lat - 150 / 10000, center.lng - 150 / 10000),
      //   new (<any>window).L.LatLng(center.lat + 0 / 10000, center.lng - 50 / 10000),
      //   new (<any>window).L.LatLng(center.lat + 50 / 10000, center.lng - 100 / 10000),
      //   new (<any>window).L.LatLng(center.lat + 70 / 10000, center.lng + 50 / 10000),
      //   new (<any>window).L.LatLng(center.lat - 70 / 10000, center.lng + 100 / 10000)
      // ];
      // var polylineParam = { weight: 4, opacity: 0.5 }
      // var poly = new (<any>window).L.Polyline(pts1, polylineParam);
      // this.map.addLayer(poly);
    });
  }

  plotLine(result) {
    (<any>window).L.marker([result.current_position.latitude, result.current_position.longitude]).addTo(this.map);
    this.map.panTo([result.current_position.latitude, result.current_position.longitude]);
    let points = [];
    result.visited_bus_stops.forEach(stop => {
      let stopDetails = (<any>Object).entries(stop);
      let stopName = stopDetails[0][0];
      let stopCords = stopDetails[0][1];
      (<any>window).L.marker([stopCords.latitude, stopCords.longitude]).addTo(this.map);
      points.push(new (<any>window).L.LatLng(stopCords.latitude, stopCords.longitude));
    });

    var polylineParam = { weight: 4, opacity: 0.5 }
    var poly = new (<any>window).L.Polyline(points, polylineParam);
    this.map.addLayer(poly);
  }

  toast(data) {
    let toast = this.toastController.create({
      message: data,
      duration: 3000
    });
    toast.present();
  }



}
