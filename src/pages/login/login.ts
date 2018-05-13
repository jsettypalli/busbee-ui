import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CongnitoProvider } from '../../providers/congnito/congnito';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user;
  public password;

  constructor(private congnitoProvider: CongnitoProvider) {

  }

  change() {
    this.congnitoProvider.changePassword(this.user, this.password, 'GetUrApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.congnitoProvider.signinUser(this.user, this.password, this.onSuccessfulLogin)
  }

  onSuccessfulLogin() {
    localStorage.isLoggedIn = true;
    window.location.reload()
  }


}
