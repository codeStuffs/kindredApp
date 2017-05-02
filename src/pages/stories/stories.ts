import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Loading, LoadingController, NavController, NavParams, ModalController } from "ionic-angular";
import { StoryDetailPage } from "../story-detail-page/story-detail-page";
import * as moment from "moment";
import "rxjs/add/operator/map";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Stories } from "../../models";
import { CreatePostPage } from "../create-post/create-post";
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2";
import { AuthService } from "../../providers/auth-service";
import { StoriesService } from "../../providers/stories-service";
import { FamilyService } from "../../providers/family-service";

@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})


export class StoriesPage implements OnInit {
  loading: Loading;
  selectedStory: any;
  searchQuery: string = '';

  searchActive: boolean;
  story: string[];
  stories: FirebaseListObservable<any>;
  storiesTemp: any;
  famCount: any;
  dateSubject: Subject<any>;
  noFamilies: any;

  //infoObserver: any;

  constructor(
    private navCtrl: NavController, navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public authService: AuthService,
    private familyService: FamilyService,
    private storyService: StoriesService,
    private angFire: AngularFire,
  ) {

    this.searchActive = false;
    this.searchActive = false;
    this.selectedStory = navParams.get('story');

  }

  public currentUser: any;

  ngOnInit() {

    this.authService.getUserInfo().then(data => {
      this.currentUser = data;
      this.noFamilies = !!this.currentUser.families;

    }).catch((error) => {
      console.log(error)
    });
    this.initializeStories();

  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }


  initializeStories(): any {
    // get users from secure api end point

    this.familyService.getMyFamilies()
      .then((snapshot) => {
        let myFamilies = [];
        for (let i in snapshot) {
          // code...
          myFamilies.push({
            id: i,
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

  loadedStories(myFamilies) {
    // let stories = [];
    // code for just one family goes here......
    this.stories = this.storyService.loadStories(myFamilies);


  }
  searchStory(ev: any) {
    this.initializeStories();

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

  private createPostTapped(event) {
    console.log(event);

    let createPost = this.modalCtrl.create(CreatePostPage);
    createPost.present();
  }

  storyTapped(event, story) {
    console.log(story);
    this.navCtrl.push(StoryDetailPage, {
      story: story
    })
  }
}

