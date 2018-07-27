import { InserirAnuncioPage } from './../inserir-anuncio/inserir-anuncio';
import { AnuncioDetalhesPage } from './../anuncio-detalhes/anuncio-detalhes';
import firebase  from 'firebase';
import { Jogo } from './../../todo/jogo.model';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderForwardResult, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { LoadingController, MenuController, NavController, PopoverController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthService } from "../../providers/auth/auth";
import { AdMobFree, AdMobFreeBannerConfig } from "@ionic-native/admob-free";
import { JogoService } from "../../providers/jogo/jogo.service";
import { PreloaderService } from "../../providers/preloader/preloader.service";

@Component({
  templateUrl: 'home.html'
})

export class HomePage {
  public todos = []
  private categorias = []
  limit: number = 20
  canSearch: boolean = false
  currentUser = ''
  // private _someListener: Subscription = new Subscription()


  constructor(
    public authService: AuthService,
    public admob: AdMobFree,
    
    private _jogoService: JogoService,
    private _LOADER: PreloaderService,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public navCtrl: NavController,
    // public geolocation: Geolocation,
    // private nativeGeocoder: NativeGeocoder,
    // public popoverCtrl: PopoverController,
    public toastCtrl: ToastController) {
    this.currentUser = firebase.auth().currentUser.uid
    menu.enable(true)
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    // geolocation.getCurrentPosition().then((resp) => {
    //   console.log('resp',resp);
      
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //  }).catch((error) => {
    //    console.log('Error getting location', error);
    //  });

    // this.nativeGeocoder.reverseGeocode(-23.2813634,-51.1812797, options)
    //   .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
    //   .catch((error: any) => console.log(error));

    // this.nativeGeocoder.forwardGeocode('Berlin', options)
    //   .then((coordinates: NativeGeocoderForwardResult[]) => console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude))
    //   .catch((error: any) => console.log(error));
  }

  
  // presentPopover(myEvent) {
  
  //   let popover = this.popoverCtrl.create(PopoverComponent);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  ionViewDidLoad() {
    this.showBanner();
    this._jogoService.anuncios = []
    this._jogoService.lastKey = ''
    this._jogoService.finished = false
    this.initializeItems()
  }

  ionViewCanEnter() {


  }


  ionViewWillLeave() {
    this.admob.banner.remove();

  }

  initializeItems() {
    return this._jogoService.getAllAnuncios(this.limit)
      .then((value) => {
        value.forEach((jogo: Jogo) => {
          if (jogo.user != this.currentUser) this.todos.push(jogo)
        })
      })
  }

  exibirPorCategorias(categoria) {
    // this._jogoService.finished = false
    // this._jogoService.lastKey = ''
    // this.buscaPorCategoria(categoria)
  }

  buscaPorCategoria(event) {
    let that = this
    this.todos = []
    console.log(event)
    this._jogoService.getPorCategoria(this.limit, event).subscribe((value) => {
      value.forEach((jogo) => {
        this.todos.push(jogo)
      })
    })
  }

  openPage(event:Event){
    this.navCtrl.push(InserirAnuncioPage)
  }

  doRefresh(refresher) {
    this.initializeItems()
    setTimeout(() => {
      // this.showToast('Atualizado com sucesso!')
      refresher.complete()
    }, 1000)
  }

  getItems(ev) {
    // Reset items back to all of the items
    // set val to the value of the ev target
    var val = ev.target.value
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.todos = this._jogoService.anuncios.filter((todo) => {
        if (todo.user !== this.currentUser)
          return (todo.nome.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    } else {
      this._jogoService.lastKey = ''
      this._jogoService.anuncios = []
      this._jogoService.finished = false
      this.todos = []
      this.initializeItems()
      // this._jogoService.lastKey = ''
      // this._jogoService.anuncios = []
      // this._jogoService.finished = false
      // this.initializeItems()
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.initializeItems()
      infiniteScroll.complete()
    }, 1000)
  }

  showBanner() {
    let bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-9146010147596764/5044195931',
      isTesting: true, // Remove in production
      autoShow: true,
      offsetTopBar: true
    }
    this.admob.banner.config(bannerConfig)
    this.admob.banner.prepare().then(() => {
    }).catch(e => console.log(e))



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
    })
  }
}