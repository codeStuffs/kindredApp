import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  ActionSheetController,
  AlertController,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  Platform
} from "ionic-angular";

import { AuthService } from "../../providers/auth-service";

import "rxjs/add/operator/debounceTime";

import { ManageFamilyPage } from "../manage-family/manage-family";

import { FamilyService } from "../../providers/family-service";
import { CreateFamilyPage } from "../create-family/create-family";
import firebase from "firebase";
@Component({
  selector   : 'page-join-family',
  templateUrl: 'join-family.html',
  /*pipes: [KeysPipe]*/

})
export class JoinFamilyPage implements OnInit {
  loading : Loading;
  searchFam : string = '';
  searchControl : FormControl;
  families : any; // families?
  items : any; // items for ?
  searching : any    = false; // searching variable
  countryList : any; // load country
  loadedFamilyList : any; //load all family list
  userId : any; // store user id
  userData : any; //store user  data
  loadedRequest : any;


  constructor (public platform : Platform,
               public navCtrl : NavController,
               public navParams : NavParams,
               public familyService : FamilyService,
               public alertCtrl : AlertController,
               public loadingCtrl : LoadingController,
               public authService : AuthService,
               public actionSheetCtrl : ActionSheetController) {
    this.searchControl = new FormControl();

    this.userData = navParams.get('userData');

  }

  ngOnInit () {
    setTimeout(() => {
      let loadedFamilyList = this.familyService.load();
      this.loadedRequest   = this.familyService.loadFamilyRequest();
      if (typeof loadedFamilyList !== "undefined") {

        this.loadedFamilyList = loadedFamilyList.value;

        this.families = this.loadedFamilyList;

      }
    }, 2000)

  }

  ngAfterViewInit () {
    this.getUserId();
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad JoinFamilyPage');
    this.authService.getUserId();
    //this.getFamilies();
    //this.setFilteredFamily();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredFamily();
    });
  };

  checkMember (isMember) : any {
    //let isMember = this.familyService.transformFamilyObject(member);
    for (let key in isMember) {

      if (key == this.userId)
        return true;
    }
    return false;
  }

  ifAccepted (accepted) : any {
    //let isAccepted = this.familyService.transformFamilyObject(accepted);
    for (let key in accepted) {
      if (accepted[key] == false && key == this.userId) return false;
    }
    return true;
  }

  manageFamily (family) {

    this.navCtrl.push(ManageFamilyPage, {familyData: family});
  }

  /*getRequest(){
   this.familyService.getMyRequest();
   }*/
  onSearchInput () {
    this.searching = true;
  }

  setFilteredFamily () {
    let families = this.familyService.searchFamilies(this.searchFam);
    if (typeof families.value !== "undefined") {
      this.families = families.value;
    }
    else if (typeof families !== undefined) {
      this.families = families;
    }
  }

  sendRequest (family) {
    let actionSheet = this.actionSheetCtrl.create({
      title   : 'Send Request?',
      cssClass: 'action-sheets-basic-page',
      buttons : [
        {
          text   : 'Ok',
          icon   : !this.platform.is('ios') ? 'checkmark-cirlce' : null,
          handler: () => {
            // user has clicked the action sheet button
            // begin the action sheet's dimiss transition
            let navTransition = actionSheet.dismiss();
            this.showLoading("Sending Request..");
            this.familyService.familyRequest(family.id, this.userData).then(() => {
              let innerAlert = this.alertCtrl.create({
                title   : 'Success',
                subTitle: "Request Sent",
                buttons : [
                  {
                    text   : 'OK',
                    handler: () => {
                      navTransition.then(() => {
                        //noinspection JSIgnoredPromiseFromCall
                        this.navCtrl.pop();
                      });
                    }
                  }
                ]
              });
              //noinspection JSIgnoredPromiseFromCall
              innerAlert.present(prompt);

            }, (err) => {
              this.showPopup("Error", err);
            });
            return false;
          },

        }, {
          text   : 'Cancel',
          role   : 'cancel',
          icon   : !this.platform.is('ios') ? 'close' : null,
          handler: () => {

          }
        }
      ]
    });
    //noinspection JSIgnoredPromiseFromCall
    actionSheet.present();
  }


  showPopup (title, text) {
    let alert = this.alertCtrl.create({
      title  : 'Error',
      message: text,
      buttons: [
        {
          text   : 'Ok',
          role   : 'cancel',
          handler: () => {
            this.loading.dismiss();
          }
        }
      ]
    });
    alert.present();
  };

  createFamily () {
    this.navCtrl.push(CreateFamilyPage, {userdata: this.userData});
  }

  private showLoading (message) {
    this.loading = this.loadingCtrl.create({
      content            : message,
      dismissOnPageChange: true
    });

    this.loading.present();
  }

  getUserId () {
    this.userId = firebase.auth().currentUser.uid;
    /*let callCount = 0;
     this.authService.getUserId().then((userId) => {
     this.userId = userId;

     //temp hack for back door
     if (this.userId === null) {
     callCount += 1;
     this.authService.setUserId();
     this.getUserId();
     }
     });*/
  }

  getFamilies () {
    /*	this.familyService.getFamilies().then((data)=>{
     this.families = data;
     console.log(this.families);
     })*/
  };
}
