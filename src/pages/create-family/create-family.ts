import {Component, OnInit} from "@angular/core";
import {AlertController, Loading, LoadingController, NavController, NavParams} from "ionic-angular";
import {COUNTRIES} from "../../countries";
import {FamilyService} from "../../providers/family-service";

/*
 Generated class for the CreateFamily page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-create-family',
  templateUrl: 'create-family.html'
})
export class CreateFamilyPage implements OnInit {
  family = {name: '', description: '', location: ''};
  countries: any;
  loading: Loading;
  userData: any;
  constructor(public navCtrl: NavController,
              public familyService: FamilyService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

    this.userData = navParams.get('userData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateFamilyPage');
  }

  ngOnInit() {
    this.countries = COUNTRIES;

  }

  createFam() {

    let alert = this.alertCtrl.create({
      title: 'Create The ' + this.family.name + '\'s Family?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // user has clicked the action sheet button
            // begin the action sheet's dimiss transition
            let navTransition = alert.dismiss();
            this.showLoading("Creating Family..");
            // start some async method
            this.familyService.registerFamily(this.userData,this.family).then((data) => {
              /*this.familyService.joinFamily(data.key, this.family.name).then(() => {
              }, (err) => {
                console.log(err)
              });*/
              let innerAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: "Family Created",
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    //noinspection JSIgnoredPromiseFromCall
                    this.loading.dismiss();
                    this.family = {name: '', description: '', location: ''};
                    navTransition.then(() => {
                      //noinspection JSIgnoredPromiseFromCall
                      this.navCtrl.pop();
                    });
                  }
                }]
              });
              //noinspection JSIgnoredPromiseFromCall
              innerAlert.present(prompt);
            }, (error) => {
              this.showPopUp("Error", error);
            });
            return false;
          },
        }, {
          text: 'Cancel',
          handler: () => {

          }
        }
      ]
    });

    alert.present();
  }

  private showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });

    this.loading.present();
  }


  private showPopUp(title, message) {
    setTimeout(() => {
      //noinspection JSIgnoredPromiseFromCall
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    //noinspection JSIgnoredPromiseFromCall
    alert.present(prompt);
  }
}
