
import { NavController, NavParams, Content, Events, LoadingController } from 'ionic-angular';


import firebase from 'firebase';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Message } from '../../todo/message.model';
import { User } from '../../todo/user.model';
import { AuthService } from '../../providers/auth/auth';
import { UserService } from '../../providers/user/user.service';
import { MessageService } from '../../providers/message/message.service';
import { Observable } from 'rxjs/Observable';
import { ChatModel } from '../../todo/chat.model';
import { ChatService } from '../../providers/chat/chat.service';
import { Jogo } from '../../todo/jogo.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AnuncioDetalhesPage } from '../anuncio-detalhes/anuncio-detalhes';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content: Content;
  sendTo: any;
  newMessage;
  allmessages = [];
  photoURL;
  imgornot;
  public jogo: Jogo;
  pageTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public zone: NgZone,
    public loadingCtrl: LoadingController,
    public chatService: ChatService
  ) {
    this.jogo = navParams.get('jogo');
    this.sendTo = navParams.get('sender');
    this.scrollto();
    this.events.subscribe('newMessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatService.buddymessages;
        console.log(this.allmessages);
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
    });
}
  addmessage() {
    this.chatService.addnewmessage(this.newMessage, this.sendTo).then(() => {
      this.content.scrollToBottom();
      this.newMessage = '';
    })
  }

  isVazio(){
    if(this.newMessage){
      return false;
    }else{
      return true;
    }
  }
  ionViewDidEnter() {
    this.chatService.getbuddymessages(this.sendTo);
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  itemTapped(event, todo) {
    this.navCtrl.push(AnuncioDetalhesPage, {
      todo: todo
    });
  }
  // sendPicMsg() {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Please wait'
  //   });
  //   loader.present();
  //   this.imgstore.picmsgstore().then((imgurl) => {
  //     loader.dismiss();
  //     this.chatservice.addnewmessage(imgurl).then(() => {
  //       this.scrollto();
  //       this.newmessage = '';
  //     })
  //   }).catch((err) => {
  //     alert(err);
  //     loader.dismiss();
  //   })
  // }


}
