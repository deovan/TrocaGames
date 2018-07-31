import { OnInit } from '@angular/core';
import { Jogo } from './../../todo/jogo.model';
import { Observable } from 'rxjs/Observable';
import { EditarAnuncioPage } from './../editar-anuncio/editar-anuncio';
import { InserirAnuncioPage } from './../inserir-anuncio/inserir-anuncio';
import { JogoService } from './../../providers/jogo/jogo.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'page-meus-anuncios',
  templateUrl: 'meus-anuncios.html',
})
export class MeusAnunciosPage {
  private anuncios = [];
  constructor(
    private alertCtrl: AlertController,
    public jogoService: JogoService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {

  }

  inicializarItems() {
    this.anuncios = [];
    return this.jogoService.getAnunciosDoUser().then(jogos => {
      jogos.forEach(jogo => {
        this.anuncios.push(jogo)
      })
    })
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    loader.present().then(() => {
      this.inicializarItems().then(() => loader.dismiss())

    })
  }

  ionViewWillLeave() {
  }

  private doRefresh(refresher) {
    this.inicializarItems();
    setTimeout(() => {
      // this.showToast('Atualizado com sucesso!')
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
          cssClass: 'alertDanger',
          text: 'Confirmar',
          handler: () => {
            this.deleteAnuncio(todo);
          },
          
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
    this.jogoService.removeAnuncio(todo).then((sucess) => {
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
