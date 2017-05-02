import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Observable } from "rxjs";
import { ImagesPage } from "../images/images";
import { Images } from '../../models';
import { GalleryService } from "../../providers/gallery-service";


/*
  Generated class for the Gallery page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})
export class GalleryPage implements OnInit {
  galleries: Images[];

  constructor(public navCtrl: NavController, private imageService: GalleryService) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  ngOnInit(): void {
    this.imageService.getImages().then(images => this.galleries = images)

  }

  galleryTapped() {
    this.navCtrl.push(ImagesPage,
      {
        images: this.galleries
      }
    );
  }

}
