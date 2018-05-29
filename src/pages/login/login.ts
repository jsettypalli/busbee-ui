import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { CongnitoProvider } from '../../providers/congnito/congnito';

import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user;
  public password;
  public newPassword;
  private userAttributes;
  public view = 'login';
  public verificationCode;
  // {
  //   login: true,
  //   newPassword: false,
  //   forgotPassword: false,
  //   changePassword: false
  // }

  constructor(private congnitoProvider: CongnitoProvider,
    private utils: UtilsProvider,
    private viewCtrl: ViewController,
    params: NavParams) {
    let view = params.get('view');
    if (view)
      this.view = view;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.congnitoProvider.signinUser(this.user,
      this.password,
      this.onSuccessfulLogin.bind(this),
      this.onFailedLogin.bind(this),
      this.onNewPassword.bind(this))
  }

  onSuccessfulLogin(result) {
    localStorage.isLoggedIn = true;
    this.view = 'login'
    this.viewCtrl.dismiss();
  }

  onFailedLogin(error) {
    localStorage.isLoggedIn = undefined;
    this.view = 'login';
    this.password = null;
    this.utils.alert('Login Error', error.message)
  }

  onNewPassword(userAttributes) {
    this.userAttributes = userAttributes;
    this.view = 'newPassword';
  }

  setnewPassword() {
    this.congnitoProvider.setNewPassword(
      this.newPassword,
      this.userAttributes,
      this.onSuccessfulLogin.bind(this),
      this.onFailedLogin.bind(this))
  }

  forgetPassword() {
    this.congnitoProvider.forgotPassword(this.user, (result) => {
      console.log('forgetPassword', result);
      this.view = 'login';
    }, this.onFailedLogin.bind(this), () => {
      this.view = 'verificationCode';
    })
  }

  confirmPassword() {
    this.congnitoProvider.confirmPassword(this.verificationCode, this.password, () => {
      console.log('confirmPassword');
      this.view = 'login';
    }, this.onFailedLogin.bind(this))
  }

  changePassword() {
    this.congnitoProvider.changePassword(this.password, this.newPassword, (result) => {
      console.log('changePassword', result);
      this.password = null;
      this.view = 'login';
    }, this.onFailedLogin.bind(this))
  }


}
