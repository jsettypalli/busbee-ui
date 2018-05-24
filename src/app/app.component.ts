import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Device } from '@ionic-native/device';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CongnitoProvider } from '../providers/congnito/congnito';
import { SettingsPage } from '../pages/settings/settings';
import { UtilsProvider } from '../providers/utils/utils';
import { ServerProvider } from '../providers/server/server';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, AfterViewInit {
  // @ViewChild(Nav) nav: Nav;
  @ViewChild(HomePage) homePage: HomePage;

  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  private buses = [];

  constructor(public platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private congnito: CongnitoProvider,
    private modalCtrl: ModalController,
    private push: Push,
    private utils: UtilsProvider,
    private device: Device,
    private server: ServerProvider) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.getPushToken();
      this.statusBar.styleDefault();
      // this.nav.setRoot(HomePage);
      this.homePage.bus = null;
      this.silentLogin();
    });
  }

  ngAfterViewInit() {

  }

  silentLogin() {
    if (!localStorage.isLoggedIn || localStorage.isLoggedIn == 'undefined') {
      this.login();
    }
    else {
      this.congnito.localLogin((result) => {
        this.splashScreen.hide();
        localStorage.isLoggedIn = true;
        this.utils.toast('Logged in as ' + result.idToken.payload.email);
        this.getBusses();
      }, (error) => {
        this.login();
      });
    }
  }

  login() {
    let loginModal = this.modalCtrl.create(LoginPage);
    loginModal.onDidDismiss(data => {
      this.silentLogin();
    });
    this.splashScreen.hide();
    loginModal.present();
  }

  logout() {
    delete localStorage.isLoggedIn;
    this.congnito.logoutUser();
    this.login();
  }

  getBusses() {
    this.server.onGetRunningBuses().then((result: any) => {
      this.buses = result;
      console.log(result);
      this.utils.toast('Role: ' + result[0].role);
      this.homePage.selectBus(result[0]);
    }).catch(err => {
      this.utils.alert('Get Running Buses', err.message);
    });
  }

  selectBus(bus) {
    this.homePage.selectBus(bus);
  }

  openSettings() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

  getPushToken() {
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          this.push.createChannel({
            id: "busbee_mobile",
            description: "mobile notification channel",
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
          }).then(() => {
            const options: PushOptions = {
              android: {
                sound: true,
                vibrate: true
              },
              ios: {
                alert: true,
                badge: true,
                sound: true
              },
              windows: {},
              browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
              }
            };
            const pushObject: PushObject = this.push.init(options);
            pushObject.on('notification').subscribe((notification: any) => {
              console.log(notification);
              this.utils.alert('Notification', notification.message);
            });
            pushObject.on('registration').subscribe((registration: any) => {
              console.log('Device registered', registration);
              console.log(this.device);
            });
            pushObject.on('error').subscribe(error => {
              this.utils.alert('Error with Push plugin', error.message);
              this.utils.ionicMonitoring(error);
            });
          });

        } else {
          this.utils.alert('Push Notification', 'We do not have permission to send push notifications');
        }
      });
  }
}
