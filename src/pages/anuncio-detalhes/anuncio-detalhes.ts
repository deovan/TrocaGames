import { auth } from 'firebase/app';
import { ChatService } from './../../providers/chat/chat.service';
import { Observable } from 'rxjs';
import { ChatPage } from './../chat/chat';
import firebase from 'firebase';

import { Jogo } from './../../todo/jogo.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { ChatModel } from '../../todo/chat.model';

@Component({
  selector: 'page-anuncio-detalhes',
  templateUrl: 'anuncio-detalhes.html',
})
export class AnuncioDetalhesPage {
  @ViewChild(Slides) slides: Slides;
  jogo: Jogo;
  fotos = [];
  currentUser = firebase.auth().currentUser.uid;

  constructor(
    public chatService: ChatService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController) {
    this.jogo = navParams.get('todo');
    this.fotos = this.jogo.fotos;
  }

  onChatCreate(): void {
    this.chatService.initializebuddy(this.jogo, this.jogo.user);
    this.navCtrl.push(ChatPage, {
      jogo: this.jogo,
      sender: this.jogo.user
    });

  }

  goToSlide() {
    this.slides.slideTo(2, 500);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }

}
