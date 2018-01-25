import { Jogo } from './../todo/jogo.model';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import firebase from 'firebase';

@Injectable()
export class JogoService {
  private _todos$: any;
  private _db: any;
  private _todosRef: any;

  constructor() {
    this._db = firebase.database().ref('/');
    this._todosRef = firebase.database().ref('jogos');
    this._todosRef.on('child_added', this.handleData, this);
    this._todos$ = new ReplaySubject();
  }
  get todos() {
    return this._todos$;
  }

  save(jogo: Jogo) {

    return this._todosRef.push(jogo).key;
  }

  handleData(snap) {
    //Do something with the data 
    try {
      this._todos$.next(snap.val());
    } catch (error) {
      console.log('catching', error);
    }
  }


  getAll() {
    // Buscando todos os itens no no "/task"
    return this._todosRef.list().valueChanges();

  }

  getAllCompleted() {
    return this._todosRef.list('/jogos').query.orderByChild('done').equalTo(true);

  }

  getAllOpened() {
    // Buscando todos os itens que estão em aberto
    return this._todosRef.list().query.orderByChild('done').equalTo(false);

  }

  writeUserData(jogo: Jogo) {
    var ref = this._db.database.ref("trocagames-12485/");
    var postsRef = ref.child("/jogos");
    var newPostRef = postsRef.push();
    newPostRef.set({
      datetime: jogo.datetime,
      descricao: jogo.descricao,
      done: false,
      nome: jogo.nome,
      preco: jogo.preco,
      user: jogo.user
    });
  }


}