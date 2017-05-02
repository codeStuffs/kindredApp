import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the KinsDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-kins-detail',
	templateUrl: 'kins-detail.html'
})
export class KinsDetailPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad KinsDetailPage');
	}

}
