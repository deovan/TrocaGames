import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { ChatModel } from "../../todo/chat.model";
import { Http } from "@angular/http";
import { AngularFireAuth } from 'angularfire2/auth';
import { importExpr } from '@angular/compiler/src/output/output_ast';

import firebase from 'firebase'


@Injectable()
export class ChatService extends BaseService {
  firechats = firebase.database().ref('/chats');
  chats: Observable<ChatModel[]>;

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public http: Http) {
    super();
    }


  create(chat: ChatModel, userId1: string, userId2: string): Promise<void> {
    return this.db.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }
}
