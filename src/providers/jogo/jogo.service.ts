import { Base64 } from '@ionic-native/base64';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Camera } from '@ionic-native/camera';
import { auth, database } from 'firebase/app';
import { Entry } from '@ionic-native/file';

import { Injectable, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import firebase from 'firebase';
import { AngularFireList, snapshotChanges } from 'angularfire2/database';
import { Jogo } from '../../todo/jogo.model';

import { FirebaseApp } from 'angularfire2';
import { BaseService } from '../base/base.service';

import { map } from '@firebase/util';



@Injectable()
export class JogoService extends BaseService {
  private basePath = '/anuncios';
  public _todos$: any = [];
  private _db: any;
  private _openRef: any;
  private _opens$: any;
  anuncios = [];
  firedataJogo = firebase.database().ref('/jogos');
  firedataCategorias = firebase.database().ref('/categorias');
  firedataConsoles = firebase.database().ref('/consoles');

  itemList: any[] = [];
  loadeditemList: any = [];
  lastKey: any = '';
  finished = false;

  constructor( @Inject(FirebaseApp) public firebaseApp: any, public base64: Base64) {
    super();
  }

  getCategorias(): Array<any> {
    var result = [];
    this.firedataCategorias.orderByKey().once('value', (snapshot: any) => {
      snapshot.forEach((childSnapshot) => {
        var element = childSnapshot.val();
        result.push(element);
      });
    });
    return result;
  }

  getConsoles(): Array<any> {
    var result = [];
    this.firedataConsoles.orderByKey().once('value', (snapshot: any) => {
      snapshot.forEach((childSnapshot) => {
        var element = childSnapshot.val();
        result.push(element);
      });
    });
    return result;
  }

  save(jogo: Jogo): PromiseLike<any> {
    return this.firedataJogo.push(jogo)
  }

  userExistsCallback(userId, exists) {
    if (exists) {
      alert('user ' + userId + ' exists!');
    } else {
      alert('user ' + userId + ' does not exist!');
    }
  }

  getJogo(jogoKey: string): Promise<any> {
    var jogo;
    return new Promise<any>((resolve, reject) => {
      this.firedataJogo.child(jogoKey).on(('value'), data => {
        if (data.val() !== null) {
          let item = data.val()
          item.key = data.key
          jogo = item
          resolve(jogo)
        } else {
          reject(false)
        }
      })
    })
  }

  getPorCategoria(limit?: number, categoria?: string) {
    return new Promise<Jogo[]>((resolve) => {
      var item = [];
      console.log("passou no observe");
      return this.firedataJogo
        .orderByChild('categoria')
        .equalTo(categoria)
        .limitToFirst(limit)
        .on('child_added', this.handleData, this);
      // resolve(this._todos$);
    });
  }

  getAnunciosDoUser() {
    return new Promise<Jogo[]>((resolve, reject) => {
      var meusAnuncios = [];
      return this.firedataJogo
        .orderByChild('/user')
        .equalTo(firebase.auth().currentUser.uid)
        .on('value', snapshot => {
          snapshot.forEach(snap => {
            let item = snap.val();
            item.key = snap.key;
            meusAnuncios.push(item);
            return false;
          })
          resolve(meusAnuncios);
        })
    })
  }

  searchAnuncio(nome: string) {
    var anunciosList = []
    return new Promise<any[]>((resolve, reject) => {
      var item = [];
      return this.firedataJogo.child('nome').orderByValue().equalTo(nome)
        .on('value', snapshotChanges => {
          snapshotChanges.forEach((snap) => {
            if (this.lastKey === snap.key) {
              this.finished = true;
            } else {
              let item = snap.val();
              item.key = snap.key;
              this.lastKey = snap.key;
              console.log(snap.key);
              anunciosList.push(item);
              this.anuncios.push(item);
            }
            return false;
          })
          resolve(anunciosList);
        });
    });
  }

  getAllAnuncios(limit: number, lastKey?: string) {
    var anunciosList = []
    return new Promise<any[]>((resolve, reject) => {
      var item = [];
      return this.firedataJogo
        .orderByKey()
        .startAt(this.lastKey + 1)
        .limitToFirst(limit)
        .on('value', snapshotChanges => {
          snapshotChanges.forEach((snap) => {
            if (this.lastKey === snap.key) {
              this.finished = true;
            } else {
              let item = snap.val();
              item.key = snap.key;
              this.lastKey = snap.key;
              console.log(snap.key);
              anunciosList.push(item);
              this.anuncios.push(item);
            }
            return false;
          })
          resolve(anunciosList);
        });
    });
  }

  edit(jogo: Jogo, key?: string): Promise<void> {
    return this.firedataJogo.child(key)
      .set(jogo)
      .catch(this.handlePromiseError);
  }

  update(jogo: Jogo, key: string): Promise<void> {
    return this.firedataJogo.child(key)
      .update(jogo)
      .catch(this.handlePromiseError);
  }

  uploadPhoto64(file: string, jogoId: string): Promise<string> {
    return this.makeFileIntoBase64(file)
      .then(imgBase64 => this.uploadToFirebaseImg64(imgBase64, jogoId))
      .then(url => url)
      .catch(this.handlePromiseError)
  }

  makeFileIntoBase64(imagePath): Promise<string> {
    return this.base64.encodeFile(imagePath).then((base64File: string) => {
      console.log(base64File)
      return base64File;
    }, this.handlePromiseError);
  }


  uploadToFirebaseImg64(img64: string, jogoId: string): Promise<string> {
    var randomNumber = Math.floor(Math.random() * 256);
    let storageRef = firebase.storage().ref(this.basePath + `/${jogoId}/` + randomNumber + '.jpg');//Firebase storage main path
    let metadata: firebase.storage.UploadMetadata = {
      contentType: 'image/jpeg',
    };
    console.log('uptoFirebase');
    return storageRef.putString(img64, 'data_url', metadata)
      .then((uploadTask) =>
        // let uploadProgress = Math.round((uploadTask.bytesTransferred / uploadTask.totalBytes) * 100)
        uploadTask.downloadURL
      ).catch(error => this.handlePromiseError);
  }


  public removeFile(fullPath: string) {
    let storageRef = this.firebaseApp.storage().ref();
    return storageRef.child(fullPath).delete();
  }

  public removeAnuncio(jogo: Jogo): Promise<any> {
    let path = firebase.storage().ref(this.basePath + `/${jogo.key}`);
    if (!jogo.fotos) {
      return firebase.database().ref(`/jogos/${jogo.key}`)
        .remove()
    } else {
      jogo.fotos.forEach((value) => {
        let name = value.substr(value.indexOf('%2F') + 3, (value.indexOf('?')) - (value.indexOf('%2F') + 3));
        name = name.substr(name.indexOf('%2F') + 3, 8)
        path.child(`${name}`).delete();
      }, 0);
      return firebase.database().ref(`/jogos/${jogo.key}`)
        .remove()
    }
  }

  handleData(snap) {
    let tempJogos = []
    if (this.lastKey === snap.key) {
      this.finished = true;
    } else {
      try {
        let item = snap.val();
        item.key = snap.key;
        this._todos$.next(item);
        this.lastKey = snap.key;
        console.log(snap.key);
      } catch (error) {
        console.log('catching', error);
      }
    }
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
};