import cep from 'cep-promise';
import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import firebase from 'firebase/app';
import { UserService } from '../../providers/user/user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';




@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm: FormGroup
  public endereco:any

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public userService: UserService,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      'name': [
        '',
        [Validators.required, Validators.minLength(3)]],
      'email': [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      'telefone': [
        '',
        Validators.compose([Validators.required])
      ],
      'cep': [
        '',
        Validators.compose([Validators.minLength(9)])
      ],
      'cidade':[
        '',
        Validators.compose([])

      ]
    });
  }

  async signupUser() {
    if (!this.signupForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.signupForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create();
      loading.present();
      let formUser = this.signupForm.value;
      formUser.admin = false;
      let email: string = formUser.email;
      let password: string = formUser.password
      this.authService.signupUser(email, password)
        .then((authState: firebase.User) => {
          delete formUser.password;
          let uuid: string = authState.uid;
          this.userService.create(formUser, uuid)
            .then(() => {
              console.log('Usuário Cadastrado!');
              this.navCtrl.setRoot(HomePage);
              loading.dismiss();
            }).catch((error: any) => {
              console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });
        }).catch((error: any) => {
          console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
    }
  }

  public buscarCep(event) {
    console.log(event.value)
    cep(event.value).then((endereco) => {
      console.log(endereco);
      this.endereco = endereco.city
    }).catch((error)=>this.showAlert(error))
  }
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}
