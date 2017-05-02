import { ModalController, Platform, NavParams, ViewController, Slides, NavController } from 'ionic-angular';

import { StatusBar } from "@ionic-native/status-bar";
import { Component, OnInit, ViewChild, AfterViewInit, } from '@angular/core';
import { Images } from '../../models';
import { IMAGES } from '../../images';
/*
  Generated class for the ViewImages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-images',
  templateUrl: 'view-images.html'
})
export class ViewImagesPage {
  plugins: any;
  image: Images[];
  slidess = [];
  mySlideOptions = {
    loop: true
  };


  @ViewChild(Slides) slides: Slides;
  character;
  constructor(
    public statusBar: StatusBar,
    public platform: Platform,
    public params: NavParams,
    private navCtrl: NavController,
    public viewCtrl: ViewController
  ) {
    this.image = params.get("selectedImage");

    let slideCount = 0;
    for (var i = 0; i < this.image.length; i++) {
      this.slidess[slideCount] = { image: IMAGES[i] };
      slideCount++
    }
  }

  goBack() {
    // if(!this.statusBar.isVisible) this.statusBar.show();
    this.navCtrl.pop();
  }
  dismiss() {
    // if(!this.statusBar.isVisible) this.statusBar.show();
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewImagesPage');
  }
}