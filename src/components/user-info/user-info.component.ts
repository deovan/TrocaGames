import { Component, Input } from '@angular/core';
import { User } from '../../todo/user.model';
import { ActionSheetController } from 'ionic-angular';
import firebase from 'firebase'
import { UserService } from '../../providers/user/user.service';
import { CameraService } from '../../providers/camera/camera.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Entry } from '@ionic-native/file';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.component.html'
})
export class UserInfoComponent {
  @Input() user: User;
  @Input() isMenu: boolean = true;
  private filePhoto: string;
  uploadProgress: number;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public cameraService: CameraService,
    public userService: UserService
  ) {

  }


  changedPhoto(file) {
    let uploadTask = this.userService.uploadPhoto64(file).then((url) => {
      this.editUser(url);
    })
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
            this.filePhoto = entry.nativeURL
            this.changedPhoto(this.filePhoto)
          })
      }).catch((err: Error) => console.log('Camera error: ', err))
  }

  editUser(url) {
    if (this.user.photo) {
      console.log('ja possui foto');
      console.log(this.user.photo);
      this.userService.removeFile(this.user.photo)
      this.user.photo = url
      this.userService.edit(this.user).then((value) => {
        this.filePhoto = ''
      })
    } else {
      this.user.photo = url
      this.userService.edit(this.user).then((value) => {
        this.filePhoto = ''
      })
    }

  }

}

