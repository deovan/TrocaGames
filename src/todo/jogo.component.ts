import { AuthProvider } from './../providers/auth/auth';
import { JogoService } from './jogo.service';
import { Jogo } from './jogo.model';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";



@Component({
  selector: 'todo-jogo',
  templateUrl: 'jogo.component.html'
})
export class JogoComponent implements OnInit {
  jogos: FirebaseListObservable<any>;
  jogo: Jogo;
  myDate: String = new Date().toISOString();
  constructor(private jogoService: JogoService, private authProvider: AuthProvider) {
    this.jogo = new Jogo();
  
  }

  ngOnInit() {
    // Ao iniciar o componente, busco todos os items já existentes no Firebase.
    this.jogos = this.jogoService.getAll();
  }

  saveJogo() {
    this.jogo.user == this.authProvider.getCurrentUser();
    this.jogo.datetime == this.myDate;
    // Se os campos do formulario foram preenchidos, adiciono a nova tarefa.
    if (this.jogo.nome && this.jogo.descricao && this.jogo.preco &&  this.jogo.user && this.jogo.datetime) {
      this.jogoService.save(this.jogo);
      this.jogo = new Jogo();
    }
  }

  editJogo(jogo: Jogo) {
    // Ao clicar 2x em um item da lista e vai para o formulário para ser editado.
    this.jogo = jogo;
  }

  remove(jogo: Jogo) {
    this.jogoService.remove(jogo);
  }

  toggleDone(jogo: Jogo) {
    this.jogoService.toggleDone(jogo);
  }

  filterJogos(filter: number) {
    // Filtrando os itens
    switch (filter) {
      case 1: // Todos
        this.jogos = this.jogoService.getAll();
        break;
      case 2: // Todas tarefas em aberto
        this.jogos = this.jogoService.getAllOpened();
        break;
      case 3: // Todas tarefas concluídas
        this.jogos = this.jogoService.getAllCompleted();
        break;
    }
  }
}