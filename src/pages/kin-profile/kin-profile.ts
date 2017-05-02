import { Component } from "@angular/core";
import { Loading, LoadingController, NavController, NavParams, ViewController } from "ionic-angular";

import { Storage } from "@ionic/storage";
import { AngularFire } from "angularfire2";
/*
 Generated class for the KinProfile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector   : 'page-kin-profile',
  templateUrl: 'kin-profile.html'
})
export class KinProfilePage {
  kinData : any;
  userDetails : any;
  loading : Loading;
  shouldHideGallery : boolean  = true;
  shouldHideInfo : boolean     = false;
  shouldHideSiblings : boolean = true;
  activateGallery : boolean    = false;
  activateInfo : boolean       = true;
  activateSiblings : boolean   = false;
  currentUser : any;
  email : string;

  local : Storage = new Storage();

  constructor (public navCtrl : NavController, public navParams : NavParams, public viewCtrl : ViewController,
               private angFire : AngularFire,
               public loadingCtrl : LoadingController, public storage : Storage) {
    this.kinData = navParams.get('kinData');
    setTimeout(() => {
      this.getFullInfo();
    }, 1000);

    this.shouldHideGallery  = true;
    this.shouldHideInfo     = false;
    this.shouldHideSiblings = true;
    this.activateGallery    = false;
    this.activateSiblings   = false;
    this.activateInfo       = true;
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad KinProfilePage');
  }

  ActivateSection (event, status) {
    event.preventDefault();
    switch (status) {
      case 'info':
        this.shouldHideGallery  = true;
        this.shouldHideInfo     = false;
        this.shouldHideSiblings = true;

        this.activateGallery  = false;
        this.activateSiblings = false;
        this.activateInfo     = true;
        console.log(this.shouldHideInfo);
        break;
      case 'gallery':

        this.shouldHideGallery  = false;
        this.shouldHideInfo     = true;
        this.shouldHideSiblings = true;

        this.activateGallery  = true;
        this.activateSiblings = false;
        this.activateInfo     = false;
        console.log(this.shouldHideGallery);
        break;
      case 'siblings':
        this.shouldHideGallery  = true;
        this.shouldHideInfo     = true;
        this.shouldHideSiblings = false;
        this.activateSiblings   = true;
        this.activateGallery    = false;

        this.activateInfo = false;
        break;
    }

  }

  getFullInfo () : void {

    this.angFire.database.object('users/' + this.kinData.$key, {preserveSnapshot: true})
      .subscribe((snapshot) => {
        this.userDetails = snapshot.val();
      });
  }

  showLoading (content) {
    this.loading = this.loadingCtrl.create({
      spinner : 'hide',
      content : `
      <div class="preloader8">
          <span></span>
          <span></span>
      </div>`,
      duration: 100000
    });
    this.loading.present();
  }

  goBack () {
    this.navCtrl.pop();
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

  closeFab (event) {
    console.log("fab-close-active");
  }
}
