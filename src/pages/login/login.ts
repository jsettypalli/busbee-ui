import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CongnitoProvider } from '../../providers/congnito/congnito';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user;
  public password;

  constructor(public navCtrl: NavController, public navParams: NavParams, private congnitoProvider: CongnitoProvider) {

  }

  change() {
    this.congnitoProvider.changePassword(this.user, this.password, 'GetUrApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.congnitoProvider.signinUser(this.user, this.password, 'GetUrApp')
  }


}
