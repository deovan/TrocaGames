import { Subscription } from 'rxjs/Subscription';
import firebase from 'firebase';
import { InserirAnuncioPage } from './../inserir-anuncio/inserir-anuncio';
import { ChatPage } from './../chat/chat';
import { PreloaderService } from './../../providers/preloader/preloader.service';
import { AnuncioDetalhesPage } from './../anuncio-detalhes/anuncio-detalhes';

import { JogoService } from './../../providers/jogo/jogo.service';
import { Observable } from 'rxjs';
import { LoginPage } from './../login/login';

import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth/auth';
import { Jogo } from '../../todo/jogo.model';


@Component({
  templateUrl: 'home.html'
})

export class HomePage {


  public todos = [];
  private categorias = [];
  limit: number = 50;
  canSearch: boolean = false;
  currentUser = '';
  private _someListener: Subscription = new Subscription();


  constructor(
    public authService: AuthService,
    private _jogoService: JogoService,
    private _LOADER: PreloaderService,
    public menu: MenuController,
    public navCtrl: NavController,
    public toastCtrl: ToastController) {
    this.initializeItems();
    this.currentUser = firebase.auth().currentUser.uid;
    menu.enable(true);
  }

  exibirPorCategorias(categoria) {
    // this._jogoService.finished = false;
    // this._jogoService.lastKey = '';
    // this.buscaPorCategoria(categoria)
  }

  buscaPorCategoria(event) {
    let that = this;
    this.todos = [];
    console.log(event);
    this._jogoService.getPorCategoria(this.limit, event).subscribe((value) => {
      console.log('passou', value);
      value.forEach((jogo) => {
        this.todos.push(jogo);
      });
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.initializeItems();
    setTimeout(() => {
      this.showToast('Atualizado com sucesso!')
      refresher.complete();
    }, 3000);
  }

  initializeItems() {
    this._someListener = this._jogoService.allOpened(this.limit).subscribe((value) => {
      console.log('passou', value);
      value.forEach((jogo: Jogo) => {
        if (jogo.user != this.currentUser) this.todos.push(jogo);
      });
    });
  }



  ionViewDidLoad() {
    this.categorias = this._jogoService.getCategorias();
    this._jogoService.lastKey = '';
    this._jogoService.allOpened(this.limit);
  }


  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    this._jogoService.lastKey = '';
    this._someListener.unsubscribe();
  }

  getItems(ev) {

    // Reset items back to all of the items
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.todos = this.todos.filter((todo) => {
        return (todo.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.todos = [];
      this._jogoService.lastKey = '';
      this.initializeItems()
    }




  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {
      for (let i = 0; i < 1; i++) {
        this.initializeItems();
      }
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  private showToast(message: string): void {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present()
  }

  itemTapped(event, todo) {
    this.navCtrl.push(AnuncioDetalhesPage, {
      todo: todo
    });
  }
}