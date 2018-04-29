import { AngularFireList } from 'angularfire2/database';
//import { InfiniteScroll } from 'ionic-angular';


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


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  // @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  // items: number[] = [];

  @ViewChild(Content) content: Content;

  jogo: Jogo;
  messages: AngularFireList<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: Observable<ChatModel[]>;
  private chat2: Observable<ChatModel[]>;

  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public messageService: MessageService,
    public chatService: ChatService
  ) {
    this.jogo = navParams.get('jogo')
    console.log(this.jogo.descricao,this.jogo.nome)
  }

  // ionViewCanEnter(): Promise<boolean> {
  //   // return this.authService.authenticated;
  // }


}
