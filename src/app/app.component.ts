import { TestePage } from './../pages/teste/teste';

import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase, { Unsubscribe } from 'firebase';

import { firebaseConfig } from './credentials.backup';
import { ListPage } from './../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { InserirJogoPage } from '../pages/inserir-jogo/inserir-jogo';
import { ChatPage } from '../pages/chat/chat';
import { MinhaContaPage } from '../pages/minha-conta/minha-conta';
import { AuthProvider } from '../providers/auth/auth';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    public menu: MenuController,
    splashScreen: SplashScreen,
    public authProvider: AuthProvider
  ) {
    firebase.initializeApp(firebaseConfig);

    const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.rootPage = ListPage;
        unsubscribe();
      } else {
        this.rootPage = LoginPage;
        unsubscribe();
      };

      this.pages = [
        {title: 'Menu', component: HomePage},
        { title: 'Lista de Jogos', component: ListPage },
         {title: 'Inserir Games', component: InserirJogoPage},
         {title: 'Chat', component: ChatPage},
        {title: 'Minha Conta', component: MinhaContaPage},
        {title: 'TEste', component: TestePage}
      
      ];
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.nav.setRoot(LoginPage);
  }
}