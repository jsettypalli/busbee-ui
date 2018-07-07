import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the MockDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MockDataProvider {

  public useMockData = false;
  private travelPoints = [];
  public previousBusStop;
  public nextBusStop;
  public notificationMessage = {
    show: true,
    title: null,
    text: 'Your stop is next in the route and is expected to reach in 4mins from now.',
    short_message: 'Your stop is next in the route.',
    time: null,
    expected_time: 4,
    driver_name: 'Ramesh',
    driver_thumbnail_url: null,
    driver_image_url: null,
    bus_number: 'K3',
    registration_number: 'TS 08 1456'
  };

  constructor() {
  }

  getTravelPoints(points) {
    points.forEach(point => {
      let coords = {
        coords: {
          latitude: point.lat,
          longitude: point.lng
        }
      }
      this.travelPoints.push(coords);
    })
  }

  watchPosition() {
    let timeInterval = 2000; // 2 sec
    let index = -1;
    return Observable
      .interval(timeInterval)
      .map(() => {
        if (index === -1) {
          index++;
          if (this.previousBusStop)
            return {
              coords: {
                latitude: this.previousBusStop.latitude,
                longitude: this.previousBusStop.longitude
              }
            }
        } else {
          index++;
        }
        if (this.travelPoints[index])
          return this.travelPoints[index];
        if (index !== -1 && !this.travelPoints[index] && this.nextBusStop) {
          if (index > this.travelPoints.length) {
            this.nextBusStop.latitude = Number(this.nextBusStop.latitude) + 0.0001;
            this.nextBusStop.longitude = Number(this.nextBusStop.longitude) + 0.0001;
          }
          return {
            coords: {
              latitude: this.nextBusStop.latitude,
              longitude: this.nextBusStop.longitude
            }
          }
        }
      });
  }

}
