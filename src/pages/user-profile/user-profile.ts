import  cep  from 'cep-promise';
import { MeusAnunciosPage } from './../meus-anuncios/meus-anuncios';
import { Input } from '@angular/core';
import { User } from './../../todo/user.model';
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import firebase from 'firebase';
import { AuthService } from '../../providers/auth/auth';


@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;
  private filePhoto: File;


  constructor
    (public authService: AuthService,
    public navCtrl: NavController,
    public cd: ChangeDetectorRef,
    public navParams: NavParams,
    public userService: UserService,
    public zone: NgZone) {
  }

  public buscarCep(event) {
    console.log(event.value)
    cep(event.value).then((endereco) => {
      console.log(endereco);
      this.currentUser.cidade = endereco.city
    }).catch((error)=>console.log(error))
   
  }
  loaduserdetails() {
    this.userService.getuserdetails(firebase.auth().currentUser.uid).subscribe((res: User) => {
      this.currentUser = res;
    })
  }

  ionViewDidLoad() {
    this.loaduserdetails();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.filePhoto) {

      let uploadTask = this.userService.uploadPhoto(this.filePhoto);

      uploadTask.on('state_changed', (snapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        this.uploadProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        console.log("Carregando imagens")
      }, (error: Error) => {
        console.log('erro ', error)
      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });
    } else {
      this.editUser();
    }
  }

  onMeusAnuncios(){
    this.navCtrl.push(MeusAnunciosPage);
  }

  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userService
      .edit(this.currentUser).then(() => {
        this.canEdit = false;
        this.filePhoto = undefined;
        this.uploadProgress = 0;
      });
  }

}
