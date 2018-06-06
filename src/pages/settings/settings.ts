import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit {

  public notifications = [{
    notificationMinutes: 15,
    enabled: false
  },
  {
    notificationMinutes: 10,
    enabled: false
  },
  {
    notificationMinutes: 5,
    enabled: false
  },
  {
    notificationMinutes: 0,
    enabled: false
  }]

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private server: ServerProvider,
    private utils: UtilsProvider) {
  }

  ngOnInit() {
    this.server.getSettings().subscribe((settings: any) => {
      settings.forEach(setting => {
        if (setting.enabled) {
          let enabledMin = this.notifications.find(item => item.notificationMinutes === setting.notificationMinutes);
          enabledMin.enabled = true;
        }
      });
    }, err => {
      this.utils.alert('Settings Error', err.message);
    })
  }

  saveSettings(minutes, enabled) {
    this.server.saveSettings(minutes, enabled).subscribe(data => {
    }, (err) => {
      this.utils.alert('Save Settings Error', err.message)
    });
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
