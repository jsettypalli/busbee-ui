import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

  public imageUrl;

  constructor(navParams: NavParams, private viewCtrl: ViewController, ) {
    this.imageUrl = navParams.get('imageUrl');
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
