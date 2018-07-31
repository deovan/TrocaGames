import { LoginPage } from '../../pages/login/login';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseService } from '../base/base.service';
import { User } from '@firebase/auth-types';
import firebase from 'firebase';
@Injectable()
export class AuthService extends BaseService {
  emailUser: String;
  constructor(
    public auth: AngularFireAuth
  ) {
    super();
  }

  loginUser(email: string, password: string): Promise<User> {
    this.emailUser = email;
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth()
      .createUserWithEmailAndPassword(email, password)
  }

  logout(): Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  get authenticated(): Promise<boolean> {
    var auth: AngularFireAuth;
    return new Promise((resolve, reject) => {
      auth.authState.first().subscribe((authState: firebase.User) => {
        (authState) ? resolve(true) : reject(false);
      });
    });
  }

}