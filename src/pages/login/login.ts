import { Component, ViewChild } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { CongnitoProvider } from '../../providers/congnito/congnito';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user;
  public password;

  constructor(private congnitoProvider: CongnitoProvider, private alertCtrl: AlertController) {

  }

  change() {
    this.congnitoProvider.changePassword(this.user, this.password, 'GetUrApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.congnitoProvider.signinUser(this.user, this.password, this.onSuccessfulLogin, this.onFailedLogin)
  }

  onSuccessfulLogin() {
    localStorage.isLoggedIn = true;
    window.location.reload()
  }

  onFailedLogin() {
    localStorage.isLoggedIn = undefined;
    let alert = this.alertCtrl.create({
      title: 'Login Error',
      subTitle: 'The username or password is wrong. Please try again',
      buttons: ['OK']
    });
    alert.present();
  }


}
