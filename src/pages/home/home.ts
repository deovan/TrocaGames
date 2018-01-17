import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Jogo } from '../../todo/jogo.model';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  jogos: Jogo;

  items: Observable<any[]>;
  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public authProvider: AuthProvider
  ) {
    this.items = db.list('jogos').valueChanges();
  }



  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }
}