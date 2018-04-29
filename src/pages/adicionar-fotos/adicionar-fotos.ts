import { Jogo } from './../../todo/jogo.model';
import { Http } from '@angular/http';
import { JogoService } from './../../providers/jogo/jogo.service';
import { NavController, Loading, ToastController, AlertController } from 'ionic-angular';
import { Component } from "@angular/core";
import firebase from 'firebase';
import { NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { CameraService } from "../../providers/camera/camera.service";
import { Entry } from "@ionic-native/file";
import { HomePage } from '../home/home';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { elementAt } from 'rxjs/operators';



@Component({
  selector: 'page-adicionar-fotos',
  templateUrl: 'adicionar-fotos.html',
})
export class AdicionarFotosPage {
  photo: Array<any> = new Array;
  jogo: Jogo;
  key: string;
  qtdPhotos: number = 0;
  image0: string;
  image1: string;
  image2: string;
  image3: string;
  buttonP: string = '';


  uploadProgress: number;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public cameraService: CameraService,
    public jogoService: JogoService,
    public http: Http,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    var receptor = navParams.get('jogo');
    this.jogo = new Jogo(
      receptor.user,
      receptor.nome,
      receptor.console,
      receptor.categoria,
      receptor.descricao,
      receptor.preco,
      receptor.datetime
    );
  }
  ionViewWillLeave() {
    this.qtdPhotos = 0;
    this.photo = [];
  }

  getQtdFotos() {
    if (this.qtdPhotos > 3) return false
    else return true;
  }

  onActionSheet() {
    console.log(this.buttonP);
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
            switch (this.buttonP) {
              case 'image0':
                this.image0 = entry.nativeURL;
                this.photo.push( entry.nativeURL);
                this.qtdPhotos++;
                break;
              case 'image1':
                this.image1 = entry.nativeURL;
                this.photo.push( entry.nativeURL);
                this.qtdPhotos++;
                break;
              case 'image2':
                this.image2 = entry.nativeURL;
                this.photo.push( entry.nativeURL);
                this.qtdPhotos++;
                break;
              case 'image3':
                this.image3 = entry.nativeURL;
                this.photo.push( entry.nativeURL);
                this.qtdPhotos++;
                break;
            }
          });

      }).catch((err: Error) => console.log('Camera error: ', err));
  }



  save() {

    const loading: Loading = this.loadingCtrl.create();
    loading.present();
    try {
      this.key = this.jogoService.save(this.jogo);
      if (this.key) {
        let cont = 0;
        this.photo.reduce((current, currentValue, currentIndex, array) => {
          this.jogoService.uploadPhoto(currentValue, this.key).then((value) => {
            console.log('current',current, '+++currentValue', currentValue, 'index ', currentIndex);
            cont++;
            this.jogo.fotos.push(value);
            if (cont == this.qtdPhotos) {
              this.uploadToDatabase();
              loading.dismiss();
              this.navCtrl.setRoot(HomePage);
              this.showToast('Anúncio Cadastrado com Sucesso!');
            }

          }).catch((error) => alert(error));

        },0);

      }

    } catch (error) {
      console.log(error);
      loading.dismiss();
      this.showAlert(error);
      this.navCtrl.getPrevious();
    };
  }

  private uploadToDatabase() {
    this.jogoService.edit(this.jogo, this.key).then(() => {

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


