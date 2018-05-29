import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the MockDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MockDataProvider {

  constructor() {
    console.log('Hello MockDataProvider');
  }

  public useMockData = false;
  public role = 'PARENT';

  private parentResponse = [{
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
    'tripId': 2,
    'busId': 2,
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

  private driverResponse = [{
    'role': 'DRIVER',
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
  }];

  private travelPoints = [{ "coords": { "latitude": 12.967082, "longitude": 80.243353 } }, { "coords": { "latitude": 12.967109, "longitude": 80.24369 } }, { "coords": { "latitude": 12.967088, "longitude": 80.244033 } }, { "coords": { "latitude": 12.967004, "longitude": 80.245278 } }, { "coords": { "latitude": 12.967339, "longitude": 80.245428 } }, { "coords": { "latitude": 12.967527, "longitude": 80.245503 } }, { "coords": { "latitude": 12.967349, "longitude": 80.245814 } }, { "coords": { "latitude": 12.967328, "longitude": 80.245878 } }, { "coords": { "latitude": 12.966565, "longitude": 80.246007 } }, { "coords": { "latitude": 12.965352, "longitude": 80.246211 } }, { "coords": { "latitude": 12.963982, "longitude": 80.246458 } }, { "coords": { "latitude": 12.963491, "longitude": 80.24664 } }, { "coords": { "latitude": 12.963418, "longitude": 80.246683 } }, { "coords": { "latitude": 12.963345, "longitude": 80.246651 } }, { "coords": { "latitude": 12.96324, "longitude": 80.246597 } }, { "coords": { "latitude": 12.962989, "longitude": 80.246468 } }, { "coords": { "latitude": 12.962529, "longitude": 80.246243 } }, { "coords": { "latitude": 12.962121, "longitude": 80.24605 } }, { "coords": { "latitude": 12.961316, "longitude": 80.245653 } }, { "coords": { "latitude": 12.960981, "longitude": 80.245492 } }, { "coords": { "latitude": 12.960103, "longitude": 80.245106 } }, { "coords": { "latitude": 12.959308, "longitude": 80.24473 } }, { "coords": { "latitude": 12.95889, "longitude": 80.244548 } }, { "coords": { "latitude": 12.957844, "longitude": 80.244087 } }, { "coords": { "latitude": 12.957394, "longitude": 80.243915 } }, { "coords": { "latitude": 12.95708, "longitude": 80.243797 } }, { "coords": { "latitude": 12.956568, "longitude": 80.243582 } }, { "coords": { "latitude": 12.955617, "longitude": 80.243196 } }, { "coords": { "latitude": 12.955345, "longitude": 80.243089 } }, { "coords": { "latitude": 12.954906, "longitude": 80.242917 } }, { "coords": { "latitude": 12.954613, "longitude": 80.242788 } }, { "coords": { "latitude": 12.954561, "longitude": 80.242767 } }, { "coords": { "latitude": 12.954038, "longitude": 80.242563 } }, { "coords": { "latitude": 12.953892, "longitude": 80.242499 } }, { "coords": { "latitude": 12.953672, "longitude": 80.242413 } }, { "coords": { "latitude": 12.953139, "longitude": 80.242198 } }, { "coords": { "latitude": 12.952658, "longitude": 80.242005 } }, { "coords": { "latitude": 12.952574, "longitude": 80.241973 } }, { "coords": { "latitude": 12.95248, "longitude": 80.24193 } }, { "coords": { "latitude": 12.952072, "longitude": 80.241769 } }, { "coords": { "latitude": 12.951549, "longitude": 80.241597 } }, { "coords": { "latitude": 12.950807, "longitude": 80.24135 } }, { "coords": { "latitude": 12.950389, "longitude": 80.241221 } }, { "coords": { "latitude": 12.949155, "longitude": 80.240813 } }, { "coords": { "latitude": 12.948967, "longitude": 80.240738 } }, { "coords": { "latitude": 12.948894, "longitude": 80.240717 } }, { "coords": { "latitude": 12.948915, "longitude": 80.240642 } }, { "coords": { "latitude": 12.949009, "longitude": 80.240331 } }, { "coords": { "latitude": 12.949145, "longitude": 80.239816 } }, { "coords": { "latitude": 12.949354, "longitude": 80.238958 } }, { "coords": { "latitude": 12.949396, "longitude": 80.238754 } }, { "coords": { "latitude": 12.949532, "longitude": 80.237906 } }, { "coords": { "latitude": 12.949741, "longitude": 80.236436 } }, { "coords": { "latitude": 12.949762, "longitude": 80.236297 } }, { "coords": { "latitude": 12.949804, "longitude": 80.235879 } }, { "coords": { "latitude": 12.949867, "longitude": 80.235589 } }, { "coords": { "latitude": 12.949898, "longitude": 80.235374 } }, { "coords": { "latitude": 12.949982, "longitude": 80.234784 } }, { "coords": { "latitude": 12.950034, "longitude": 80.234183 } }, { "coords": { "latitude": 12.949971, "longitude": 80.232606 } }, { "coords": { "latitude": 12.94994, "longitude": 80.23223 } }, { "coords": { "latitude": 12.949909, "longitude": 80.231704 } }, { "coords": { "latitude": 12.949867, "longitude": 80.231135 } }, { "coords": { "latitude": 12.949731, "longitude": 80.229257 } }, { "coords": { "latitude": 12.949459, "longitude": 80.223603 } }, { "coords": { "latitude": 12.949302, "longitude": 80.2212 } }, { "coords": { "latitude": 12.948926, "longitude": 80.217499 } }, { "coords": { "latitude": 12.948633, "longitude": 80.214484 } }, { "coords": { "latitude": 12.948455, "longitude": 80.212628 } }, { "coords": { "latitude": 12.948424, "longitude": 80.210096 } }, { "coords": { "latitude": 12.948173, "longitude": 80.21001 } }, { "coords": { "latitude": 12.947452, "longitude": 80.209742 } }, { "coords": { "latitude": 12.946385, "longitude": 80.209334 } }, { "coords": { "latitude": 12.94582, "longitude": 80.209109 } }, { "coords": { "latitude": 12.94559, "longitude": 80.208905 } }, { "coords": { "latitude": 12.944963, "longitude": 80.208658 } }, { "coords": { "latitude": 12.944566, "longitude": 80.208497 } }, { "coords": { "latitude": 12.944221, "longitude": 80.208368 } }, { "coords": { "latitude": 12.944064, "longitude": 80.208304 } }, { "coords": { "latitude": 12.943824, "longitude": 80.208207 } }, { "coords": { "latitude": 12.943563, "longitude": 80.2081 } }, { "coords": { "latitude": 12.943249, "longitude": 80.207928 } }, { "coords": { "latitude": 12.942684, "longitude": 80.207263 } }, { "coords": { "latitude": 12.942161, "longitude": 80.206759 } }, { "coords": { "latitude": 12.941324, "longitude": 80.206158 } }, { "coords": { "latitude": 12.941167, "longitude": 80.206072 } }, { "coords": { "latitude": 12.940686, "longitude": 80.205868 } }, { "coords": { "latitude": 12.940027, "longitude": 80.205664 } }, { "coords": { "latitude": 12.939536, "longitude": 80.205514 } }, { "coords": { "latitude": 12.939045, "longitude": 80.205364 } }, { "coords": { "latitude": 12.938334, "longitude": 80.205149 } }, { "coords": { "latitude": 12.937184, "longitude": 80.204827 } }, { "coords": { "latitude": 12.93618, "longitude": 80.204537 } }, { "coords": { "latitude": 12.935887, "longitude": 80.204451 } }, { "coords": { "latitude": 12.93573, "longitude": 80.204408 } }, { "coords": { "latitude": 12.93551, "longitude": 80.204301 } }, { "coords": { "latitude": 12.935364, "longitude": 80.204226 } }, { "coords": { "latitude": 12.934778, "longitude": 80.204011 } }, { "coords": { "latitude": 12.934318, "longitude": 80.203979 } }, { "coords": { "latitude": 12.93413, "longitude": 80.203958 } }, { "coords": { "latitude": 12.933618, "longitude": 80.203904 } }, { "coords": { "latitude": 12.933043, "longitude": 80.203765 } }, { "coords": { "latitude": 12.932918, "longitude": 80.203711 } }, { "coords": { "latitude": 12.932343, "longitude": 80.203486 } }, { "coords": { "latitude": 12.931716, "longitude": 80.203282 } }, { "coords": { "latitude": 12.931538, "longitude": 80.203228 } }, { "coords": { "latitude": 12.930911, "longitude": 80.203024 } }, { "coords": { "latitude": 12.93043, "longitude": 80.202906 } }, { "coords": { "latitude": 12.9302, "longitude": 80.202885 } }, { "coords": { "latitude": 12.930075, "longitude": 80.202864 } }, { "coords": { "latitude": 12.929406, "longitude": 80.202778 } }, { "coords": { "latitude": 12.928946, "longitude": 80.202714 } }, { "coords": { "latitude": 12.928653, "longitude": 80.202617 } }, { "coords": { "latitude": 12.92859, "longitude": 80.202531 } }, { "coords": { "latitude": 12.928506, "longitude": 80.201834 } }, { "coords": { "latitude": 12.928506, "longitude": 80.201716 } }, { "coords": { "latitude": 12.928422, "longitude": 80.200375 } }, { "coords": { "latitude": 12.928391, "longitude": 80.200021 } }, { "coords": { "latitude": 12.928307, "longitude": 80.199721 } }, { "coords": { "latitude": 12.928171, "longitude": 80.199335 } }, { "coords": { "latitude": 12.927868, "longitude": 80.198713 } }, { "coords": { "latitude": 12.927638, "longitude": 80.198337 } }, { "coords": { "latitude": 12.927335, "longitude": 80.198058 } }, { "coords": { "latitude": 12.926927, "longitude": 80.197801 } }, { "coords": { "latitude": 12.92609, "longitude": 80.197544 } }, { "coords": { "latitude": 12.925379, "longitude": 80.197523 } }, { "coords": { "latitude": 12.925097, "longitude": 80.197512 } }, { "coords": { "latitude": 12.924721, "longitude": 80.197512 } }, { "coords": { "latitude": 12.923717, "longitude": 80.197491 } }, { "coords": { "latitude": 12.923341, "longitude": 80.197459 } }, { "coords": { "latitude": 12.923027, "longitude": 80.197416 } }, { "coords": { "latitude": 12.92242, "longitude": 80.197341 } }, { "coords": { "latitude": 12.921782, "longitude": 80.197191 } }, { "coords": { "latitude": 12.921081, "longitude": 80.196955 } }, { "coords": { "latitude": 12.91945, "longitude": 80.196343 } }, { "coords": { "latitude": 12.918749, "longitude": 80.195796 } }, { "coords": { "latitude": 12.917567, "longitude": 80.194734 } }, { "coords": { "latitude": 12.917326, "longitude": 80.194487 } }, { "coords": { "latitude": 12.917127, "longitude": 80.194154 } }, { "coords": { "latitude": 12.916876, "longitude": 80.19424 } }, { "coords": { "latitude": 12.916228, "longitude": 80.194369 } }, { "coords": { "latitude": 12.915632, "longitude": 80.194498 } }, { "coords": { "latitude": 12.915632, "longitude": 80.194434 } }, { "coords": { "latitude": 12.916228, "longitude": 80.194316 } }, { "coords": { "latitude": 12.916876, "longitude": 80.194177 } }, { "coords": { "latitude": 12.917096, "longitude": 80.194102 } }, { "coords": { "latitude": 12.917159, "longitude": 80.194081 } }, { "coords": { "latitude": 12.91718, "longitude": 80.194135 } }, { "coords": { "latitude": 12.917452, "longitude": 80.194543 } }, { "coords": { "latitude": 12.918059, "longitude": 80.195096 } }];

  serverResponse() {
    if (this.role === 'PARENT')
      return this.parentResponse;
    if (this.role === 'DRIVER')
      return this.driverResponse;

  }

  busPosition = new Observable((observer) => {
    let timeInterval = 5000; // 5 sec
    let index = 0;
    let timer = setInterval(() => {
      if (this.travelPoints.length === index + 1)
        clearInterval(timer)
      else
        observer.next(this.travelPoints[index])
      index++;
    }, timeInterval)
  });

  watchPosition() {
    let timeInterval = 5000; // 5 sec
    let index = 0;
    return Observable
      .interval(timeInterval)
      .map(() => {
        return this.travelPoints[index++];
      }).take(150);
  }

}
