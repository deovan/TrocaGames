import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-inserir-jogo',
  templateUrl: 'inserir-jogo.html',
})
export class InserirJogoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InserirJogoPage');
  }

}
