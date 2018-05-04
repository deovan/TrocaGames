import { ChatPage } from './../chat/chat';
import { JogoService } from './../../providers/jogo/jogo.service';
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
    private jogoService: JogoService,
    public chatService: ChatService,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('get chats to user');
    this.chats = this.chatService.getChatsUser();

    console.log(this.chats);

  }

  buddychat(jogo) {

    let jogoDados = this.jogoService.getJogo(jogo.key)
    console.log('jogoChat', jogoDados);
    this.chatService.initializebuddy(jogoDados,jogo.sender);
    this.navCtrl.push(ChatPage, {
      jogo: jogoDados,
      sender: jogo.sender
    });
  }

}
