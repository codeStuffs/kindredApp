import { Component } from "@angular/core";
import { Loading, LoadingController, Platform } from "ionic-angular";

import { Storage } from "@ionic/storage";
import { Device } from "@ionic-native/device";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
//import { Camera, CameraOptions } from "@ionic-native/camera";
import { AngularFire } from "angularfire2";

import { AuthService } from "../providers/auth-service";
import { LoginPage } from "../pages/login/login";
import { TabsPage } from "../pages/tabs/tabs";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  loading: Loading;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, device: Device, af: AngularFire,
    public authService: AuthService, storage: Storage, public loadingCtrl: LoadingController) {

    const authObserver = af.auth.subscribe(
      user => {
        this.showLoading('Authenticating...');
        if (user) {
          this.rootPage = TabsPage;
          authObserver.unsubscribe();
        } else {
          this.rootPage = LoginPage;
          authObserver.unsubscribe();
        }
        this.loading.dismiss();
      });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.show();
      statusBar.styleLightContent();
      statusBar.overlaysWebView(false);
      // set status bar to toolbar color
      if (device.platform === 'android' || device.platform === 'Android') {
        statusBar.backgroundColorByHexString("#379068");
      }
      if (device.platform === 'iOS' || device.platform === 'ios')
        statusBar.backgroundColorByHexString('#56ca96');

      splashScreen.hide();
    });
  }

  showLoading(message) {
    this.loading = this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
