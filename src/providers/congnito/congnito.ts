// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { UtilsProvider } from '../../providers/utils/utils';

/*
  Generated class for the CongnitoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CongnitoProvider {

  private userPool: CognitoUserPool;
  public tokens;

  constructor(private utils: UtilsProvider) {
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
        this.utils.ionicMonitoring(err)
      }
    }))
  }

  /// Confirm User

  confirmUser(username: string, code: string) {
    this.getUserPool(username);
    this.cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.utils.ionicMonitoring(err)
      }
    })
  }

  resendConfirmationCode(username: string) {
    this.getUserPool(username);
    this.cognitoUser.resendConfirmationCode(function(err, result) {
      if (err) {
        alert(err);
        this.utils.ionicMonitoring(err)
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

  signinUser(username: string, password: string, onSuccess, onFailure, onNewPassword) {
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    this.getUserPool(username);

    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        this.tokens = result;
        onSuccess(result);
      },
      onFailure: (err) => {
        this.utils.ionicMonitoring(err)
        onFailure(err);
      },
      // TODO: Test with new user accounts
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        onNewPassword(userAttributes);
      }
    })
  }

  setNewPassword(newPassword, userAttributes, onSuccess, onFailure) {
    delete userAttributes.email_verified;
    delete userAttributes.phone_number_verified;
    this.cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
      onSuccess: (result) => {
        this.tokens = result;
        onSuccess(result);
      },
      onFailure: (err) => {
        this.utils.ionicMonitoring(err)
        onFailure(err);
      }
    });
  }

  /// Log User Out
  logoutUser() {
    return this.userPool.getCurrentUser().signOut();
  }

  localLogin(onSuccess, onError) {
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser != null) {
      let self = this;
      this.cognitoUser.getSession(function(err, session) {
        if (err) {
          onError(err);
        } else {
          self.tokens = session;
          onSuccess(session)
        }
      });
    }
  }

  changePassword(oldPassword, newPassword, onSuccess, onFailure) {
    this.cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
      if (err) {
        this.utils.ionicMonitoring(err)
        onFailure(err);
      } else
        onSuccess(result);
    });
  }

  forgotPassword(username, onSuccess, onFailure, requestCode) {
    this.getUserPool(username);
    this.cognitoUser.forgotPassword({
      onSuccess: function(result) {
        onSuccess(result);
      },
      onFailure: function(err) {
        onFailure(err);
      },
      inputVerificationCode() {
        requestCode();
      }
    });
  }

  confirmPassword(verificationCode, newPassword, onSuccess, onFailure) {
    this.cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: function() {
        onSuccess();
      },
      onFailure: function(err) {
        onFailure(err);
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
