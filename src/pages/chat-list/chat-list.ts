import { ChatService } from './../../providers/chat/chat.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  chats = [];
  constructor(
    public chatService: ChatService,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('get chats to user');
    this.chats = this.chatService.getChatsUser();
  }

}
