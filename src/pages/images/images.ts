import { Component } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar";
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Images } from '../../models';
import { ViewImagesPage } from '../view-images/view-images';

/*
  Generated class for the Images page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-images',
  templateUrl: 'images.html'
})
export class ImagesPage {
	images: Images[];

  constructor(public navCtrl: NavController, public statusBar: StatusBar,
    public navParams: NavParams, public modalCtrl: ModalController) {
    this.images = navParams.get('images');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagesPage');
  }

  imageTapped(image) {
    let kinImage = this.modalCtrl.create(ViewImagesPage, { selectedImage: this.images }, { enableBackdropDismiss: false });
    kinImage.present();
    //if (this.statusBar.isVisible) this.statusBar.hide();
  }

}
