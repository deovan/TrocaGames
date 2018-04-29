import { Observable } from 'rxjs';
import { ChatPage } from './../chat/chat';

import { Jogo } from './../../todo/jogo.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-anuncio-detalhes',
  templateUrl: 'anuncio-detalhes.html',
})
export class AnuncioDetalhesPage {
  @ViewChild(Slides) slides: Slides;
  jogo: Jogo;
  fotos = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
     var receptor= navParams.get('todo');
  
    this.jogo = new Jogo(
      receptor.user,
      receptor.nome,
      receptor.console,
      receptor.categoria,
      receptor.descricao,
      receptor.preco,
      receptor.datetime,
      receptor.fotos
     );

     this.fotos = this.jogo.fotos;
  }

  presentContactModal() {
    this.navCtrl.push(ChatPage,{
      jogo: this.jogo
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
