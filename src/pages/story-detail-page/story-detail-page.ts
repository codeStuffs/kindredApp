import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

/*
 Generated class for the ItemDetailPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector   : 'story-detail-page',
  templateUrl: 'story-detail-page.html'
})
export class StoryDetailPage {

  selectedStory : any;

  constructor (public navCtrl : NavController, public navParams : NavParams) {
    this.selectedStory = navParams.get('story');

  }

  ionViewDidLoad () {
    console.log('Hello ItemDetailPage Page for real...');
  }

}
