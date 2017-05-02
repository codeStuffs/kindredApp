import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";

import { AuthService } from "./auth-service";
import { FamilyService } from "./family-service";
import { Stories } from "./models";

import { Observable, Subject } from "rxjs";
import "rxjs/add/operator/map";

import { AngularFire, FirebaseListObservable } from "angularfire2";
import firebase from "firebase";
/*
 Generated class for the StoriesService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
/*const queryList = af.database.list('/items', {
 query: {
 limitToLast: 10,
 orderByKey: true
 }
 });
 */
@Injectable()
export class StoriesService {

  family_id : any;
  data : FirebaseListObservable<any>;
  familyStorySubject : Subject<any>;
  createPostObservable : FirebaseListObservable<any>;
  private myFamilies : any;
  private famCount : number;
  stories : any;
  loadedStories : FirebaseListObservable<any>;
  loadedTempStories : FirebaseListObservable<any>;


  constructor (public http : Http,
               public angFire : AngularFire,
               public storage : Storage,
               public familyService : FamilyService,
               public authService : AuthService) {
    console.log('Hello StoriesService Provider');
  }


  loadStories (myFamilies) : any {

    if (myFamilies[0].id) {
      this.loadedTempStories = this.angFire.database.list('/stories/' + myFamilies[0].id, {
        query: {
          limitToLast: 20
        }
      });//.map((arr) => { return arr.reverse(); })
      console.log(this.loadedStories);

      if (this.loadedStories === undefined) {
        return this.loadedTempStories.map((arr) => { return arr.reverse(); });
      } else {
        this.loadedStories = null;
        console.log('sweat');
        return this.loadedStories = this.loadedTempStories;
      }

    }
  }

  renderStories (userFamilies) : Observable<any> {
    try {
      return new Observable(observer => {
        let stories : any = [];

        firebase.database().ref('stories/' + userFamilies[0].id).orderByChild('date_created').once('value', (items : any) => {
            items.forEach((item) => {
              stories.push(item.val());
            });

            console.info(stories);
            observer.next(stories);
            observer.complete();
          },
          (error) => {
            console.log(error);
            console.dir(error);
            observer.error(error);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  loadFamiliesForStory (myFamilies) : any {

    //if user has more than one family, the code goes here
    //CODE
    let stories = [];
    // code for just one family goes here......
    this.data   = this.angFire.database.list('/stories/' + myFamilies[0].id, {preserveSnapshot: true});
    this.data.subscribe((snapshots) => {
      snapshots.forEach(snapshot => {
        this.angFire.database.object('/users/' + snapshot.val().userId, {preserveSnapshot: true})
          .subscribe((snapshotUser) => {
            let temp = {
              body         : snapshot.val().body,
              date_created : snapshot.val().date_created,
              other_content: snapshot.val().photoUrl,
              taleId       : snapshot.val().taleId,
              userId       : snapshot.val().userId,
              starCount    : snapshot.val().starCount,
              owner        : snapshotUser.val().firstname + " " + snapshotUser.val().lastName,
              photoUrl     : snapshotUser.val().photoUrl
            };
            stories.push(temp)
          })
      });
      return this.stories = stories;
    });
  }

  processStroriesSnapshot () : Observable<any> {

    if (this.stories) {
      return Observable.of(this.stories);
    } else {
      //this.loadFamiliesForStory();

      setTimeout(() => {
        return this.stories;
      })
    }
  }


  createTale (familyCount, familyId, data) : firebase.Promise<any> {
    let user = firebase.auth().currentUser;
    if (familyCount > 1) {
      console.log(familyId);
    }
    let storyKey              = firebase.database().ref().child('stories').push().key;
    let tale                  = {
      body        : data.body,
      date_created: firebase.database.ServerValue.TIMESTAMP,
      tale_id     : storyKey,
      mediaUrl    : '', //if any....
      authorPhoto : data.authorPhoto,
      starCount   : 0,
      owner       : data.owner,
      userId      : user.uid,
    }
    this.createPostObservable = this.angFire.database.list('stories/' + familyId + '/');

    return this.createPostObservable.update(storyKey, tale);
  }


  processStories () {

  }

  /*getStories(family_id: string): Observable<Stories[]> {

   }*/


}
