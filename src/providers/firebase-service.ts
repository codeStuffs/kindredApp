import { AngularFireModule, AngularFire, FirebaseApp } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {
	public authRef: any;
	public storageRef: any;
	public databaseRef: any;

	constructor( @Inject(FirebaseApp) firebase: any) {
		this.authRef = firebase.auth();
		this.storageRef = firebase.storage();
		this.databaseRef = firebase.database();
	}

	fetchProvidersForEmail(email: string) {
		return this.authRef.fetchProvidersForEmail(email);
	}

}
