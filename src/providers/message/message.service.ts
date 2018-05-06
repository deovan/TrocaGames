import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { AngularFireDatabase, AngularFireList, AngularFireAction, snapshotChanges } from "angularfire2/database";
import { Http } from "@angular/http";
import { Message } from "../../todo/message.model";
import { FirebaseListObservable } from "angularfire2/database-deprecated";
import { observeOn } from 'rxjs/operators';


@Injectable()
export class MessageService extends BaseService {
  listMessages: firebase.database.Reference;
  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }


  // create(message) {
  //   console.log("passou no criar mensagem");
  //   return this.listMessages.push(message)
  // }

}