import { timeout } from 'rxjs/operators';
import { LoadingController } from 'ionic-angular';
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
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';


@Component({
  templateUrl: 'home.html'
})

export class HomePage {
  public todos: any;
  private categorias = [];
  limit: number = 20;
  canSearch: boolean = false;
  currentUser = '';
  private _someListener: Subscription = new Subscription();


  constructor(
    public authService: AuthService,
    public admob: AdMobFree,
    private _jogoService: JogoService,
    private _LOADER: PreloaderService,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public navCtrl: NavController,
    public toastCtrl: ToastController) {
    this.todos = []
    this.currentUser = firebase.auth().currentUser.uid;
    menu.enable(true);
    this.showBanner();
  }


  showBanner() {

    let bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-9146010147596764/5044195931',
      isTesting: true, // Remove in production
      autoShow: true,
      offsetTopBar: true
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      // success
    }).catch(e => console.log(e));

  }


  ionViewCanEnter() {
    console.log('passou no ionviewcanenter');
    this.todos = [];
    this.categorias = this._jogoService.getCategorias();
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present().then(() => {
      this.initializeItems().then(() => {
        loader.dismiss();
      });
    })
  }


  ionViewDidLoad() {
    console.log('passou no ionViewDidLoad');


  }


  // ionViewDidLoad() {
  //   console.log('passou no ionViewDidLoad');

  //   let loader = this.loadingCtrl.create({
  //     content: "Buscando Anúncios",
  //     duration: 2000,
  //   });
  //   loader.present().then(() => {
  //     console.log('loaderrssss');
  //     this.initializeItems().then(() => {
  //       loader.dismiss();
  //     });
  //   });

  // }

  ionViewWillLeave() {
    this._someListener.unsubscribe();
    this.todos = [];
    this._jogoService.anuncios = [];
    this._jogoService.lastKey = '';
    this._jogoService.finished = false;
  }

  async initializeItems() {
    this.todos = []
    await this._jogoService.getAllAnuncios(this.limit).then((observer) => {
      this._someListener = observer.subscribe((value) => {
        value.forEach((jogo: Jogo) => {
          if (jogo.user != this.currentUser) this.todos.push(jogo);
        });
      });
    })
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
      value.forEach((jogo) => {
        this.todos.push(jogo);
      });
    });
  }

  doRefresh(refresher) {
    this.initializeItems();
    setTimeout(() => {
      // this.showToast('Atualizado com sucesso!')
      refresher.complete();
    }, 3000);
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
    setTimeout(() => {
      for (let i = 0; i < 1; i++) {
        this.initializeItems();
      }
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