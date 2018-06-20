import { AuthService } from './../../providers/auth/auth';
import { auth } from 'firebase/app';
import { JogoService } from './../../providers/jogo/jogo.service';

import { TelefoneValidator } from './../../validators/telefone.validator';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, Loading, LoadingController, AlertController, Alert, ActionSheetController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Jogo } from '../../todo/jogo.model';
import { EmailValidator } from '../../validators/email';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';
import { ImageViewerController } from 'ionic-img-viewer';
import { CameraService } from '../../providers/camera/camera.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Entry } from '@ionic-native/file';

@Component({
  selector: 'page-editar-anuncio',
  templateUrl: 'editar-anuncio.html',
})
export class EditarAnuncioPage {
  photo: Array<any> = new Array;
  key: string;
  qtdPhotos: number = 0;
  uploadProgress: number;
  _imageViewerCtrl: ImageViewerController;
  private console: string;
  private categoria: string;
  private preco: string;
  public newAnuncio: any;
  public jogo: Jogo;
  myDate: string = new Date().toISOString();

  constructor(
    public actionSheetCtrl: ActionSheetController,
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
  ) {
    
    this.jogo = navParams.get('jogo');
    this.qtdPhotos = this.jogo.fotos.length;
    this.photo = [];

    this._imageViewerCtrl = imageViewerCtrl;
    this.newAnuncio = formBuilder.group({
      'editarNome': [
        '',
        Validators.compose([Validators.required])
      ],
      'editarDescricao': [
        '',
        Validators.compose([Validators.required])
      ],
      'editarCategoria': [
        '',
        Validators.compose([Validators.required])
      ],
      'editarConsole': [
        '',
        Validators.compose([Validators.required])
      ],
      'editarPreco': [
        '',
        Validators.compose([Validators.required])
      ]

    });
  }
  ionViewWillLeave() {
   
  }

  async save() {
    if (!this.newAnuncio.valid) {
      console.log(`Form is not valid yet, current value: ${this.newAnuncio.value}`);
    } else {
      const loading: Loading = this.loadingCtrl.create();
      loading.present();
      try {
        this.jogo = new Jogo(
          firebase.auth().currentUser.uid,
          '',
          this.newAnuncio.value.editarNome,
          this.newAnuncio.value.editarConsole,
          this.newAnuncio.value.editarCategoria,
          this.newAnuncio.value.editarDescricao,
          this.newAnuncio.value.editarPreco,
          this.myDate);
        this.key = this.jogoService.save(this.jogo);
        if (this.key) {
          let cont = 0;
          this.photo.reduce((current, currentValue, currentIndex, array) => {
            this.jogoService.uploadPhoto(currentValue, this.key).then((value) => {
              console.log('current', current, '+++currentValue', currentValue, 'index ', currentIndex);
              cont++;
              this.jogo.fotos.push(value);
              if (cont == this.qtdPhotos) {
                this.uploadToDatabase();
                this.navCtrl.setRoot(HomePage);
                loading.dismiss();
                this.showToast('Anúncio Cadastrado com Sucesso!');
              }

            }).catch((error) => alert(error));

          }, 0);

        }

      } catch (error) {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
        this.navCtrl.getPrevious();
      };

    }
  }

  getQtdFotos() {
    if (this.qtdPhotos > 3) return false
    else return true;
  }
  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
  }

  removeItem(item) {
    for (let i = 0; i < this.photo.length; i++) {
      if (this.photo[i] == item) {
        this.photo.splice(i, 1);
        this.qtdPhotos--;
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
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);

          }
        }
        ,
        {
          text: "Tirar foto",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);

          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).present().then((value) => {

    });
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
      allowEdit: true
    };


    this.camera.getPicture(cameraOptions)
      .then((fileUri: string) => {
        console.log('File URI: ', fileUri);
        this.cameraService.saveFile(fileUri, sourceType)
          .then((entry: Entry) => {
            this.photo.push(entry.nativeURL);
            this.qtdPhotos++;
            console.log('FOTOS:', this.photo);
          });

      }).catch((err: Error) => console.log('Camera error: ', err));
  }


  private uploadToDatabase() {
    this.jogoService.edit(this.jogo, this.key).then((valor) => {
      console.log('editou o jogo',valor);
      
    }).catch((error) => alert(error));
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
    }).present();
  }

}
