import { NavController, AlertController, App, MenuController } from 'ionic-angular';
import { OnInit } from "@angular/core";
import firebase from 'firebase';
import { LoginPage } from './../pages/login/login';
import { AuthService } from '../providers/auth/auth';
export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ) { }

    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void {
        this.alertCtrl.create({
            message: 'Voçe deseja sair ? ',
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.authService.logout()
                            .then(() => {
                                firebase.auth().signOut();
                                this.navCtrl.setRoot(LoginPage);
                            });

                    }
                },
                {
                    text: 'Não',
                }
            ]
        }).present();
    }
}