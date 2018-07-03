import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatListPage } from './../pages/chat-list/chat-list'
import { MessageService } from './../providers/message/message.service'
import { MessageBoxComponent } from './../components/message-box/message-box.component'
import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component'
import { NgModule, ErrorHandler } from "@angular/core"
import { AnuncioDetalhesPage } from "../pages/anuncio-detalhes/anuncio-detalhes"
import { HomePage } from "../pages/home/home"
import { InserirAnuncioPage } from "../pages/inserir-anuncio/inserir-anuncio"
import { LoginPage } from "../pages/login/login"
import { MyApp } from "./app.component"
import { SignupPage } from "../pages/signup/signup"
import { UserInfoComponent } from "../components/user-info/user-info.component"
import { UserMenuComponent } from "../components/user-menu/user-menu.component"
import { UserProfilePage } from "../pages/user-profile/user-profile"
import { PreloaderService } from "../providers/preloader/preloader.service"
import { JogoService } from "../providers/jogo/jogo.service"
import { AuthService } from "../providers/auth/auth"
import { IonicErrorHandler, IonicModule, IonicApp } from "ionic-angular"
import { StatusBar } from "@ionic-native/status-bar"
import { Camera } from "@ionic-native/camera"
import { File } from '@ionic-native/file'
import { FileTransfer } from '@ionic-native/file-transfer'
import { FilePath } from '@ionic-native/file-path'
import { BrowserModule } from "@angular/platform-browser"
import { AngularFireModule } from "angularfire2"
import { HttpModule } from "@angular/http"
import { AngularFireDatabaseModule } from "angularfire2/database"
import { AngularFireAuthModule } from "angularfire2/auth"
import { SplashScreen } from "@ionic-native/splash-screen"
import { BrMaskerModule } from 'brmasker-ionic-3'
import { AdMobFree } from '@ionic-native/admob-free'
import { OrderModule } from 'ngx-order-pipe'

import { CapitalizePipe } from "../pipes/capitalize/capitalize"
import { CustomLoggedHeaderComponent } from "../components/custom-logged-header/custom-logged-header.component"
import { ChatPage } from '../pages/chat/chat'
import { ChatService } from '../providers/chat/chat.service'
import { UserService } from '../providers/user/user.service'
import { SuperTabsModule } from 'ionic2-super-tabs'
import { CameraService } from '../providers/camera/camera.service'
import { MeusAnunciosPage } from '../pages/meus-anuncios/meus-anuncios'
import { IonicImageViewerModule } from 'ionic-img-viewer'
import { EditarAnuncioPage } from '../pages/editar-anuncio/editar-anuncio' 
import { firebaseConfigTesting, firebaseConfig } from './credentials.backup';
import { EmailSignInComponent } from '../components/email-sign-in/email-sign-in';
import { EmailSignUpComponent } from '../components/email-sign-up/email-sign-up';
import { EmailValidator } from '../validators/email';
import { HTTP } from '@ionic-native/http';
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
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule,
    SuperTabsModule.forRoot()// imports firebase/auth, only needed for auth features
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
    UserProfilePage
  ],
  providers: [
    AdMobFree,
    AuthService,
    Camera,
    CameraService,
    ChatService,
    EmailValidator,
    File,
    FileTransfer,
    FilePath,
    HTTP,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    JogoService,
    MessageService,
    UserService,
    PreloaderService,

  ]
})
export class AppModule { }
