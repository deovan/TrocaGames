import { ChatPage } from './../chat/chat';
import { JogoService } from './../../providers/jogo/jogo.service';
import { ChatService } from './../../providers/chat/chat.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';



@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  chats = [];
  order: string = 'timestamp';
  reverse: boolean = true;
  constructor(
    public alertCtrl: AlertController,
    private jogoService: JogoService,
    public chatService: ChatService,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.chats = [];
    this.chatService.getChatsUser().subscribe((chats) => {
      this.chats = chats;
    });
  }

  buddychat(chat) {
    console.log('aqeui');
    this.jogoService.getJogo(chat.key).then((jogoP) => {
      let jogoDados = jogoP;
      if (jogoP === false) {
        this.presentConfirm("O anúncio foi removido. Deseja excluir a conversa?", chat)
      } else {
        console.log('jogo', jogoP);
        this.chatService.initializebuddy(jogoDados, chat.sender);
        this.navCtrl.push(ChatPage, {
          jogo: jogoDados,
          sender: chat.sender
        });
      }
    }).catch((error) => {

    })
  }

  deleteChat(chat: any) {
    console.log('chat a deletar', chat);
    this.chatService.deleteChatUser(chat.sender,chat.key);
  }


  presentConfirm(msg: String, chat: any) {
    let alert = this.alertCtrl.create({
      title: 'Anúncio Removido',
      cssClass: 'color:red',
      message: '' + msg,
      buttons: [
        {
          text: 'Não',
          role: 'nao',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.deleteChat(chat)
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

}
