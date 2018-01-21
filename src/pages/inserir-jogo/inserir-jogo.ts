import { Jogo } from './../../todo/jogo.model';
import { JogoService } from './../../providers/jogo.service';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';



@Component({
  selector: 'page-inserir-jogo',
  templateUrl: 'inserir-jogo.html',
})
export class InserirJogoPage {
   public jogo: Jogo;
  myDate: String = new Date().toISOString();
  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public authProvider : AuthProvider,
    public _jogo: JogoService,
    private toastCtrl: ToastController) {
    this.jogo = new Jogo;  
    }


  save() {  
    this.jogo.datetime =''+ this.myDate;
    this.jogo.user = ''+this.authProvider.emailUser;
    this.jogo.done= false;
    var key = this._jogo.save(this.jogo);

    if (key) {
      this.presentToast();
      this.nav.getPrevious();
  }

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
}