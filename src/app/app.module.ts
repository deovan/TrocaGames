import { InserirJogoPage } from './../pages/inserir-jogo/inserir-jogo';
import { ChatPage } from './../pages/chat/chat';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from './../pages/login/login';
import { MyApp } from './app.component';
import { ResetPasswordPage } from './../pages/reset-password/reset-password';
import { SignupPage } from './../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { MinhaContaPage } from '../pages/minha-conta/minha-conta';


@NgModule({
  declarations: [
    ChatPage,
    HomePage,
    InserirJogoPage,
    ListPage,
    LoginPage,
    MinhaContaPage,
    MyApp,
    ResetPasswordPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    InserirJogoPage,
    ListPage,
    LoginPage,
    MinhaContaPage,
    MyApp,
    ResetPasswordPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
   
  ]
})
export class AppModule {}
