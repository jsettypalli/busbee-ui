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

  public useMockData = true;

  public serverResponse = [{
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
  },
  {
    'role': 'TRANSPORT_INCHARGE',
    inTransit: false,
    'tripId': 4,
    'busId': 4,
    'startDateTime': '2018-05-25T07:00:39.892Z',
    'currentLocation': null,
    'visitedBusStops': null,
    'nextBusStop': {
      'busStopName': 'Bhavyas Alluri Meadows',
      'location': { 'id': 5, 'latitude': 17.453597, 'longitude': 78.366742 }
    }
  }, {
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

  private travelPoints = [{ "coords": { "latitude": 12.984375, "longitude": 80.249189 } }, { "coords": { "latitude": 12.984382, "longitude": 80.24869 } }, { "coords": { "latitude": 12.985093, "longitude": 80.248679 } }, { "coords": { "latitude": 12.985386, "longitude": 80.248679 } }, { "coords": { "latitude": 12.985867, "longitude": 80.248679 } }, { "coords": { "latitude": 12.986233, "longitude": 80.248679 } }, { "coords": { "latitude": 12.986233, "longitude": 80.247123 } }, { "coords": { "latitude": 12.986223, "longitude": 80.246747 } }, { "coords": { "latitude": 12.986233, "longitude": 80.246093 } }, { "coords": { "latitude": 12.986233, "longitude": 80.245256 } }, { "coords": { "latitude": 12.986233, "longitude": 80.245095 } }, { "coords": { "latitude": 12.986243, "longitude": 80.244634 } }, { "coords": { "latitude": 12.986243, "longitude": 80.243894 } }, { "coords": { "latitude": 12.986243, "longitude": 80.243293 } }, { "coords": { "latitude": 12.986306, "longitude": 80.243293 } }, { "coords": { "latitude": 12.986306, "longitude": 80.243894 } }, { "coords": { "latitude": 12.986306, "longitude": 80.244634 } }, { "coords": { "latitude": 12.986296, "longitude": 80.245095 } }, { "coords": { "latitude": 12.986296, "longitude": 80.245256 } }, { "coords": { "latitude": 12.986296, "longitude": 80.246093 } }, { "coords": { "latitude": 12.986296, "longitude": 80.246747 } }, { "coords": { "latitude": 12.986296, "longitude": 80.247123 } }, { "coords": { "latitude": 12.986306, "longitude": 80.247456 } }, { "coords": { "latitude": 12.986306, "longitude": 80.248679 } }, { "coords": { "latitude": 12.986296, "longitude": 80.249494 } }, { "coords": { "latitude": 12.986286, "longitude": 80.249934 } }, { "coords": { "latitude": 12.986286, "longitude": 80.250063 } }, { "coords": { "latitude": 12.986286, "longitude": 80.250578 } }, { "coords": { "latitude": 12.986286, "longitude": 80.25135 } }, { "coords": { "latitude": 12.986328, "longitude": 80.251447 } }, { "coords": { "latitude": 12.986422, "longitude": 80.251544 } }, { "coords": { "latitude": 12.986558, "longitude": 80.251576 } }, { "coords": { "latitude": 12.986819, "longitude": 80.251608 } }, { "coords": { "latitude": 12.987823, "longitude": 80.251329 } }, { "coords": { "latitude": 12.987907, "longitude": 80.251308 } }, { "coords": { "latitude": 12.989036, "longitude": 80.25104 } }, { "coords": { "latitude": 12.989789, "longitude": 80.250836 } }, { "coords": { "latitude": 12.99004, "longitude": 80.250772 } }, { "coords": { "latitude": 12.990594, "longitude": 80.250622 } }, { "coords": { "latitude": 12.991953, "longitude": 80.2503 } }, { "coords": { "latitude": 12.994849, "longitude": 80.249581 } }, { "coords": { "latitude": 12.99741, "longitude": 80.248916 } }, { "coords": { "latitude": 13.001299, "longitude": 80.247961 } }, { "coords": { "latitude": 13.002533, "longitude": 80.247661 } }, { "coords": { "latitude": 13.003934, "longitude": 80.247404 } }, { "coords": { "latitude": 13.005011, "longitude": 80.247286 } }, { "coords": { "latitude": 13.005283, "longitude": 80.247189 } }, { "coords": { "latitude": 13.005931, "longitude": 80.247028 } }, { "coords": { "latitude": 13.006286, "longitude": 80.246803 } }, { "coords": { "latitude": 13.006547, "longitude": 80.246395 } }, { "coords": { "latitude": 13.006631, "longitude": 80.245741 } }, { "coords": { "latitude": 13.006631, "longitude": 80.245215 } }, { "coords": { "latitude": 13.006623, "longitude": 80.244791 } }];


  busPosition = new Observable((observer) => {
    let timeInterval = 5000; // 1 sec
    let index = 0;
    let timer = setInterval(() => {
      if (this.travelPoints.length === index + 1)
        clearInterval(timer)
      else
        observer.next(this.travelPoints[index])
      index++;
    }, timeInterval)
  });

}
