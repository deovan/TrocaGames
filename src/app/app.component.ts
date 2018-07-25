import { UserService } from './../providers/user/user.service';
import { auth } from 'firebase/app';
import { Unsubscribe } from 'firebase';
import firebase from 'firebase';

import { HomePage } from './../pages/home/home';

import { User } from './../todo/user.model';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { UserProfilePage } from '../pages/user-profile/user-profile';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;
  public currentUser: User;
  splash = true
  private screenOrientation: ScreenOrientation;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public menu: MenuController,
    screenOrientation: ScreenOrientation,
    public splashScreen: SplashScreen,
    public userService: UserService) {

      this.screenOrientation = screenOrientation;
    // this.pages = [
    //   { title: 'Home', component: HomePage },
    //   { title: 'Perfil', component: UserProfilePage },
    //   { title: 'Novo', component: NovoEstabelecimentoPage }
    // ];




    this.platform.ready().then(() => {
      // this.hideSplashScreen();
      // this.splashScreen.hide();
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.statusBar.styleDefault();
      this.exibeSplash().then(() => {
        const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.rootPage = HomePage;
            unsubscribe();
          } else {
            this.rootPage = LoginPage;
            unsubscribe();
          };
        });
      })
    });

  }


  exibeSplash() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        this.splash = false,
        resolve(true)
      }, 2000)

    })
  }
  
  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    }
  }
}
