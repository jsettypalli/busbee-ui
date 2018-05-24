import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Pro } from '@ionic/pro';

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
    console.log('Hello UtilsProvider Provider');
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
    let toast = this.toastController.create({
      message: msg,
      duration: 5000,
      showCloseButton: showButton ? showButton : false
    });
    toast.present();
  }

  ionicMonitoring(err) {
    Pro.monitoring.exception(err);
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

}
