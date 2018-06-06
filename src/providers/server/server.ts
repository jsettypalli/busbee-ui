import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CongnitoProvider } from '../congnito/congnito';

/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  public map;
  private url = 'http://52.66.155.37:8080';
  public runningBusses = [];

  constructor(private http: HttpClient, private cognito: CongnitoProvider) {
  }

  onGetRunningBuses() {
    return this.http.get(this.url + '/app/get_running_buses', {
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
      }
    }).toPromise().then((result: [any]) => {
      this.runningBusses = result;
      return result;
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  registerDevice(deviceDetails, isReplace) {
    let method = isReplace === 1 ? 'post' : 'put';
    let url = this.url + '/app/devices';
    return this.http.request(method, url, {
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
      },
      params: deviceDetails
    })
  }

  getRoute(start, end) {
    const licenceKey = 'gphew1aw7wl5eo2tck9pzxljtnr3gbq8';
    let url = 'http://apis.mapmyindia.com/advancedmaps/v1/' + licenceKey + '/route'
    return this.http.get(url, {
      params: {
        start: start.latitude + ',' + start.longitude,
        destination: end.latitude + ',' + end.longitude
      }
    });
  }

  getRoutingById(trip_id, vehicle_id, bustStopId) {
    return this.http.get(this.url + '/app/routes/via_points', {
      params: {
        trip_id: trip_id,
        vehicle_id: vehicle_id,
        next_bus_stop_id: bustStopId
      },
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
      }
    })
  }

  saveSettings(minutes, enabled) {
    return this.http.request('post', this.url + '/app/settings_notification', {
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
      },
      params: {
        minutes: minutes,
        enabled: enabled
      }
    })
  }

  getSettings() {
    return this.http.get(this.url + '/app/settings_notification', {
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
      }
    })
  }

}
