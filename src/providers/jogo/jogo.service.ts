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


declare var window: any;

@Injectable()
export class JogoService extends BaseService {
  items: any;
  private basePath: string = '/anuncios/';
  private _todos$: any;
  private _db: any;
  private _openRef: any;
  private _opens$: any;
  firedataJogo = firebase.database().ref('/jogos');
  firedataCategorias = firebase.database().ref('/categorias');
  itemList: any[] = [];
  loadeditemList: any = [];
  lastKey: any = '';
  finished = false;
  constructor(@Inject(FirebaseApp) public firebaseApp: any, ) {
    super();
  }




  getCategorias(): any[] {
    var result = [];
    // load data from firebase...
    this.firedataCategorias.orderByKey().once('value', (snapshot: any) => {
      snapshot.forEach((childSnapshot) => {
        // get the key/id and the data for display
        var element = childSnapshot.val();
        result.push(element);
      });

    });
    return result;
  }


  save(jogo: Jogo) {
    return this.firedataJogo.push(jogo).key;
  }


  handleData(snap) {
    try {
      this._todos$.next(snap.val());
      if (this.lastKey === snap.key) {
        this.finished = true;
      }
      this.lastKey = snap.key;
      console.log(snap.key);
    } catch (error) {
      console.log('catching', error);
    }
  }

  getPorCategoria( limit ?: number  ,categoria ?: string){
    return new Observable<Jogo[]>((observer) => {
      var item = [];
      console.log("passou no observe");
      this.firedataJogo
        .orderByChild('categoria')
        .equalTo(categoria)
        .limitToFirst(limit)
        .on('child_added', this.handleData, this);
      this._todos$ = new ReplaySubject();
      observer.next(this._todos$);
    });
  }



  allOpened(limit: number, lastKey?: string): Observable<any[]> {
    if (this.finished) {
      return
    }
    return new Observable<Jogo[]>((observer) => {
      var item = [];
      console.log("passou no observe");
      this.firedataJogo
        .orderByKey()
        .startAt(this.lastKey + 1)
        .limitToFirst(limit)
        .on('child_added', this.handleData, this);
      this._todos$ = new ReplaySubject();
      observer.next(this._todos$);
    });
  }

  edit(jogo: Jogo, key?: string): Promise<void> {
    return this.firedataJogo.child(key)
      .set(jogo)
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
      let storageRef = firebase.storage().ref(this.basePath + `${jogoId}/` + randomNumber + '.jpg');//Firebase storage main path

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
}