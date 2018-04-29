import { User } from './../../todo/user.model';
import { Component, Input } from "@angular/core";
import { BaseComponent } from "../base.component";
import { AlertController, MenuController, App } from 'ionic-angular';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';
import firebase, { Unsubscribe } from 'firebase';
import { UserService } from '../../providers/user/user.service';
import { AuthService } from '../../providers/auth/auth';
import { InserirAnuncioPage } from '../../pages/inserir-anuncio/inserir-anuncio';
import { AdicionarFotosPage } from '../../pages/adicionar-fotos/adicionar-fotos';

@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponent {
  @Input() userId: string;
  currentUser: User;
  @Input('isMenu') isMenu: boolean;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public userService: UserService,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {

    super(alertCtrl, authService, app, menuCtrl);
   
    const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userService.getUser(user.uid).subscribe((user: User) => {
          this.currentUser = user;
            this.pages = [
              { title: 'Home', component: HomePage },
              { title: 'Perfil', component: UserProfilePage },
              { title: 'Anunciar', component: InserirAnuncioPage },
            ]
          console.log("passoi aqui" + this.currentUser.email);
        });
      }

    });
   
  }
  openPage(page) {

    let view = this.navCtrl.getActive();
    if (view.name == page.component.name) {
      this.menuCtrl.close();
    } else {
      // close the menu when clicking a link from the menu
      this.menuCtrl.close();
      // navigate to the new page if it is not the current page
      this.navCtrl.push(page.component);
    }

  }
  logoutUser() {
    firebase.auth().signOut();
    this.pages = null;
    this.currentUser = null;
    this.navCtrl.setRoot(LoginPage);
  }


}