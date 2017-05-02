import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  App,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  ViewController
} from "ionic-angular";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
import { LoginPage } from "../login/login";
import { EditProfilePage } from "../edit-profile/edit-profile";

import { JoinFamilyPage } from "../join-family/join-family";
import { InviteKinPage } from "../invite-kin/invite-kin";
import { AuthService } from "../../providers/auth-service";

import { FamilyService } from "../../providers/family-service";
import firebase from "firebase";
/*
 Generated class for the Account page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  template: `
    <ion-list>
      <button ion-item class="text-charter">
        <ion-icon class="popIcon" item-left color="limegreen" name="image"></ion-icon>
        <ion-label>Upload Photo</ion-label>
      </button>
      <button ion-item class="text-charter">
        <ion-icon class="popIcon" item-left color="limegreen" name="camera"></ion-icon>
        <ion-label>Take Photo</ion-label>
      </button>
      <button ion-item class="text-charter">
        <ion-icon class="popIcon" item-left color="limegreen" name="qr-scanner"></ion-icon>
        <ion-label>View Profile Photo</ion-label>
      </button>
      <button ion-item class="text-charter" (click)="disMissPop()">
        <ion-icon class="popIcon" item-left color="danger" name="close-circle"></ion-icon>
        <ion-label color="danger">Close</ion-label>
      </button>
    </ion-list>

  `
})
export class ProfileMorePopOver {
  constructor (private navParams : NavParams,
               private navCtrl : NavController, private viewCtrl : ViewController,
               private popCtrl : PopoverController) {

  }


  private disMissPop () {
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector   : 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage implements OnInit {
  loading : Loading;
  shouldHideMyGallery : boolean  = true;
  shouldHideMyInfo : boolean     = false;
  shouldHideMySiblings : boolean = true;
  activateMyGallery : boolean    = false;
  activateMyInfo : boolean       = true;
  activateMySiblings : boolean   = false;
  rootPage : any;
  first_name : string;
  email : string;
  infoObserver : any;
  familyId : any;
  myFamilies : any;
  myFamilyrequest : any;
  userId : any;
  request : any;
  private grid : Array<Array<string>>;
  private gallery : Array<string>;

  constructor (private app : App, private navCtrl : NavController,
               public authService : AuthService, public familyService : FamilyService,
               public loadingCtrl : LoadingController, private popoverCtrl : PopoverController,
               public alertCtrl : AlertController,
               private modalCtrl : ModalController,
               public storage : Storage) {
    this.showLoading("Loading Info..");

    //this.currentUser = auth.getSavedUser();

    this.shouldHideMyGallery  = true;
    this.shouldHideMyInfo     = false;
    this.shouldHideMySiblings = true;
    this.gallery              = [
      'https://unsplash.it/200/250?image=99',
      'https://unsplash.it/200/250?image=89',
      'https://unsplash.it/200/250?image=98',
      'https://unsplash.it/200/250?image=88'
    ];
    this.grid                 = Array(Math.ceil(this.gallery.length / 2));
    this.loading.dismiss();
  }

  ngOnInit () {
    this.getUserDetails();
  }

  /*TODO: Write a  method to get the data from storage, reason being that we want
   * to avoid fetching data from the server every single time*/
  public currentUser : any;

  ionViewWillEnter () {
    this.activateMyGallery  = false;
    this.activateMySiblings = false;
    this.activateMyInfo     = true;

    this.shouldHideMyGallery  = true;
    this.shouldHideMySiblings = true;
    this.shouldHideMyInfo     = false;
  }

  ngAfterViewInit () {
    this.getUserId();
    // this.getUserDetails();
    // this.storage.get('currentUser').then(val => this.currentUser = val);
  }

  ionViewDidLoad () {
    console.log('Hello AccountPage Page Here');
    console.log(this.gallery);
    let rowNum = 0;
    for (let i = 0; i < this.gallery.length; i++) {
      this.grid[rowNum] = Array(2);
      if (this.gallery[i]){
        this.grid[rowNum][0] = this.gallery[i];
      }

      if(this.gallery[i+1]){
        this.grid[rowNum][1] = this.gallery[i+1]
      }
      rowNum++;
    }
  }

  ionViewLoaded () {

  }

  editUser () : void {
    let editProfileModal = this.modalCtrl.create(EditProfilePage, {userData: this.currentUser});
    editProfileModal.present().then(() => {
    });
  };


  getUserDetails () {
    this.authService.getUserInfo().then((snapshot) => {
      this.currentUser = snapshot;
      let myFamilies   = [];
      for (var i in this.currentUser.families) {
        // code...
        myFamilies.push({
          id  : i,
          name: this.currentUser.families[i]
        })
      }
      this.myFamilies = myFamilies;

      this.loadMyRequest();

    }).catch((error) => {
      this.handleError(error);
    });
  };

  getUserFamilyMembers (familyid) {
    let myFam = this.familyService.getMyFamilyMembers(familyid);
  }

  joinFamily () {
    this.navCtrl.push(JoinFamilyPage, {userData: this.currentUser})
  }

  inviteKins () {
    this.navCtrl.push(InviteKinPage);
  }

  loadMyRequest () {

    /*let myRequest = this.familyService.getMyAcceptedRequests(this.currentUser['sent-requests']);
     if (typeof myRequest !== "undefined") {
     let request = [];
     this.myFamilyrequest = myRequest.value;
     // console.warn(this.myFamilyrequest);
     for (let i in this.myFamilyrequest) {
     // console.log(this.myFamilyrequest[i]['request-accepted']);
     request.push(this.myFamilyrequest[i]['request-accepted']);
     }
     this.request = request;
     }*/
  }

  logOut () {
    this.showLoading('Logging out..');
    setTimeout(() => {
      this.authService.logOutUser().then(() => {
        // this.infoObserver.unsubscribe();
        this.app.getRootNav().setRoot(LoginPage).then(() => { });
      }, (error) => {
        this.handleError(error);
      });
      this.loading.dismiss().then(() => {
      });
    }, 3000);
  };

  ActivateSection (event, status) {
    event.preventDefault();
    switch (status) {
      case 'info':
        this.shouldHideMyGallery  = true;
        this.shouldHideMyInfo     = false;
        this.shouldHideMySiblings = true;

        this.activateMyGallery  = false;
        this.activateMySiblings = false;
        this.activateMyInfo     = true;
        console.log(this.shouldHideMyInfo);
        break;
      case 'gallery':
        this.shouldHideMyGallery  = false;
        this.shouldHideMyInfo     = true;
        this.shouldHideMySiblings = true;

        this.activateMyGallery  = true;
        this.activateMySiblings = false;
        this.activateMyInfo     = false;
        console.log(this.shouldHideMyGallery);
        break;
      case 'siblings':
        this.shouldHideMyGallery  = true;
        this.shouldHideMyInfo     = true;
        this.shouldHideMySiblings = false;

        this.activateMySiblings = true;
        this.activateMyGallery  = false;
        this.activateMyInfo     = false;
        break;
    }

  };

  getUserId () {
    this.userId = firebase.auth().currentUser.uid;
  }

  confirmRequest (request) {
    console.log(request.key);
    //set accept request
    this.familyService.setMyfamiily(request.key, this.currentUser);
  }

  private showLoading (content) {
    this.loading = this.loadingCtrl.create({
      content : content,
      duration: 100000
    });
    this.loading.present().then(() => {
    });
  };

  private handleError (e : Error) : void {
    console.error(e);
    setTimeout(() => {
      this.loading.dismiss().then(() => {
      });
    });

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present().then(() => {
    });
  }

  presentPopover (ev) {

    let popover = this.popoverCtrl.create(ProfileMorePopOver, {});

    popover.present({
      ev: ev
    });
  }
}
