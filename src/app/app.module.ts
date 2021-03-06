import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { UserService } from './../providers/user/user.service';
import { MessageService } from './../providers/message/message.service';
import { JogoService } from './../providers/jogo/jogo.service';
import { IonicErrorHandler } from 'ionic-angular';
import { ErrorHandler } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Base64 } from '@ionic-native/base64';

import { Geolocation } from '@ionic-native/geolocation'
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HTTP } from '@ionic-native/http';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EmailValidator } from './../validators/email';
import { ChatService } from './../providers/chat/chat.service';
import { Camera } from '@ionic-native/camera';
import { AuthService } from './../providers/auth/auth';
import { CameraService } from './../providers/camera/camera.service';
import { AdMobFree } from '@ionic-native/admob-free';
import { IonicApp } from 'ionic-angular';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfigTesting } from './credentials.backup';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicModule } from 'ionic-angular';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserModule } from '@angular/platform-browser';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component';
import { MessageBoxComponent } from './../components/message-box/message-box.component';
import { MeusAnunciosPage } from './../pages/meus-anuncios/meus-anuncios';
import { LoginPage } from './../pages/login/login';
import { InserirAnuncioPage } from './../pages/inserir-anuncio/inserir-anuncio';
import { NgModule } from '@angular/core';
import { AnuncioDetalhesPage } from "../pages/anuncio-detalhes/anuncio-detalhes";
import { CapitalizePipe } from "../pipes/capitalize/capitalize";
import { ChatListPage } from "../pages/chat-list/chat-list";
import { ChatPage } from "../pages/chat/chat";
import { CustomLoggedHeaderComponent } from "../components/custom-logged-header/custom-logged-header.component";
import { EditarAnuncioPage } from "../pages/editar-anuncio/editar-anuncio";
import { EmailSignInComponent } from "../components/email-sign-in/email-sign-in";
import { EmailSignUpComponent } from "../components/email-sign-up/email-sign-up";
import { HomePage } from "../pages/home/home";
import { MyApp } from "./app.component";
import { SignupPage } from "../pages/signup/signup";
import { UserInfoComponent } from "../components/user-info/user-info.component";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { UserMenuComponent } from "../components/user-menu/user-menu.component";
import { StatusBar } from "@ionic-native/status-bar";
import { CurrencyFormatPipe } from "../pipes/currency-format/currency-format";


@NgModule({
  declarations: [
    AnuncioDetalhesPage,
    CapitalizePipe,
    ChatListPage,
    ChatPage,
    CustomLoggedHeaderComponent,
    EditarAnuncioPage,
    EmailSignInComponent,
    EmailSignUpComponent,
    HomePage,
    InserirAnuncioPage,
    LoginPage,
    MeusAnunciosPage,
    MessageBoxComponent,
    MyApp,
    ProgressBarComponent,
    SignupPage,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    BrMaskerModule,
    BrowserModule,
    BrowserAnimationsModule,
    OrderModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule,
    AngularFireModule.initializeApp(firebaseConfigTesting),
    HttpModule,
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AnuncioDetalhesPage,
    ChatListPage,
    ChatPage,
    EditarAnuncioPage,
    EmailSignInComponent,
    EmailSignUpComponent,
    HomePage,
    InserirAnuncioPage,
    LoginPage,
    MeusAnunciosPage,
    MyApp,
    SignupPage,
    UserInfoComponent,
    UserProfilePage
  ],
  providers: [
    AdMobFree,
    AuthService,
    Base64,
    CurrencyPipe,
    Camera,
    CameraService,
    ChatService,
    EmailValidator,
    File,
    FileTransfer,
    FilePath,
    Geolocation,
    JogoService,
    HTTP,
    MessageService,
    NativeGeocoder,
    NativeStorage,
    Network,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserService,
  ]
})
export class AppModule { }
