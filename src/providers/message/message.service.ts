import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { AngularFireDatabase } from "angularfire2/database";
import { Http } from "@angular/http";


@Injectable()
export class MessageService extends BaseService {


  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }

}
