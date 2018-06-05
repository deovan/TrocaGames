import { Observable } from 'rxjs/Observable';
import { EditarAnuncioPage } from './../editar-anuncio/editar-anuncio';
import { InserirAnuncioPage } from './../inserir-anuncio/inserir-anuncio';
import { JogoService } from './../../providers/jogo/jogo.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Jogo } from '../../todo/jogo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-meus-anuncios',
  templateUrl: 'meus-anuncios.html',
})
export class MeusAnunciosPage {
  private subAnunciosUser: Subscription = new Subscription();
  anuncios: Observable<any[]>;
  constructor(
    private alertCtrl: AlertController,
    public jogoService: JogoService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
  }

  inicializarItems() {
    this.anuncios = this.jogoService.getAnunciosDoUser();
  }
  
  ionViewDidLoad() {
    this.inicializarItems();
  }

  ionViewWillLeave() {
    this.subAnunciosUser.unsubscribe();
  }


  private doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.inicializarItems();
    setTimeout(() => {
      this.showToast('Atualizado com sucesso!')
      refresher.complete();
    }, 2000);
  }



  private presentConfirm(todo) {
    let alert = this.alertCtrl.create({
      title: 'Quer mesmo deletar?',
      message: 'Ao confirma o anuncio será excluido!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.deleteAnuncio(todo);
          },
          cssClass: '.alertDanger'
        }
      ]
    });
    alert.present();
  }

  private editarAnuncio(todo: Jogo) {
    this.navCtrl.push(EditarAnuncioPage, {
      jogo: todo
    })
  }

  private deleteAnuncio(todo: Jogo) {
    this.jogoService.removeAnuncio(todo.key).then((sucess) => {
      this.inicializarItems();
      this.showToast('Anuncio removido com Sucesso!')
    }).catch(error => alert(error))
  }

  private showToast(message: string): void {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present()
  }

}
