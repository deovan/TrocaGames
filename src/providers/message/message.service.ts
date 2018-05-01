import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Http } from "@angular/http";
import { Message } from "../../todo/message.model";
import { Observable } from "@firebase/util";
import { FirebaseListObservable } from "angularfire2/database-deprecated";


@Injectable()
export class MessageService extends BaseService {

  listMessages = [];
  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }


  create(message: Message){
    console.log("passou no criar mensagem");
    
    return new Promise<any>((resolve)=>{
      return this.listMessages.push(message);
    }) 
  }

}
