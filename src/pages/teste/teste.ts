
import { JogoService } from './../../providers/jogo.service';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { Jogo } from '../../todo/jogo.model';

@Component({
  selector: 'page-teste',
  templateUrl: 'teste.html',
})
export class TestePage {

  public todos: any[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public jogoService: JogoService
  ) {
    this.todos = jogoService.getAllOpened();
  }

}
