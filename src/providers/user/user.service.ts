

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

  edit(user: { name: string, photo: string }): Promise<void> {
    return this.firedata.child(firebase.auth().currentUser.uid)
      .update(user)
      .catch(this.handlePromiseError);
  }
  create(user: User, uuid: string): Promise<void> {
    return this.db.object(`/users/${uuid}`)
      .set(user).catch(this.handlePromiseError);
  }
  uploadPhoto(file: File, userId?: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/users/` + firebase.auth().currentUser.uid + `/` + Math.random().toString(36).substr(2, 9) + `.jpg`)
      .put(file);
  }

  public removeFile(fullPath: string) {

    let storageRef = this.firebaseApp.storage().ref();
    storageRef.child(fullPath).delete()

  }
}