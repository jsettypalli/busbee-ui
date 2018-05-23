import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Pro } from '@ionic/pro';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Push } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
// import { StompConfig, StompService } from '@stomp/ng2-stompjs';

import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CongnitoProvider } from '../providers/congnito/congnito';
import { ServerProvider } from '../providers/server/server';
import { UtilsProvider } from '../providers/utils/utils';

Pro.init('76fdbaae', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

// const stompConfig: StompConfig = {
//   url: 'ws://52.66.155.37:8080/transportws',
//   headers: {
//     login: 'guest',
//     passcode: 'guest'
//   },
//   heartbeat_in: 0, // Typical value 0 - disabled
//   heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
//   reconnect_delay: 5000,
//   debug: true
// };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],
    CongnitoProvider,
    ServerProvider,
    Geolocation,
    Push,
    Device,
    UtilsProvider
    // StompService,
    // {
    //   provide: StompConfig,
    //   useValue: stompConfig
    // }
  ]
})
export class AppModule { }
