import { TestePage } from './../pages/teste/teste';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicErrorHandler, IonicModule, IonicApp } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { ChatPage } from './../pages/chat/chat';
import { InserirJogoPage } from './../pages/inserir-jogo/inserir-jogo';
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
import { firebaseConfig } from './credentials.backup';
import { JogoService } from '../providers/jogo.service';



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
    SignupPage,
    TestePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features
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
    SignupPage,
    TestePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    JogoService
  ]
})
export class AppModule {}
