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
import { Geolocation } from '@ionic-native/geolocation';
import { PATTERN_VALIDATOR } from '@angular/forms/src/directives/validators';
import { NativeGeocoderOptions, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoder } from "@ionic-native/native-geocoder";




@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm: FormGroup
  public endereco: any
  localization :any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public userService: UserService,
    public geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    formBuilder: FormBuilder
  ) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    geolocation.getCurrentPosition().then((resp) => {
      console.log('resp', resp);
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log(JSON.stringify(result[0]))
          this.localization =result[0]
          console.log('local',this.localization);
          
        })
        .catch((error: any) => console.log(error));
      // 
      // r
    }).catch((error) => {
      console.log('Error getting location', error);
    });



    this.nativeGeocoder.forwardGeocode('Berlin', options)
      .then((coordinates: NativeGeocoderForwardResult[]) => console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude))
      .catch((error: any) => console.log(error));


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
        Validators.compose([]),

      ],
      'cidade': [
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
      const loading: Loading = this.loadingCtrl.create({
        spinner: 'dots'
      });
      loading.present();
      let formUser = this.signupForm.value;
      formUser.admin = false;
      let email: string = formUser.email;
      let password: string = formUser.password
      this.authService.signupUser(email, password)
        .then((authState: firebase.User) => {
          delete formUser.password;
          formUser.localization = this.localization
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
    }).catch((error) => this.showAlert(error))
  }
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}
