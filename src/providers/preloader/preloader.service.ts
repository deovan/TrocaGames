import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { LoadingController } from "ionic-angular";


/*
  Generated class for the PreloaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PreloaderService {

  private loading: any;

  constructor(public http: Http,
    public loadingCtrl: LoadingController) {
  }



  displayPreloader(): void {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots'
    });

    this.loading.present();
  }



  hidePreloader(): void {
    this.loading.dismiss();
  }

}
