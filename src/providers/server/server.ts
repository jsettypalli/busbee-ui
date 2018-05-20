import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private headers;

  constructor(private http: HttpClient, private cognito: CongnitoProvider) {
    this.headers = new HttpHeaders();
    this.headers.set('Authorization', 'Bearer ' + this.cognito.tokens.idToken.jwtToken);
    this.headers.set('Access-Control-Allow-Origin', 'http://52.66.155.37:8080');
    console.log(this.headers);
  }

  initialise() {
    return Promise.resolve({
      "role": "DRIVER",
      "trip_id": 1,
      "bus_id": 2,
      "start_time": "2018-05-09 7:00 AM IST",
      "current_position": { "latitude": 23.4567, "longitude": 75.4567 },
      "visited_bus_stops": [
        { "miyapur": { "latitude": 21.3456, "longitude": 72.3456 } },
        { "RTA Kondapur": { "latitude": 21.3456, "longitude": 72.3456 } }
      ],
      "next_bus_stop": { "Hanuman Nagar": { "latitude": 21.3456, "longitude": 72.3456 } }
    }
    );
  }

  onGetRunningBuses() {
    return this.http.get(this.url + '/app/get_running_buses', {
      headers: {
        'Authorization': 'Bearer ' + this.cognito.tokens.idToken.jwtToken,
        'Access-Control-Allow-Origin': 'http://52.66.155.37:8080'
      }
    });
  }

}
