import { AngularFire,AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from "angularfire2/database-deprecated";

import { Injectable } from '@angular/core';
import { Jogo } from './jogo.model';

@Injectable()
export class TaskService {
  angularfire: AngularFire;
  items: FirebaseListObservable<any>;

  constructor(af: AngularFire) {
    this.angularfire = af;
  }

  getAll() {
    // Buscando todos os itens no no "/task"
    this.items = this.angularfire.list('/jogos').valueChanges;
    return this.items;
  }

  getAllCompleted() {
    // Buscando todos os itens que estão completos
    this.items = this.angularfire.list('/jogos').query.orderByChild('done').equalTo(true);
    return this.items;
  }

  getAllOpened() {
    // Buscando todos os itens que estão em aberto
    this.items = this.angularfire.list('/jogos').query.orderByChild('done').equalTo(false);

    return this.items;
  }

  add(jogo: Jogo) {
    // Adicionando uma nova tarefa.
    // Toda nova tarefa é gravada como em aberto por padrão.
    jogo.done = false;

    // Adicionando o item na lista de itens. 
    // Como essa lista é carregada antes, automaticamente o angularfire2
    // identifica a mudança na lista e inclui o item novo.
    this.items.push(jogo);
  }

  update(jogo: Jogo) {
    // Atualizando o item na lista.
    // Para isso passamos por parametro qual é o id do item no Firebase
    // e quais são os novos valores.
    this.items.update(jogo.$key, jogo);
  }

  save(jogo: Jogo) {
    // Metodo criado para facilitar a inclusão/alteração e um item.
    // Verifico se o item tem o Id para saber se é uma inclusão ou alteração.
    if (jogo.$key == null) {
      this.add(jogo);
    } else {
      this.update(jogo);
    }
  }

  remove(jogo: Jogo) {
    // Removendo um item da lista
    this.items.remove(jogo.$key);
  }

  toggleDone(jogo: Jogo) {
    // Marcando uma tarefa como concluída ou em aberto.
    jogo.done = !jogo.done;
    this.update(jogo);
  }
}