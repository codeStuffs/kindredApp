import { Component, trigger, state, style, transition, animate, keyframes } from "@angular/core";
import { AlertController, Loading, LoadingController, NavController, NavParams } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
import { Storage } from "@ionic/storage";
import { SignupPage } from "../signup/signup";
import { TabsPage } from "../tabs/tabs";
import { FamilyService } from "../../providers/family-service";
/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [

    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,500px,0' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,500px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,500px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {
  logoState: any = "in";
  treeState: any = "in";
  loginState: any = "in";
  formState: any = "in";

  loading: Loading;
  registerCredentials = { email: '', password: '' };
  error = "";


  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService, private familyService: FamilyService,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public createAccountPage() {
    this.navCtrl.push(SignupPage);
     this.registerCredentials = { email: '', password: '' };
  }

  public login() {

    this.showLoading('Authenticating...');
    this.authService.loginUser(this.registerCredentials)
      .then((authData) => {
        setTimeout(() => {
          console.log(authData);
          this.authService.getUserInfo().then((data) => {
            if (typeof data.families !== 'undefined')
              this.familyService.setMyFamilies(data.families);
          })
          this.authService.setUserId();
          this.navCtrl.setRoot(TabsPage)
        });

      }).catch((Error) => {
        this.showError(Error);
      });

  }
  showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message,
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
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
