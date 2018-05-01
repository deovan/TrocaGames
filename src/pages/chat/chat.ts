
import { NavController, NavParams, Content } from 'ionic-angular';


import firebase from 'firebase';
import { Component, ViewChild } from '@angular/core';
import { Message } from '../../todo/message.model';
import { User } from '../../todo/user.model';
import { AuthService } from '../../providers/auth/auth';
import { UserService } from '../../providers/user/user.service';
import { MessageService } from '../../providers/message/message.service';
import { Observable } from 'rxjs/Observable';
import { ChatModel } from '../../todo/chat.model';
import { ChatService } from '../../providers/chat/chat.service';
import { Jogo } from '../../todo/jogo.model';
import {FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  foto: string;
  jogo: Jogo;
  messages:any;
  pageTitle: string;
  sender: string;
  recipient: string;
  private chat1: any;
  private chat2: any;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public messageService: MessageService,
    public chatService: ChatService
  ) {
    this.jogo =navParams.get('jogo');

  }
  ionViewDidLoad(){
      
  
    this.recipient = this.jogo.user;
    this.sender = firebase.auth().currentUser.uid;
  
    this.chat1 = this.chatService.getDeepChat(this.sender, this.recipient);
    this.chat2 = this.chatService.getDeepChat(this.recipient, this.sender);
  
  }


  sendMessage(newMessage: string): void {
    if(newMessage) {
      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
  
      this.messageService.create(
        new Message(
          this.sender,
          newMessage,
          currentTimestamp
      )).then(() => {
  
        this.chat1
          .set({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });
  
        this.chat2
          .set({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });
  
      });
    }
  }
  
  private scrollToBotton(duration?: number): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);


  }


}
