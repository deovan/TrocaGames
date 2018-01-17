

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Jogo } from '../../todo/jogo.model';


@Component({
  selector: 'page-inserir-jogo',
  templateUrl: 'inserir-jogo.html',
})
export class InserirJogoPage {
  jogos: Jogo;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  cadastrar(){

  }

}
