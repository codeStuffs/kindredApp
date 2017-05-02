import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Observable } from "rxjs";

import "rxjs/add/operator/map";
import { FamilyService } from "../../providers/family-service";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import firebase from "firebase";

/*
  Generated class for the ManageFamily page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-manage-family',
	templateUrl: 'manage-family.html'
})
export class ManageFamilyPage {
	requests: FirebaseListObservable<any>;
	familyData: any;
	loading: Loading;
	constructor(public navCtrl: NavController, public familyService: FamilyService,
		private loadingCtrl: LoadingController,
		private angFire: AngularFire,
		private alertCtrl: AlertController,
		public navParams: NavParams) {

		this.familyData = navParams.get('familyData');
		//console.log(this.familyData);

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ManageFamilyPage');
		setTimeout(() => {
			this.getFamilyRequests();
		}, 3000)
	}

	ngOnInit() { }

	getFamilyRequests() {
		console.log(this.familyData['id']);
		this.requests = this.angFire.database.list('/family-requests/' + this.familyData['id']);
	}

	acceptRequest(request) {
		this.showLoading("Accepting Request..");
		this.familyService.acceptRequest(this.familyData, request)
			.then((data) => {
				this.showAlert();

			 }, (error) => {
				this.handleError(error);
			}).then((err) => {
				this.handleError(err);
			})
	}

	private showAlert(): void {

		setTimeout(() => {
			this.loading.dismiss();
		});

		const alert = this.alertCtrl.create({
			title: 'Confirmed',
			message: 'Request Confirmed',
			buttons: ['OK']
		});

		alert.present();
	}
	private handleError(e): void {

		setTimeout(() => {
			this.loading.dismiss();
		});

		const alert = this.alertCtrl.create({
			title: 'Oops!',
			message: e,
			buttons: ['OK']
		});

		alert.present();
	}

	private showLoading(content) {
		this.loading = this.loadingCtrl.create({
			content: content,
			duration: 100000
		});
		this.loading.present().then(() => {
		});
	};
}
