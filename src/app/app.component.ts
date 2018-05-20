import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CongnitoProvider } from '../providers/congnito/congnito';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private congnito: CongnitoProvider,
    private toast: ToastController, private modalCtrl: ModalController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (!localStorage.isLoggedIn || localStorage.isLoggedIn == 'undefined') {
        this.nav.setRoot(LoginPage);
      }
      else {
        this.congnito.localLogin((result) => {
          this.nav.setRoot(HomePage);
          let toast = this.toast.create({
            message: 'Logged in as ' + result.idToken.payload.email,
            duration: 3000
          });
          toast.present();
        }, (error) => {
          this.nav.setRoot(LoginPage);
        });
      }
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  openSettings() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }
  logout() {
    delete localStorage.isLoggedIn;
    this.congnito.logoutUser();
    window.location.reload();
  }
}
