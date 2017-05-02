import { Component } from "@angular/core";
import { AlertController, Loading, LoadingController, NavController, NavParams } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
import { TabsPage } from "../tabs/tabs";
/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  loading: Loading;
  createSuccess = false;
  avartar: string[];
  registerCredentials = { name: '', middleName: '', email: '', surname: '', password: '', confirmPassword: '', dob: '', gender: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authService: AuthService, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
  }

  signUp() {
    this.showLoading('Proccess...');

    setTimeout(()=>{
    this.authService.registerUser(this.registerCredentials)
      .then((user) => {

        setTimeout(() => {
          this.loading.dismiss();
          this.showLoading("Creating Your Accounting");
          this.createUserInfo(this.registerCredentials, user);
        }, 2200);

        setTimeout(() => {

        this.loading.dismiss();
          this.showLoading('Sending email Verification');
          this.sendVerificationEmail(this.registerCredentials);
        }, 2300);

        this.loading.dismiss();

        setTimeout(() => {

        this.loading.dismiss();
          this.showLoading("Logging you in...");
          this.navCtrl.setRoot(TabsPage);

        this.loading.dismiss();
        }, 2400);

      }).catch((Error) => {
        this.loading.dismiss();
        this.showError(Error);
      });
},2100);
    this.loading.dismiss();
  };

  private createUserInfo(credentials,user){
    this.authService.createUserProfile(credentials,user)
    .then(()=>{
    }).catch((error)=>{
      console.log(error);
      this.showError(error);
    })
  }
 private sendVerificationEmail(data) {
    this.authService.emailVerification(data.name, data.surname)
      .then(() => { console.log('emailsent') },function(error) {
  // An error happened.
  console.log(error);
}).catch((error) => { console.log(error) });
  };

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  };

  showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message,
      duration: 100000,
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: [{
        text: 'Ok',
        handler: data =>{
          return ;
        }
      }]
    });
    alert.present(prompt);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
