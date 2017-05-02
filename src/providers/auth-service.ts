import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Storage } from "@ionic/storage";


import { AngularFire, AngularFireAuth, FirebaseAuthState, FirebaseObjectObservable } from "angularfire2";
import firebase from "firebase";
import { Events } from "ionic-angular";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { FamilyService } from "./family-service";

/*
 Generated class for the AuthService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */


@Injectable()
export class AuthService {
  private _authState: FirebaseAuthState;
  currentUserObservable: FirebaseObjectObservable<any>;
  updateObservable: FirebaseObjectObservable<any>;

  constructor(private storage: Storage, public events: Events,
    private http: Http, public auth$: AngularFireAuth,
    private angFire: AngularFire) {
    this._authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this._authState = state;
    });

  }

  get authenticated(): boolean {
    return this._authState !== null;
  };

  get authState(): FirebaseAuthState {
    return this._authState;
  };

  loginUser(credentials): firebase.Promise<any> {

    return this.auth$.login({ email: credentials.email, password: credentials.password });
  };

  registerUser(credentials): firebase.Promise<any> {

    return this.auth$.createUser({
      email: credentials.email, password: credentials.password
    }).then((user) => {

      return user;
      //send email verification
    });
  };

  createUserProfile(credentials, user): firebase.Promise<any> {
    let defaultPhoto = "assets/leaf.png";
    return this.angFire.database.object(`/users/${user.uid}`)
      .update({
        firstname: this.firstToUpper(credentials.name),
        middleName: credentials.middleName ? this.firstToUpper(credentials.middleName) : ' ',
        lastName: this.firstToUpper(credentials.surname),
        dob: credentials.dob,
        email: credentials.email.toLowerCase(),
        gender: credentials.gender,
        photoUrl: defaultPhoto
      });
  }

  updateProfile(data): firebase.Promise<any> {
    let userId = firebase.auth().currentUser.uid;
    if (userId !== null) {
      this.updateObservable = this.angFire.database.object('/users/' + userId);

      return this.updateObservable.update({
        firstname: this.firstToUpper(data.firstname),
        lastName: this.firstToUpper(data.lastName),
        middleName: this.firstToUpper(data.middleName),
        dob: data.dob,
        gender: data.gender,
        phone: data.phone ? data.phone : ' ',
        location: data.location ? data.location : ' ',
        occupation: data.occupation ? data.occupation : ' '
      });

    }
  };

  emailVerification(first: string, last: string): firebase.Promise<any> {
    let firstname = this.firstToUpper(first);
    let lastname = this.firstToUpper(last);
    let user = firebase.auth().currentUser;
    return user.updateProfile({
      displayName: firstname + " " + lastname,
      photoURL: ' '
    }).then(function() {
      // Update successful.
      return user.sendEmailVerification().then(() => {
      }, (error) => {
      });
    }, function(error) {
      // An error happened.
    });
  };

  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  getUserInfo(): firebase.Promise<any> {
    let userId = firebase.auth().currentUser.uid;
    if (userId !== null) {
      return firebase.database().ref('/users/' + userId)
        .once('value')
        .then(snapshot => {
          //save user families if any...
          if (snapshot.val().families) console.log('yes');
          return snapshot.val();
        });
    } else {
      console.log('uuid is null do something');
    }
  };

  getUserId(): Promise<any> {
    return this.storage.get('userId').then((value) => {
      return value;
    });
  };

  firstToUpper(word): string {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
  }

  setUserId(): void {
    let userId = firebase.auth().currentUser.uid;
    console.log(userId);
    if (userId !== null)
      this.storage.set('userId', userId).then(() => {
        console.log('logged');
      });
  };

  getSavedUserInfo(): Promise<any> {
    return this.storage.get('userInfo').then((value) => {
      return value;
    })
  };


  logOutUser(): firebase.Promise<any> {
    this.auth$.unsubscribe();
    this.storage.clear();
    return this.auth$.logout();
  }
}
