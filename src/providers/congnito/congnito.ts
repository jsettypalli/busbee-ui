// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

/*
  Generated class for the CongnitoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CongnitoProvider {

  private userPool: CognitoUserPool;

  constructor() {
    console.log('Hello CongnitoProvider Provider');
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
        console.log('There was an error ', err);
      } else {
        console.log('You have successfully signed up, please confirm your phone number')
      }
    }))
  }

  /// Confirm User

  confirmUser(username: string, code: string) {
    this.getUserPool(username);
    this.cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.log('There was an error -> ', err)
      } else {
        console.log('You have been confirmed ')
      }
    })
  }

  resendConfirmationCode(username: string) {
    this.getUserPool(username);
    this.cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        alert(err);
        return;
      }
      console.log('call result: ' + result);
    });
  }

  //// Sign in User

  callbacks = {
    onSuccess: (session: CognitoUserSession) => { },
    onFailure: (err: any) => { },
    mfaRequired: (challengeName: any, challengeParameters: any) => { },
    customChallenge: (challengeParameters: any) => { }
  };

  signinUser(username: string, password: string, newPassword?: string, mfaCode?) {
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    this.getUserPool(username);

    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('You are now Logged in');
      },
      onFailure: (err) => {
        console.log('There was an error during login, please try again -> ', err)
      },
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
        // Required attributes according to schema, which don’t have any values yet, will have blank values.
        // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.


        // Get these details and call
        // newPassword: password that user has given
        // attributesData: object with key as attribute name and value that the user has given.
        let attributesData = {
          email: userAttributes.email,
          phone_number: userAttributes.phone_number
        }
        this.cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, {
          onSuccess: (session: CognitoUserSession) => {
            console.log(session)
          },
          onFailure: (err: any) => {
            console.log(err)
          },
          mfaRequired: (challengeName: any, challengeParameters: any) => {
            console.log(challengeName)
            console.log(challengeParameters)
          },
          customChallenge: (challengeParameters: any) => {
            console.log(challengeParameters)
          }
        })
      },
      mfaRequired: function(codeDeliveryDetails) {
        // MFA is required to complete user authentication.
        // Get the code from user and call
        this.cognitoUser.sendMFACode(mfaCode, this)
      },
      totpRequired: (challengeName: any, challengeParameters: any) => {
        console.log(challengeName)
        console.log(challengeParameters)
      },
      customChallenge: (challengeParameters: any) => {
        console.log(challengeParameters)
      },
      mfaSetup: (challengeName: any, challengeParameters: any) => {
        console.log(challengeName)
        console.log(challengeParameters)
      },
      selectMFAType: (challengeName: any, challengeParameters: any) => {
        console.log(challengeName)
        console.log(challengeParameters)
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
        console.log('session validity: ' + session.isValid());

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
        return;
      }
      console.log('call result: ' + result);
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
