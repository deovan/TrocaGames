

import { Injectable, Inject } from "@angular/core";
import { BaseService } from "../base/base.service";
import { Observable } from "rxjs";
import { User } from "../../todo/user.model";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseApp } from "angularfire2";
import firebase from "firebase";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import 'rxjs/add/operator/map';


@Injectable()
export class UserService extends BaseService {
  users: Observable<User[]>;
  private basePath = '/users';

  firedata = firebase.database().ref('/users');

  constructor(
    @Inject(FirebaseApp) public firebaseApp: any,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) {
    super();
  }


  getuserdetails(userId: string): Observable<User> {
    return <Observable<User>>this.db.object(`/users/${userId}`).valueChanges();
  }

  getUser(userId: string): Observable<User> {
    return <Observable<User>>this.db.object(`/users/${userId}`).valueChanges();

  }

  //  setUsers(uidToExclude: string): void {
  //     this.users =<Observable<User[]>>this.firedata.child(uidToExclude)..map((_) => {
  //       return _.filter((user: User) =>
  //         user.$key !== uidToExclude
  //       )
  //     });
  //   }

  edit(user): Promise<void> {
    delete user.$key
    return this.firedata.child(firebase.auth().currentUser.uid)
      .update(user)
      .catch(this.handlePromiseError);
  }
  create(user: User, uuid: string,localization?:any): Promise<void> {
    return this.db.object(`/users/${uuid}`)
      .set(user).catch(this.handlePromiseError);
  }


  uploadPhoto(file: File, userId?: string):Promise<string> {
    return new Promise((resolve, reject) => {
      this.makeFileIntoBlob(file)
        .then((fileBlob) => {
          this.uploadToFirebase(fileBlob).then((url) => {
            setTimeout(() => {
              resolve(url);
            }, 500);
          })

        })
    })
  }

  uploadToFirebase(imgBlob: any): Promise<string> {
    var randomNumber = Math.floor(Math.random() * 256);
    console.log('Random number : ' + randomNumber);
    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage()
      .ref()      
      .child(`/users/` + firebase.auth().currentUser.uid + `/` + Math.random().toString(36).substr(2, 9) + `.jpg`)
      ;//Firebase storage main path
      let metadata: firebase.storage.UploadMetadata = {
        contentType: 'image/jpeg',
      };
      storageRef.put(imgBlob, metadata)
        .then((uploadTask) => {
          let uploadProgress = Math.round((uploadTask.bytesTransferred / uploadTask.totalBytes) * 100)
          console.log(uploadProgress);
          setTimeout(() => {
            resolve(uploadTask.downloadURL);
          }, 500);
        });
    })
  }


  public removeFile(fullPath: string) {
    var key = firebase.auth().currentUser.uid
    var path = firebase.storage().ref(this.basePath).child(key);
    let name = fullPath.substr(fullPath.indexOf('%2F') + 3, (fullPath.indexOf('?')) - (fullPath.indexOf('%2F') + 3));
    name = name.substr(name.indexOf('%2F') + 3, 9)
    path.child(`${name}`+'.jpg').delete();
  }
}