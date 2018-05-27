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
  // private busNotify = new Subject<any>();
  // busNotifyObservable = this.busNotify.asObservable();
  private url = 'http://52.66.155.37:8080';
  public runningBusses = [];

  constructor(private http: HttpClient, private cognito: CongnitoProvider) {
  }

  // public notifyBus(bus) {
  //   this.busNotify.next(bus);
  // }

  onGetRunningBuses() {
    // this.http.get('http://52.66.155.37:8080/temp/load_running_buses_data', {
    //   headers: {
    //     'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken
    //   }
    // }).subscribe(data => console.log(data));
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

}
