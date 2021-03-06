import { map } from '@firebase/util';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from './../../providers/auth/auth'
import { auth } from 'firebase/app'
import { JogoService } from './../../providers/jogo/jogo.service'

import { TelefoneValidator } from './../../validators/telefone.validator'
import { Component, ViewChild, ElementRef } from '@angular/core'
import { NavController, NavParams, ToastController, Loading, LoadingController, AlertController, Alert, ActionSheetController } from 'ionic-angular'
import { HomePage } from '../home/home'
import { Jogo } from '../../todo/jogo.model'
import { EmailValidator } from '../../validators/email'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import firebase from 'firebase'
import { ImageViewerController } from 'ionic-img-viewer'
import { CameraService } from '../../providers/camera/camera.service'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { Http } from '@angular/http'
import { Entry } from '@ionic-native/file'
import { UserService } from '../../providers/user/user.service'
import { User } from '../../todo/user.model'
import { timeout } from 'rxjs/operator/timeout';
import { AdMobFreeInterstitialConfig, AdMobFree } from '../../../node_modules/@ionic-native/admob-free';



@Component({
  selector: 'page-inserir-anuncio',
  templateUrl: 'inserir-anuncio.html',
})
export class InserirAnuncioPage {
  currentUser: User
  photo: Array<any> = new Array
  qtdPhotos: number = 0
  uploadProgress: number
  _imageViewerCtrl: ImageViewerController
  private console: string
  private categoria: string
  private preco: string
  public newAnuncio: any
  public jogo: Jogo
  myDate: string = new Date().toISOString()
  troca: boolean = false;
  venda: boolean = false;


  constructor(
    public actionSheetCtrl: ActionSheetController,
    public admob: AdMobFree,
    public camera: Camera,
    public cameraService: CameraService,
    public http: Http,
    imageViewerCtrl: ImageViewerController,
    public navCtrl: NavController,
    public authService: AuthService,
    public navParams: NavParams,
    public jogoService: JogoService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private currencyPipe: CurrencyPipe
  ) {
    this._imageViewerCtrl = imageViewerCtrl
    this.newAnuncio = formBuilder.group({
      'nome': [
        '',
        Validators.compose([Validators.required])
      ],
      'descricao': [
        '',
        Validators.compose([Validators.required])
      ],
      'categoria': [
        '',
        Validators.compose([Validators.required])
      ],
      'console': [
        '',
        Validators.compose([Validators.required])
      ],
      'preco': [
        '',
        Validators.compose([Validators.required])
      ],
      'troca': [
        Validators.compose([])
      ],
      'venda': [
        Validators.compose([])
      ]
    })
  }

  ionViewDidLoad(){
    this.loadUserDetails()
  }

  ionViewWillLeave() {
    this.qtdPhotos = 0
    this.photo = []
  }

  loadUserDetails() {
    this.userService.getUser(firebase.auth().currentUser.uid).subscribe((res: User) => {
      this.currentUser = res
    })
  }

  save() {
    if (!this.newAnuncio.valid) {
      console.log(`Form is not valid yet, current value: ${this.newAnuncio.value}`)
    } else {
      const loading: Loading = this.loadingCtrl.create({
        spinner: 'dots'
      })
      loading.present().then(() => {
        this.jogo = new Jogo(
          firebase.auth().currentUser.uid,
          this.currentUser.name,
          this.newAnuncio.value.nome,
          this.newAnuncio.value.console,
          this.newAnuncio.value.categoria,
          this.newAnuncio.value.descricao,
          this.newAnuncio.value.preco,
          firebase.database.ServerValue.TIMESTAMP,
          this.currentUser.cidade ? this.currentUser.cidade : null,
          this.troca,
          this.venda,
        )
        console.log(this.jogo);

        this.jogoService.save(this.jogo).then((value) => {
          console.log('value confirmado', value.key);
          ;
          if (this.photo.length > 0) {
            console.log('entrou');
            this.uploadToStorage(value.key, this.photo).then(() => {
              this.jogoService.update(this.jogo, value.key).then(() => {
                loading.dismiss()
                this.showToast('Anúncio Cadastrado com Sucesso!')
                this.showBannerInterstitial();
                this.navCtrl.setRoot(HomePage);
              })
            }).catch((error) => {
              console.log(error)
              loading.dismiss()
              this.showAlert(error)
              this.navCtrl.getPrevious()
            })
          } else {
            loading.dismiss()
            this.showToast('Anúncio Cadastrado com Sucesso!')
            this.showBannerInterstitial();
            this.navCtrl.setRoot(HomePage);
          }
        }), (error => {
          console.log()
          loading.dismiss()
          this.showAlert(error.message)
          this.navCtrl.getPrevious()
        })

      })

    }
  }

  showBannerInterstitial() {
    let bannerConfig: AdMobFreeInterstitialConfig = {
      /**
       * Ad Unit ID
       */
      id: 'ca-app-pub-9146010147596764/3786556172',
      /**
       * Receiving test ad
       */
      isTesting: true,
      /**
       * Auto show ad when loaded
       */
      autoShow: true
    }
    this.admob.interstitial.config(bannerConfig)
    this.admob.interstitial.prepare().then(() => {
      this.admob.interstitial.show()
    }).catch(e => console.log(e))

  }

  uploadToStorage(key: string, fotos: string | string[]): Promise<any> {
    let p: Array<any> = [];
    this.photo.forEach((valueC, index) => {
      p.push(this.jogoService.uploadPhoto64(valueC, key)
        .then(value => this.jogo.fotos.push(value))
        .catch((error) => {
          console.log(error);
          
          this.showAlert(error)
        }))
    })
    return Promise.all(p).then(v => { return Promise.resolve('ok') })
    .catch(error => console.log('promiseAll',error));
  }

  getQtdFotos() {
    if (this.qtdPhotos > 3) return false
    else return true
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage, )
    imageViewer.present()
  }

  removeItem(item) {
    for (let i = 0; i < this.photo.length; i++) {
      if (this.photo[i] == item) {
        this.photo.splice(i, 1)
        this.qtdPhotos--
      }
    }
  }

  onActionSheet() {
    this.actionSheetCtrl.create({
      title: 'Selecione o camingo da imagem',
      buttons: [
        {
          text: 'Ler da Galeria',
          handler: async () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        }
        ,
        {
          text: "Tirar foto",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).present().then((value) => {

    })
  }

  public async takePicture(sourceType: number) {
    let cameraOptions: CameraOptions = {
      correctOrientation: true,
      quality: 100,
      targetHeight: 250,
      targetWidth: 250,
      saveToPhotoAlbum: false,
      sourceType: sourceType,
      encodingType: 0,
      mediaType: 0,
      allowEdit: false
    }
    this.camera.getPicture(cameraOptions)
      .then((fileUri: string) => {
        this.cameraService.saveFile(fileUri, sourceType)
          .then((entry: Entry) => {
            this.photo.push(entry.nativeURL)
            this.qtdPhotos++
            console.log('FOTOS:', this.photo)
          })

      }).catch((err: Error) => console.log('Camera error: ', err))
  }

  private uploadToDatabase(key: string, jogo: Jogo) {
    return this.jogoService.update(jogo, key).then((valor) => {
    }).catch((error) => this.showAlert(error))
  }

  private showToast(message: string): void {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present()
  }


  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present()
  }

}