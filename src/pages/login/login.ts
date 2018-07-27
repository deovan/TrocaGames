import {
  Alert,
  AlertController,
  Loading,
  LoadingController,
  NavController,
  MenuController,
  ModalController,
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import firebase from 'firebase/app';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { EmailSignInComponent } from '../../components/email-sign-in/email-sign-in';
import { EmailSignUpComponent } from '../../components/email-sign-up/email-sign-up';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  entryComponents: [EmailSignInComponent, EmailSignUpComponent],
  animations: [

    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {
  public loginForm: FormGroup;
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public emailValidator: EmailValidator,
    formBuilder: FormBuilder,
    public modalCtrl: ModalController
  ) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  ionViewCanEnter() {
    this.menu.enable(false);
  }
  goToSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  // goToResetPassword(): void {
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enviar email de recuperação',
      inputs: [
        {
          name: 'email',
          placeholder: 'Digite aqui seu email!',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            if (this.emailValidator.validateEmail(data.email)) {
              this.resetPassword(data.email)
            } else {
              const alert: Alert = this.alertCtrl.create({
                message: 'Email inválido!',
                buttons: [{ text: 'Ok', role: 'cancel', }],
              });
              alert.present().then(() => {
                return
              });


            }
          }
        }
      ]
    });
    alert.present();
  }
  // this.navCtrl.push(ResetPasswordPage);
  // }

  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create({
        spinner: 'dots'
      });
      loading.present();

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        const loginUser: firebase.User = await this.authService.loginUser(
          email,
          password
        );
        await loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
    }
  }

  resetPassword(email: string) {
    const loading: Loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
    loading.present().then(() => {
      this.authService.resetPassword(email).then((_) => {
        loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: 'Verifique seu email, para redefinir sua senha!',
          buttons: [
            {
              text: 'Ok',
              handler: data => {

              }
            }
          ]
        });
        alert.present();
      }).catch((error) => {
        console.log('error firebase', error);
        let msg = '';
        if (error.code === 'auth/user-not-found') {
          msg = 'Este email não foi encontrado, verifique e tente novamente!'
        }
        loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: msg,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();

      })
    }).catch((error) => {
      loading.dismiss();
      console.log('error geral', error);
      const alert: Alert = this.alertCtrl.create({
        message: error.message,
        buttons: [{ text: 'Ok', role: 'cancel' }]
      });
      alert.present();
    })
  }


}