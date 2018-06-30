import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Device } from '@ionic-native/device';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PhotoPage } from '../pages/photo/photo';
import { CongnitoProvider } from '../providers/congnito/congnito';
import { SettingsPage } from '../pages/settings/settings';
import { UtilsProvider } from '../providers/utils/utils';
import { ServerProvider } from '../providers/server/server';
import { MockDataProvider } from '../providers/mock-data/mock-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, AfterViewInit {
  private _homePage;
  @ViewChild(HomePage)
  set homePage(homePage: HomePage) {
    this._homePage = homePage;
    this.initialize();
  }

  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  private buses = [];
  public role;
  public message: any;
  public isBusMoving: boolean;

  constructor(public platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private congnito: CongnitoProvider,
    private modalCtrl: ModalController,
    private push: Push,
    private utils: UtilsProvider,
    private device: Device,
    private server: ServerProvider,
    public mockData: MockDataProvider) {
  }

  ngOnInit() {
    // TODO: remove mock data
    // this.message = this.mockData.notificationMessage
  }

  ngAfterViewInit() { }

  initialize() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.silentLogin();
      this._homePage.bus = null;
    });
  }

  onBusMoving(isBusMoving) {
    this.isBusMoving = isBusMoving
  }

  silentLogin() {
    if (!localStorage.isLoggedIn || localStorage.isLoggedIn == 'undefined') {
      this.login();
    }
    else {
      this.congnito.localLogin((result) => {
        this.getPushToken();
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
      this.buses = result;
      if (this.buses.length) {
        if (!index)
          selectedTrip = result[0];
        else
          selectedTrip = result[index];
        this.utils.toast('Role: ' + selectedTrip.role);
        this.role = selectedTrip.role;
        this._homePage.selectBus(selectedTrip);
      } else {
        this.onNotification({
          text: 'No bus is scheduled to run for the rest of the day.'
        });
      }
    }).catch(err => {
      if (selectedTrip) {
        this.utils.alert('Error', err.message);
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
            });
          });

        } else {
          this.utils.alert('Push Notification', 'We do not have permission to send push notifications');
        }
      });
  }

  handleNotification(notification) {
    // this.utils.alert('Notification', notification.message);
    if (notification.additionalData) {
      this.onNotification(notification.additionalData);
      if (notification.additionalData.event === 'start_bus')
        this.selectBus(0);
    }
  }

  registerDevice(registration) {
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
      }, error => {
        this.utils.alert('Device Registration Error', error.message);
      });
    localStorage.registrationId = registration.registrationId;
  }

  changePassword() {
    let loginModal = this.modalCtrl.create(LoginPage, { view: 'changePassword' });
    loginModal.onDidDismiss(data => {
      this.silentLogin();
    });
    loginModal.present();
  }


  mockDriver() {
    this.mockData.useMockData = true;
    this.utils.alert('Mock Data', 'Mocking a DRIVER');
    this.getBusses();
  }

  stopMock() {
    this.mockData.useMockData = false;
    this.utils.alert('Mock Data', 'Stop mocking data');
    this.getBusses();
  }

  onNotification(message) {
    this.message = message;
    this.message.show = true;
  }

  locateBus() {
    this._homePage.reCenter();
  }

  showDriverImage() {
    if (this.message.driver_image_url) {
      let photoModal = this.modalCtrl.create(PhotoPage, { imageUrl: this.message.driver_image_url });
      photoModal.present();
    }
  }

}
