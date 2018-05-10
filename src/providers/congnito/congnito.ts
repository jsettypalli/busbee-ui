import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

/*
  Generated class for the CongnitoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CongnitoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CongnitoProvider Provider');
  }

}
