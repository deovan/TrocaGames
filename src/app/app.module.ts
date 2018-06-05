import { ChatListPage } from './../pages/chat-list/chat-list';
import { MessageService } from './../providers/message/message.service';
import { MessageBoxComponent } from './../components/message-box/message-box.component';
import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component';
import { NgModule, ErrorHandler } from "@angular/core";
import { AnuncioDetalhesPage } from "../pages/anuncio-detalhes/anuncio-detalhes";
import { HomePage } from "../pages/home/home";
import { InserirAnuncioPage } from "../pages/inserir-anuncio/inserir-anuncio";
import { LoginPage } from "../pages/login/login";
import { MyApp } from "./app.component";
import { ResetPasswordPage } from "../pages/reset-password/reset-password";
import { SignupPage } from "../pages/signup/signup";
import { UserInfoComponent } from "../components/user-info/user-info.component";
import { UserMenuComponent } from "../components/user-menu/user-menu.component";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { PreloaderService } from "../providers/preloader/preloader.service";
import { JogoService } from "../providers/jogo/jogo.service";
import { AuthService } from "../providers/auth/auth";
import { IonicErrorHandler, IonicModule, IonicApp } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Camera } from "@ionic-native/camera";
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "angularfire2";
import { firebaseConfig } from "./credentials.backup";
import { HttpModule } from "@angular/http";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { SplashScreen } from "@ionic-native/splash-screen";
import { BrMaskerModule } from 'brmasker-ionic-3';
import { CapitalizePipe } from "../pipes/capitalize/capitalize";
import { CustomLoggedHeaderComponent } from "../components/custom-logged-header/custom-logged-header.component";
import { ChatPage } from '../pages/chat/chat';
import { ChatService } from '../providers/chat/chat.service';
import { UserService } from '../providers/user/user.service';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { CameraService } from '../providers/camera/camera.service';
import { MeusAnunciosPage } from '../pages/meus-anuncios/meus-anuncios';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { EditarAnuncioPage } from '../pages/editar-anuncio/editar-anuncio';
 
@NgModule({
  declarations: [
    AnuncioDetalhesPage,
    CapitalizePipe,
    ChatListPage,
    ChatPage,
    CustomLoggedHeaderComponent,
    EditarAnuncioPage,
    HomePage,
    InserirAnuncioPage,
    LoginPage,
    MeusAnunciosPage,
    MessageBoxComponent,
    MyApp,
    ProgressBarComponent,
    ResetPasswordPage,
    SignupPage,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    BrMaskerModule,
    BrowserModule,
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
    HomePage,
    InserirAnuncioPage,
    LoginPage,
    MeusAnunciosPage,
    MyApp,
    ResetPasswordPage,
    SignupPage,
    UserProfilePage
  ],
  providers: [
    AuthService,
    Camera,
    CameraService,
    ChatService,
    File,
    FileTransfer,
    FilePath,
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
