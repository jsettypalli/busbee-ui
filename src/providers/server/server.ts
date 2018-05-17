import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ServerProvider Provider');
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

}
