
import { AngularFireDatabase } from 'angularfire2/database';
import { MeusAnunciosPage } from './../meus-anuncios/meus-anuncios';
import firebase from 'firebase/app';

import { NavController, NavParams, Content, Events, LoadingController } from 'ionic-angular';
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
  message:Observable<Message[]>
  allmessages = [];
  photoURL;
  imgornot;
  public jogo: Jogo;
  pageTitle: string;
  currentUser = firebase.auth().currentUser.uid;

  constructor(
    public db: AngularFireDatabase,
    public messageService: MessageService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public zone: NgZone,
    public loadingCtrl: LoadingController,
    public chatService: ChatService
  ) {

    this.jogo = navParams.get('jogo');
    this.sendTo = navParams.get('sender');
  
   


   
    // this.events.subscribe('newMessage', () => {
    //   this.allmessages = [];
    //   this.imgornot = [];
    //   this.zone.run(() => {
    //     this.allmessages = this.chatService.buddymessages;
    //     for (var key in this.allmessages) {
    //       if (this.allmessages[key].message.substring(0, 4) == 'http')
    //         this.imgornot.push(true);
    //       else
    //         this.imgornot.push(false);
    //     }
    //   });
    // });
  }

  // ionViewWillEnter(){
  //  this.message
  // }

  ionViewDidLoad() {
    this.scrollTo();
    this.message = this.chatService.getbuddymessages(this.sendTo, this.currentUser);
    this.message.subscribe((value)=>{
      console.log('valor',value);
      this.allmessages = value;
      // this.content.scrollToBottom();
    });
   
  }


  addmessage() {
    this.chatService.addnewmessage(this.newMessage, this.sendTo).then(() => {
      this.content.scrollToBottom();
      this.newMessage = '';
    })
  }


  isVazio() {
    if (this.newMessage) {
      return false;
    } else {
      return true;
    }
  }


  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  itemTapped(event, todo) {
    if (todo.user != this.currentUser) {
      this.navCtrl.push(AnuncioDetalhesPage, {
        todo: todo
      });
    } else {
      this.navCtrl.push(MeusAnunciosPage);
    }

  };
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


