import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

/**
 * 
 * Component for email sign in
 * 
 * @export
 * @class EmailSignInComponent
 */
@Component({
  selector: 'sign-in',
  templateUrl: 'email-sign-in.html',
  providers: [FormBuilder]
})

export class EmailSignInComponent {

  public loginForm: FormGroup;
  public title = 'Sign in with email'

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController) {

    // building the form
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

  /**
   * Toast creator
   * 
   * @param message
   */
  createToast(message: string) {
    return this.toastCtrl.create({
      message,
      duration: 3000
    })
  }

  signInFormSubmit() {

    // first we check, if the form is valid
    if (!this.loginForm.valid) {
      this.createToast('Ooops, form not valid...').present();
      return
    } else {
      // if the form is valid, we continue with validation
      this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          // showing succesfull message
          this.createToast('Signed in with email: ' + this.loginForm.value.email).present()
          // closing dialog
          this.viewCtrl.dismiss()
        },

          /**
           * Handle Authentication errors
           * Here you can customise error messages like our example.
           * https://firebase.google.com/docs/reference/js/firebase.auth.Error
           * 
           * mismatch with error interface: https://github.com/angular/angularfire2/issues/976
           */
          (error: any) => {
            switch (error.code) {
              case 'auth/invalid-api-key':
                this.createToast('Invalid API key, don\'t forget update').present();
                break;
              default:
                this.createToast(error.message).present();
                break;
            }
          })
    }
  }

  cancelClicked() {
    this.viewCtrl.dismiss()
  }
}