import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  private loader;
  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController) {
  }

  alert(title, subTitle, button?) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [button ? button : 'OK']
    });
    alert.present();
  }

  toast(msg, showButton?) {
    // let toast = this.toastController.create({
    //   message: msg,
    //   duration: 5000,
    //   showCloseButton: showButton ? showButton : false
    // });
    // toast.present();
    console.log(msg);
  }

  presentLoading(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }

  dismissLoading() {
    if (this.loader)
      this.loader.dismiss();
    this.loader = null;
  }

  decode(encoded) {
    var points = [];
    var testPoints = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
      var b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      let latlng = new (<any>window).L.LatLng((lat / 1E6), (lng / 1E6));
      testPoints.push({
        coords: {
          latitude: lat / 1E6,
          longitude: lng / 1E6
        }
      });
      points.push(latlng)
    }
    return points
  }

  angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    if (dx == 0) {
      if (dy >= 0)
        return 90
      else
        return 270
    } else {
      var theta = Math.atan2(dy, dx); // range (-PI, PI]
      theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
      //if (theta < 0) theta = 360 + theta; // range [0, 360)
      return theta;
    }
  }

}
