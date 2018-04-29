
import { AdicionarFotosPage } from './../adicionar-fotos/adicionar-fotos';
import { AuthService } from './../../providers/auth/auth';
import { auth } from 'firebase/app';
import { JogoService } from './../../providers/jogo/jogo.service';

import { TelefoneValidator } from './../../validators/telefone.validator';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, Loading, LoadingController, AlertController, Alert } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Jogo } from '../../todo/jogo.model';
import { EmailValidator } from '../../validators/email';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';



@Component({
  selector: 'page-inserir-anuncio',
  templateUrl: 'inserir-anuncio.html',
})
export class InserirAnuncioPage {
  private console: string;
  private categoria: string;
  private preco: string;
  public newAnuncio: any;
  public jogo: Jogo;
  myDate: string = new Date().toISOString();


  constructor(public navCtrl: NavController,
    public authService: AuthService,
    public navParams: NavParams,
    public jogoService: JogoService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
  ) {
    this.newAnuncio = formBuilder.group({
      'nome': [
        '',
        Validators.compose([Validators.required])
      ],
      'descricao': [
        '',
        Validators.compose([Validators.required])
      ],
      'categoria': [
        '',
        Validators.compose([Validators.required])
      ],
      'console': [
        '',
        Validators.compose([Validators.required])
      ],
      'preco': [
        '',
        Validators.compose([Validators.required])
      ]

    });
  }


  async save() {
    if (!this.newAnuncio.valid) {
      console.log(`Form is not valid yet, current value: ${this.newAnuncio.value}`);
    } else {
      const loading: Loading = this.loadingCtrl.create();
      loading.present();
      this.jogo = new Jogo(
        firebase.auth().currentUser.uid,
        this.newAnuncio.value.nome,
        this.newAnuncio.value.console,
        this.newAnuncio.value.categoria,
        this.newAnuncio.value.descricao,
        this.newAnuncio.value.preco,
        this.myDate);
      loading.dismiss();
      this.navCtrl.push(AdicionarFotosPage, {
        jogo: this.jogo
      });

    }
  }
}