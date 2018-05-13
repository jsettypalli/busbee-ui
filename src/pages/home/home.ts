import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  MapmyIndia: any;

  constructor(public navCtrl: NavController) {
    this.MapmyIndia = (<any>window).MapmyIndia;
  }

  ngAfterViewInit() {
    var map = new this.MapmyIndia.Map("map", { center: [28.61, 77.23], zoomControl: true, hybrid: true });
  }

}
