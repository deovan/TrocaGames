import { LoginPage } from './../login/login';
import { AuthProvider } from './../../providers/auth/auth';
import { JogoService } from './../../providers/jogo.service';
import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';
import { initializeApp } from 'firebase/app';
import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  templateUrl: 'home.html'
})

export class HomePage {
  public todos: any[] = [];
  constructor(
    private _navController: NavController,
    private _jogoService: JogoService,
    public authProvider: AuthProvider
  ) {
    this.initializeItems();
  }


  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this._navController.setRoot(LoginPage);
  }


  initializeItems() {
    let that = this;
    this._jogoService.todos.subscribe((data) => {
      that.todos.push(data);
    },
      (err) => {
        console.error(err);
      });
  };

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.todos = this.todos.filter((todo) => {
        return (todo.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  
  itemTapped(event, todos) {
    this._navController.push(ItemDetailsPage, {
      item: todos
    });
  }


}