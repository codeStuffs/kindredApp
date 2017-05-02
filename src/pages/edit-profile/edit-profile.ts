import {Component, OnInit} from "@angular/core";
import {
  AlertController,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import {COUNTRIES} from "../../countries";
import {AuthService} from "../../providers/auth-service";

/*
 Generated class for the EditProfile page.
 
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage implements OnInit {
  details: any;
  gender: string;
  loading: Loading;
  countries: any;
  
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private modalCtrl: ModalController, private viewCtrl: ViewController,
              private authService: AuthService, public navParams: NavParams) {
    this.details = navParams.get('userData');
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }
  
  ngOnInit() {
    this.countries = COUNTRIES;
  }
  
  saveData() {
    this.showLoading('Updating...');
    
    this.authService.updateProfile(this.details).then(() => {
      this.showPopUp("Success", "Profile Updated");
    }, (_error) => {
      this.showPopUp('Error', _error);
    }).catch(error => {
      this.showPopUp("Error", error);
    })
    //this.loading.dismiss();
  }
  
  
  goBack() {
    this.navCtrl.pop();
  }
  
  dismiss() {
    this.viewCtrl.dismiss().then();
  }
  
  
  private showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });
    //noinspection JSIgnoredPromiseFromCall
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
