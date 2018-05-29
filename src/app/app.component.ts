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
import { MockDataProvider } from '../providers/mock-data/mock-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, AfterViewInit {
  // @ViewChild(Nav) nav: Nav;
  private _homePage;
  @ViewChild(HomePage)
  set homePage(homePage: HomePage) {
    this._homePage = homePage;
    this.initialize();
  }

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
    private server: ServerProvider,
    private mockData: MockDataProvider) {
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  initialize() {
    this.platform.ready().then(() => {
      this.getPushToken();
      this.statusBar.styleDefault();
      // this.nav.setRoot(HomePage);
      this.silentLogin();
      this._homePage.bus = null;
    });
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

  getBusses(index?) {
    let selectedTrip = null;
    this._homePage.clearPolyLines();
    this.server.onGetRunningBuses().then((result: any) => {
      if (this.mockData.useMockData)
        result = this.mockData.serverResponse;
      this.buses = result;
      console.log(result);
      if (!index)
        selectedTrip = result[0];
      else
        selectedTrip = result[index];
      this.utils.toast('Role: ' + selectedTrip.role);
      this._homePage.selectBus(selectedTrip);
    }).catch(err => {
      if (selectedTrip) {
        this.utils.alert('Map Error', err.message);
        this._homePage.selectBus(selectedTrip);
      }
      else
        this.utils.alert('Get Running Buses', err.message);
    });
  }

  selectBus(index) {
    this.getBusses(index);
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
            id: 'busbee_mobile',
            description: 'mobile notification channel',
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 3
          }).then(() => {
            const options: PushOptions = {
              android: {
                senderID: '244688974000',
                sound: true,
                vibrate: true,
                icon: 'icon',
                iconColor: 'blue'
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
              this.handleNotification(notification);
            });
            pushObject.on('registration').subscribe((registration: any) => {
              this.registerDevice(registration);
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

  handleNotification(notification) {
    console.log(notification);
    this.utils.alert('Notification', notification.message);
    if (notification.additionalData) {
      console.log(notification.additionalData.event);
      this._homePage.message = notification.additionalData;
      this._homePage.message.text = notification.message;
      this._homePage.message.title = notification.title;
      if (notification.additionalData.event === 'start_bus')
        this.selectBus(0);
    }

  }

  registerDevice(registration) {
    console.log('Device registered', registration);
    console.log(this.device);
    let deviceDetails = {
      platform: this.device.platform.toLowerCase(),
      device_id: this.device.uuid,
      application_token: registration.registrationId
    }
    let isReplace = 0;
    if (localStorage.registrationId === 'undefined' || localStorage.registrationId === undefined) {
      isReplace = 1;
    } else if (localStorage.registrationId !== registration.registrationId) {
      isReplace = 2;
    }
    if (isReplace)
      this.server.registerDevice(deviceDetails, isReplace).subscribe(data => {
        this.utils.toast('Device registered');
      }, error => {
        this.utils.alert('Device Registration Error', error.message);
      });
    localStorage.registrationId = registration.registrationId;
  }
}
