import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Loading, LoadingController, ModalController, NavController, NavParams } from "ionic-angular";
import { StoryDetailPage } from "../story-detail-page/story-detail-page";
import "rxjs/add/operator/map";
import { CreatePostPage } from "../create-post/create-post";
import { AngularFire } from "angularfire2";
import { AuthService } from "../../providers/auth-service";
import { StoriesService } from "../../providers/stories-service";
import { FamilyService } from "../../providers/family-service";
import firebase from "firebase";
@Component({
  selector   : 'page-stories',
  templateUrl: 'stories.html'
})


export class StoriesPage implements OnInit {
  loading : Loading;
  selectedStory : any;
  searchQuery : string = '';

  searchActive : boolean;
  story : string[];
  stories : any;
  famCount : any;
  noFamilies : any;


  constructor (private navCtrl : NavController, navParams : NavParams,
               public loadingCtrl : LoadingController,
               public storage : Storage,
               public modalCtrl : ModalController,
               public authService : AuthService,
               private familyService : FamilyService,
               private storyService : StoriesService,
               private angFire : AngularFire,) {

    this.searchActive  = false;
    this.searchActive  = false;
    this.selectedStory = navParams.get('story');

  }

  public currentUser : any;

  ngOnInit () {

    this.authService.getUserInfo().then(data => {
      this.currentUser = data;
      this.noFamilies  = !!this.currentUser.families;

    }).catch((error) => {
      console.log(error)
    });
    this.initializeStories();

  }

  showLoading (content) {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }


  initializeStories () : any {
    // get users from secure api end point

    this.familyService.getMyFamilies()
      .then((snapshot) => {
        let myFamilies = [];
        for (let i in snapshot) {
          // code...
          myFamilies.push({
            id  : i,
            name: snapshot[i]
          })
        }
        this.famCount = myFamilies.length;
        this.loadedStories(myFamilies);

        //this.storage.set('families', myFamilies);

        console.log('okay');

      }).catch((error) => {
      console.log(error);
      return error;
    });

  }

  loadedStories (myFamilies) {
    // let stories = [];
    // code for just one family goes here......
    const uid = firebase.auth().currentUser.uid;
    if (uid !== "null" && myFamilies[0].id) {
      const stories = this.angFire.database.list('/stories/' + myFamilies[0].id, {
        query: {
          orderByChild: 'date_created',
          limitToLast : 10
        }
      });
      stories.subscribe(story => {

        const _stories : any = [];
        console.log(story);
        story.reverse();

        story.forEach(storySnapshot => {
          const id                = storySnapshot.userId;
          storySnapshot.userPhoto = '';
          this.angFire.database.object('/users/' + id + '/', {preserveSnapshot: true})
            .subscribe(user => {
              storySnapshot.authorPhoto = user.val().photoUrl;
              storySnapshot.userPhoto   = user.val().photoUrl;
              storySnapshot.owner       = user.val().firstname + " " + user.val().middleName + " " + user.val().lastName;
            });
          _stories.push(storySnapshot);
        });
        this.stories = _stories;

      });//end subscribe

    }//end if
  }

  searchStory (ev : any) {


    let val = ev.target.value;

    if (val && val.trim() != '') {
      /* this.stories.filter((story) => {
       return (story.title.indexOf(val) >= 0 || story.story.indexOf(val) >= 0 ) ;

       });*/
      // this.stories = this.stories.filter((story) => {
      //  return (story.title.toLowerCase().indexOf(val.toLowerCase()) > -1 || story.story.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
    }
  }

  private createPostTapped (event) {
    console.log(event);

    let createPost = this.modalCtrl.create(CreatePostPage);
    createPost.present();
  }

  storyTapped (event, story) {
    console.log(story);
    this.navCtrl.push(StoryDetailPage, {
      story: story
    })
  }
}

