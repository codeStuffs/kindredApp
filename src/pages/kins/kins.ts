import { Component, OnInit } from "@angular/core";

import { AlertController, Loading, LoadingController, ModalController, NavController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { KinProfilePage } from "../kin-profile/kin-profile";

import { FamilyService } from "../../providers/family-service";
import { AuthService } from "../../providers/auth-service";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AngularFire } from "angularfire2";

@Component({
  selector   : 'page-kins',
  templateUrl: 'kins.html'
})
export class KinsPage implements OnInit {
  url : string[];
  name : string[];
  searchPattern : BehaviorSubject<any>;
  kins : Observable<any>;
  kinSubscription : Subscription;
  currentUser : any;
  loading : Loading;
  members : any;

  constructor (public navCtrl : NavController, public modalCtrl : ModalController,
               public authService : AuthService,
               private angFire : AngularFire,
               public loadingCtrl : LoadingController,
               public storage : Storage, public alertCtrl : AlertController,
               public familyService : FamilyService) {

    this.searchPattern = new BehaviorSubject(undefined);
    this.getUserDetails();
  }

  ngOnInit () {
    setTimeout(() => {
      this.newChatSearchBar();
    }, 2000)
  }

  newChatSearchBar () : void {

    if (typeof this.currentUser !== "undefined") {

      this.searchPattern.asObservable()
        .debounce(() => Observable.timer(1000))
        .forEach(() => {
          if (this.kinSubscription) {
            this.kinSubscription.unsubscribe();
          }
          this.kinSubscription = this.subscribeKins();
        })
    } else {
      this.getUserDetails();
    }
  }

  subscribeKins () : Subscription {

    if (this.currentUser) {
      let userFamilies = this.familyService.transformFamilyObject(this.currentUser.families);
      userFamilies.forEach(value => {
        this.members = this.angFire.database
          .list('/family-members/' + value.key);
      });
      /*
       * , {
       query: {
       orderByChild: 'firstname',
       equalTo     : this.searchPattern.getValue()
       }
       }*/
      console.log(this.searchPattern.getValue());
      return this.members.subscribe((result) => {
        this.kins = this.findKins(result);
      });
    } else {
      this.getUserDetails();
    }
  }


  private findKins (kins) {
    /*const tip = _.filter(kins, (obj) => {
     console.log(obj);
     return obj.firstname.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || obj.middleName.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || obj.lastName.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || (obj.firstname.toLowerCase() + " " + obj.middleName.toLowerCase()) == this.searchPattern.getValue().toLowerCase().trim()
     || (obj.firstname.toLowerCase() + " " + obj.middleName.toLowerCase() + " " + obj.lastName.toLowerCase()) == this.searchPattern.getValue().toLowerCase().trim();
     });*/
    let value = this.searchPattern.getValue();
    const tip = kins.filter((kin) => {

      if (typeof value !== "undefined") {
        if (typeof kin.firstname !== "undefined" && typeof kin.middleName !== "undefined" && typeof kin.lastName !== "undefined") {
          return kin.firstname.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || kin.middleName.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || kin.lastName.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || (kin.firstname.toLowerCase() + " " + kin.middleName.toLowerCase()).indexOf(value.toLowerCase().trim()) > -1
            || (kin.firstname.toLowerCase() + " " + kin.middleName.toLowerCase() + " " + kin.lastName.toLowerCase()).indexOf(value.toLowerCase().trim()) > -1;

        }
      }
    });
    if (typeof value == 'undefined' || value == "") return Observable.of(kins);
    return Observable.of(tip);
  }

  updateSubscription (value) {
    this.searchPattern.next(value);
  }

  getUserDetails () {
    this.authService.getUserInfo().then((snapshot) => {
      this.currentUser = snapshot;
      this.familyService.setMyFamilies(this.currentUser.families);
      setTimeout(() => {
        this.newChatSearchBar();
      }, 2000)
    }).catch((error) => {
      this.handleError(error);
    });
  };


  initializeKins () {
    //this.kins = this.familyService.getfamilyMembers();
    this.getFamilies().then((data) => {
      console.log(data);
      if (data == null) {
        this.getUserDetails();
      } else {
        this.kins = this.familyService.getMyFamilyMembers(data);
      }
    })
  }

  kinTapped (kin) {
    let kinProfile = this.modalCtrl.create(KinProfilePage, {kinData: kin});
    kinProfile.present();

  }

  getFamilies () : any {
    return this.storage.get('myFamilies').then((data) => {
      return data;
    })
  }

  private handleError (e) : void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e,
      buttons: ['OK']
    });

    alert.present();
  }

  showLoading () {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
}
