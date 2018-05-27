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
    private server: ServerProvider) {
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

  mockResult = [{
    'role': 'PARENT',
    inTransit: true,
    'tripId': 1,
    'busId': 1,
    'startDateTime': '2018-05-09 7:00 AM IST',
    'currentLocation': { 'latitude': 12.9670893, 'longitude': 80.2432824 },
    'visitedBusStops': [
      {
        busStopName: 'Madhya Kailash',
        location: { 'latitude': 13.0065521, 'longitude': 80.2447926 }
      },
      {
        busStopName: 'Thiruvanmiyur',
        location: { 'latitude': 12.9832548, 'longitude': 80.2491742 }
      }
    ],
    'nextBusStop': {
      busStopName: 'Medavakkam',
      location: { 'latitude': 12.9181872, 'longitude': 80.1949488 }
    }
  }, {
    'role': 'PARENT',
    inTransit: true,
    'tripId': 4,
    'busId': 4,
    'startDateTime': '2018-05-09 7:00 AM IST',
    'currentLocation': { 'latitude': 12.9832548, 'longitude': 80.2491742 },
    'visitedBusStops': [
      {
        busStopName: 'Medavakkam',
        location: { 'latitude': 12.9181872, 'longitude': 80.1949488 }
      }
    ],
    'nextBusStop': {
      busStopName: 'Madhya Kailash',
      location: { 'latitude': 13.0065521, 'longitude': 80.2447926 }
    }
  },
  {
    'role': 'PARENT',
    inTransit: false,
    'tripId': 2,
    'busId': 2,
    'startDateTime': '2018-05-25T07:00:39.892Z',
    'currentLocation': null,
    'visitedBusStops': null,
    'nextBusStop': {
      'busStopName': 'Bhavyas Alluri Meadows',
      'location': { 'id': 5, 'latitude': 17.453597, 'longitude': 78.366742 }
    }
  },
  {
    'role': 'TRANSPORT_INCHARGE',
    inTransit: false,
    'tripId': 3,
    'busId': 3,
    'startDateTime': '2018-05-25T07:00:39.892Z',
    'currentLocation': null,
    'visitedBusStops': null,
    'nextBusStop': {
      'busStopName': 'Bhavyas Alluri Meadows',
      'location': { 'id': 5, 'latitude': 17.453597, 'longitude': 78.366742 }
    }
  }];

  getBusses(busId?) {
    let selectedTrip = null;
    this._homePage.clearPolyLines();
    this.server.onGetRunningBuses().then((result: any) => {
      result = this.mockResult
      this.buses = result;
      console.log(result);
      if (!busId)
        selectedTrip = result[0];
      else
        selectedTrip = result.find(bus => bus.busId === busId)
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

  selectBus(bus) {
    this.getBusses(bus.busId);
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
              console.log(notification);
              this.utils.alert('Notification', notification.message);
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
