import { Injectable } from '@angular/core';
import { File, Entry } from '@ionic-native/file';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ActionSheetController, LoadingController, NavController, NavParams, Platform, ToastController, Loading } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult, FileTransferError } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

@Injectable()
export class CameraService {

  photo: Entry;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public file: File,
    public filePath: FilePath,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
  }

  private correctPathAndGetFileName(fileUri: string, sourceType: number): Promise<void | { oldFilePath: string, oldFileName: string }> {

    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

      return this.filePath.resolveNativePath(fileUri)
        .then((correctFileUri: string) => {

          return {
            oldFilePath: correctFileUri.substr(0, (correctFileUri.lastIndexOf('/') + 1)),
            oldFileName: fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.lastIndexOf('?'))
          }

        }).catch(err => console.log('Erro ao corrigir path no Android: ', err));

    }

    return Promise.resolve({
      oldFilePath: fileUri.substr(0, fileUri.lastIndexOf('/') + 1),
      oldFileName: fileUri.substr(fileUri.lastIndexOf('/') + 1)
    });
  }

  private createNewFileName(oldFileName: string): string {
    let extension: string = oldFileName.substr(oldFileName.lastIndexOf('.')); // .png, .jpg
    return new Date().getTime() + extension; // 1264546456.jpg
  }

  public saveFile(fileUri: string, sourceType: number): Promise<Entry | void> {
    return this.correctPathAndGetFileName(fileUri, sourceType)
      .then((data: { oldFilePath: string, oldFileName: string }) => {
        return this.file.copyFile(data.oldFilePath, data.oldFileName, this.file.dataDirectory, this.createNewFileName(data.oldFileName))
          .catch(err => console.log('Erro ao copiar arquivo: ', err));
      }).catch(err => console.log('Erro na chamada do método correctPathAndGetFileName', err));
  }
}
