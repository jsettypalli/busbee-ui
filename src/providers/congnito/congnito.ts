// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Pro } from '@ionic/pro';
/*
  Generated class for the CongnitoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CongnitoProvider {

  private userPool: CognitoUserPool;

  constructor() {
    Pro.monitoring.log('Hello CongnitoProvider Provider', { level: 'info' });
    this.userPool = new CognitoUserPool({
      UserPoolId: 'ap-south-1_9V9g6m8sU',
      ClientId: '13qoh7anskpi8ctbft9ob4hja6'
    });
  }

  cognitoUser: CognitoUser



  /// Sign Up User
  signupUser(user: string, password: string, phoneNumber: string) {
    const dataPhone = {
      Name: 'phone_number',
      Value: phoneNumber
    };
    const phoneAtt = [new CognitoUserAttribute(dataPhone)];

    this.userPool.signUp(user, password, phoneAtt, null, ((err, result) => {
      if (err) {
        Pro.monitoring.exception(err)
      }
    }))
  }

  /// Confirm User

  confirmUser(username: string, code: string) {
    this.getUserPool(username);
    this.cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        Pro.monitoring.exception(err)
      }
    })
  }

  resendConfirmationCode(username: string) {
    this.getUserPool(username);
    this.cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        alert(err);
        Pro.monitoring.exception(err)
        return;
      }
    });
  }

  //// Sign in User

  callbacks = {
    onSuccess: (session: CognitoUserSession) => { },
    onFailure: (err: any) => { },
    mfaRequired: (challengeName: any, challengeParameters: any) => { },
    customChallenge: (challengeParameters: any) => { }
  };

  signinUser(username: string, password: string, onSuccess, onFailure) {
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    this.getUserPool(username);

    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        onSuccess();
      },
      onFailure: (err) => {
        Pro.monitoring.exception(err)
        onFailure();
      }
    })
  }

  /// Log User Out
  logoutUser() {
    this.userPool.getCurrentUser().signOut();
  }

  localLogin() {
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser != null) {
      this.cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err);
          return;
        }

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        this.cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            // Handle error
          } else {
            // Do something with attributes
          }
        });
      });
    }
  }
  changePassword(username, oldPassword, newPassword) {
    this.getUserPool(username);
    this.cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
      if (err) {
        alert(err);
        Pro.monitoring.exception(err)
        return;
      }
    });
  }

  getUserPool(username) {
    const userData = {
      Username: username,
      Pool: this.userPool
    };
    this.cognitoUser = this.userPool.getCurrentUser();
    if (!this.cognitoUser)
      this.cognitoUser = new CognitoUser(userData);

  }

}
