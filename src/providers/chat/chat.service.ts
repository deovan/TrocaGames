import { Observable } from 'rxjs/Observable';
import { Message } from './../../todo/message.model';


import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { ChatModel } from "../../todo/chat.model";
import { Http } from "@angular/http";
import { AngularFireAuth } from 'angularfire2/auth';
import { importExpr } from '@angular/compiler/src/output/output_ast';

import firebase from 'firebase'
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Events, NavController } from 'ionic-angular';


@Injectable()
export class ChatService extends BaseService {

  firechats = firebase.database().ref('/chats');
  firemessagens: any;
  jogo: any;
  sendTo: any;
  buddymessages = [];
  chats = [];
  currentUser = firebase.auth().currentUser.uid;

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public events: Events,
    public http: Http) {
    super();
  }

  initializebuddy(jogo, jogoSender: String) {
    this.jogo = jogo;
    this.sendTo = jogoSender;
  }



  getChatsUser(): Observable<any> {
    let userId = firebase.auth().currentUser.uid;

    return new Observable<any>((observable) => {
      this.firechats.child(userId).on('value', dataSnapshot => {
        var temp = [];
        dataSnapshot.forEach((value) => {
          value.forEach((elemet) => {
            let item = elemet.val();
            item.sender = value.key;
            item.key = elemet.key;
            temp.push(item);
            console.log('item', item);
            return false;
          });
          return false;
        });
        console.log('chats service', temp);
        observable.next(temp);
      });
    });
  }

  addnewmessage(msg, sendUser?: string) {
    if (this.jogo) {
      if (this.jogo.user === this.currentUser) {
        var promise = new Promise((resolve, reject) => {
          this.firemessagens.push({
            sentby: this.currentUser,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.firechats.child(this.currentUser).child(sendUser).child(this.jogo.key).update({
              title: this.jogo.nome,
              foto: ('' + this.jogo.fotos[0]),
              sentby: this.currentUser,
              message: msg,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
              this.firechats.child(sendUser).child(this.currentUser).child(this.jogo.key).update({
                title: this.jogo.nome,
                foto: ('' + this.jogo.fotos[0]),
                sentby: this.currentUser,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
            })
              .then(() => {
                resolve(true);
              })
          })
        })
        return promise;
      } else {
        var promise1 = new Promise((resolve, reject) => {
          this.firemessagens.push({
            sentby: this.currentUser,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.firechats.child(this.currentUser).child(this.jogo.user).child(this.jogo.key).update({
              title: this.jogo.nome,
              foto: ('' + this.jogo.fotos[0]),
              sentby: this.currentUser,
              message: msg,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
              this.firechats.child(this.jogo.user).child(this.currentUser).child(this.jogo.key).update({
                title: this.jogo.nome,
                foto: ('' + this.jogo.fotos[0]),
                sentby: this.currentUser,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
            })
          }).then(() => {
            resolve(true);
          })
        })
        return promise1;
      }
    }
  }

  deleteChatUser(sender: any, key: string): any {
    this.firechats.child(this.currentUser).child(sender).child(key).remove()
  }

  getbuddymessages(userId1: string, userId2: string) {

    return new Observable<Message[]>((observer) => {


      if (userId1 === this.jogo.user) {
        this.firemessagens = firebase.database().ref(`/mensagens/${userId2}-${userId1}${this.jogo.key}`)
      } else {
        this.firemessagens = firebase.database().ref(`/mensagens/${userId1}-${userId2}${this.jogo.key}`)
      }

      let temp;
      this.firemessagens.on('value', (snapshot) => {
        this.buddymessages = [];
        temp = snapshot.val();
        for (var tempkey in temp) {
          this.buddymessages.push(temp[tempkey]);
        }
        // this.events.publish('newMessage');
        observer.next(this.buddymessages);
      });


    });
  }
}