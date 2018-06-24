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
import { Observable } from 'rxjs/Observable';
import { map } from '@firebase/util';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';


declare var window: any;

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
  itemList: any[] = [];
  loadeditemList: any = [];
  lastKey: any = '';
  finished = false;

  constructor(@Inject(FirebaseApp) public firebaseApp: any, ) {
    super();
  }

  getCategorias() {
    var result = [];
    this.firedataCategorias.orderByKey().once('value', (snapshot: any) => {
      snapshot.forEach((childSnapshot) => {
        var element = childSnapshot.val();
        result.push(element);
      });
    });
    return result;
  }

  save(jogo: Jogo) {
    return new Promise<string>(resolve => {
      let key = this.firedataJogo.push(jogo).key;
      resolve(key);
    })

  }
  userExistsCallback(userId, exists) {
    if (exists) {
      alert('user ' + userId + ' exists!');
    } else {
      alert('user ' + userId + ' does not exist!');
    }
  }

  getJogo(jogoKey: string) {
    var jogo;
    return new Promise<any>((resolve, reject) => {
      this.firedataJogo.child(jogoKey).on(('value'), data => {
        if (data.val() !== null) {
          let item = data.val()
          item.key = data.key
          jogo = item
        } else {
          jogo = false;
        }
      });

      setTimeout(() => {
        resolve(jogo);
      }, 300);
    })

  }

  getPorCategoria(limit?: number, categoria?: string) {
    return new Observable<Jogo[]>((observer) => {
      var item = [];
      console.log("passou no observe");
      this.firedataJogo
        .orderByChild('categoria')
        .equalTo(categoria)
        .limitToFirst(limit)
        .on('child_added', this.handleData, this);
      observer.next(this._todos$);
    });
  }

  getAnunciosDoUser() {
    return new Promise<Jogo[]>((resolve, reject) => {
      var meusAnuncios = [];
      this.firedataJogo
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

  getAllAnuncios(limit: number, lastKey?: string) {
    return new Promise<any[]>((resolve, reject) => {
      var item = [];
      this.firedataJogo
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
              this.anuncios.push(item);
            }
            return false;
          })
        });
      setTimeout(() => {
        resolve(this.anuncios);
      }, 2000);
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

  uploadPhoto(file: string, jogoId: string): Promise<string> {
    return this.makeFileIntoBlob(file)
      .then((fileBlob) => {
        return this.uploadToFirebase(fileBlob, jogoId);
      })
      .then((uploadSnapshot: any) => {
        return uploadSnapshot.downloadURL;
      })
  }

  uploadToFirebase(imgBlob: any, jogoId: string) {
    var randomNumber = Math.floor(Math.random() * 256);
    console.log('Random number : ' + randomNumber);
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref(this.basePath + `/${jogoId}/` + randomNumber + '.jpg');//Firebase storage main path

      let metadata: firebase.storage.UploadMetadata = {
        contentType: 'image/jpeg',
      };

      let uploadTask = storageRef.put(imgBlob, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const snap = snapshot as firebase.storage.UploadTaskSnapshot
          let uploadProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          // upload in progress

          console.log(uploadProgress);
        },
        (error) => {
          // upload failed
          console.log(error);
          reject(error);
        },
        () => {
          // upload success
          let url = uploadTask.snapshot.downloadURL
          console.log('Saved picture url', url);
          resolve(uploadTask.snapshot);
        });
    });
  }

  public removeFile(fullPath: string) {
    let storageRef = this.firebaseApp.storage().ref();
    storageRef.child(fullPath).delete();
  }

  public removeAnuncio(jogo: Jogo) {
    console.log('key', jogo);
    var path = firebase.storage().ref(this.basePath + `/${jogo.key}`);
    if(!jogo.fotos){
      return firebase.database().ref(`/jogos/${jogo.key}`)
      .remove()
    }else{
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
  console.log(returnArr);

  return returnArr;
};