import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { ChatModel } from "../../todo/chat.model";
import { Http } from "@angular/http";
import { AngularFireAuth } from 'angularfire2/auth';
import { importExpr } from '@angular/compiler/src/output/output_ast';

import firebase from 'firebase'
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';


@Injectable()
export class ChatService extends BaseService {
  firechats = firebase.database().ref('/chats');
  chats = [];

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public http: Http) {
    super();
  }

  getChatsUser(userId?: string) {

    console.log('key user',firebase.auth().currentUser.uid);
    
    if (userId) {
      this.firechats.orderByKey().equalTo(userId).on('value', dataSnapshot => {
        dataSnapshot.forEach((value) => {
          this.chats.push(value.val());
          return false;
        });

      });
    } else {
      this.firechats.orderByKey().equalTo(firebase.auth().currentUser.uid).on('value', dataSnapshot => {
        dataSnapshot.forEach((value) => {
          this.chats.push(value.val());
          return false;
        })
      })
    }

    return this.chats;

  }


  create(chat: ChatModel, userId1: string, userId2: string): Promise<void> {
    return this.db.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string){
    return new Observable((observable)=>{
      observable.next(this.db.object(`/chats/${userId1}/${userId2}`))
    }) 
  }
}
