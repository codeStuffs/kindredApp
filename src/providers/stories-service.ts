import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";

import { AuthService } from "./auth-service";
import { FamilyService } from "./family-service";
import { Observable, Subject } from "rxjs";
import "rxjs/add/operator/map";

import { AngularFire, FirebaseListObservable } from "angularfire2";
import firebase from "firebase";
/*import { Stories } from "./models";*/
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
  /* private myFamilies : any;
   private famCount : number;*/
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


      if (this.loadedStories === undefined) {
        return this.loadedTempStories.map((arr) => { return arr.reverse(); });
      } else {
        this.loadedStories = null;

        return this.loadedStories = this.loadedTempStories;
      }

    }
  }

  //TODO: fix this function to return a subscription..
  renderStories (familyId) : Observable<any> {
    const uid = firebase.auth().currentUser.uid;
    if (uid !== "null" && familyId[0].id) {
      const stories = this.angFire.database.list('/stories/' + familyId[0].id, {
        query: {
          orderByChild: 'date_created',
          limitToLast : 20
        }
      });
      try {
        return new Observable(observer => {


          stories.subscribe(story => {

            const _stories : any = [];

            story.forEach(storySnapshot => {
              const id                = storySnapshot.userId;
              storySnapshot.userPhoto = '';
              this.angFire.database.object('/users/' + id + '/', {preserveSnapshot: true})
                .subscribe(user => {
                  storySnapshot.authorPhoto = user.val().photoUrl;
                  storySnapshot.userPhoto   = user.val().photoUrl;
                })
              _stories.push(storySnapshot);
            })

            observer.next(_stories);
            observer.complete();
          }, (error) => {
            console.error(error);
            console.dir(error);
            observer.error(error);
          })
        })
      } catch (err) {
        console.log(err);
        console.log("observable for fetching stories failed");
      }
    }

  }

  renderStory (userFamilies) : Observable<any> {
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
              body        : snapshot.val().body,
              date_created: snapshot.val().date_created,
              mediaUrl    : snapshot.val().mediaUrl,
              taleId      : snapshot.val().taleId,
              userId      : snapshot.val().userId,
              starCount   : snapshot.val().starCount,
              owner       : snapshotUser.val().firstname + " " + snapshotUser.val().lastName,
              photoUrl    : snapshotUser.val().photoUrl
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


  uploadStoryPhoto (familyId, photos, storyKey) : firebase.Promise<any> {
    let user = firebase.auth().currentUser;


    let storageRef = firebase.storage().ref();
    let folderRef  = storageRef.child('users/' + user.uid + '/' + 'stories/' + storyKey);
    let uploadTask = folderRef.put(photos);

    return uploadTask;
  }


  createTale (familyCount, familyId, data, photoUrl, storyKey) : firebase.Promise<any> {
    let user = firebase.auth().currentUser;

    if (familyCount > 1) {
      console.log(familyId);
    }
    let tale = {};
    if (photoUrl !== '') {
      tale = {
        body        : data.body,
        date_created: firebase.database.ServerValue.TIMESTAMP,
        tale_id     : storyKey,
        mediaUrl    : photoUrl,
        authorPhoto : data.authorPhoto,
        starCount   : 0,
        owner       : data.owner,
        userId      : user.uid,
      };
    } else {
      tale = {
        body        : data.body,
        date_created: firebase.database.ServerValue.TIMESTAMP,
        tale_id     : storyKey,
        mediaUrl    : "",
        authorPhoto : data.authorPhoto,
        starCount   : 0,
        owner       : data.owner,
        userId      : user.uid,
      };
    }

    this.createPostObservable = this.angFire.database.list('stories/' + familyId + '/');
    return this.createPostObservable.update(storyKey, tale);
  }


  processStories () {

  }

  /*getStories(family_id: string): Observable<Stories[]> {

   }*/


}
