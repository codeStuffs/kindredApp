import { Component } from "@angular/core";
import {
  AlertController,
  Loading,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ViewController
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
import { StoriesService } from "../../providers/stories-service";
import { PostPictureService } from "../../providers/post-picture-service";
import { Camera } from "@ionic-native/camera";
/*
 Generated class for the CreatePost page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector   : 'page-create-post',
  templateUrl: 'create-post.html'
})
export class CreatePostPage {
  myFamilies : any;
  loading : Loading;
  currentUser : any;
  familyCount : number;
  familiesCheckBoxOpen : boolean;
  familiesCheckResult;
  private photos : Array<string>;
  private grid : Array<Array<string>>;
  tale = {body: ''};

  constructor (public viewCtrl : ViewController,
               private platform : Platform,
               private postPictureService : PostPictureService,
               public navCtrl : NavController,
               public alertCtrl : AlertController,
               public storyService : StoriesService,
               public authService : AuthService,
               public loadingCtrl : LoadingController,
               private camera : Camera,
               public navParams : NavParams) { }

  ngOnInit () {
    this.getUserDetails();
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad CreatePostPage');
  }

  takePhoto () {

  }

  getUserDetails () {
    this.authService.getUserInfo().then((snapshot) => {
      this.currentUser = snapshot;
      console.log(this.currentUser.families);
      let myFamilies = [];
      for (let i in this.currentUser.families) {
        // code...
        myFamilies.push({
          id  : i,
          name: this.currentUser.families[i]
        })
      }

      this.tale['owner']       = this.currentUser.firstname + " " + this.currentUser.lastName;
      this.tale['authorPhoto'] = this.currentUser.photoUrl;
      this.myFamilies          = myFamilies;
      this.familyCount         = this.myFamilies.length

    }).catch((error) => {
      this.handleError(error);
    });
  };

  createTale () {
    console.log(this.tale);
    console.log(this.familyCount);
    this.showLoading('Creating Post..');

    if (this.familyCount > 1) {
      this.showOptions();
    } else {
      let famId = this.myFamilies[0].id;
      this.sortAndModifyTale(this.familyCount, famId);
    }
  }

  private showOptions () {
    let alert = this.alertCtrl.create();

    alert.setTitle('Seems like you have ' + this.familyCount + ' Families, which family would you like to post to?');

    for (let i in this.myFamilies) {
      console.log(this.myFamilies[i].name);
      alert.addInput({
        type : 'checkbox',
        label: 'The ' + this.myFamilies[i].name + "\'s",
        value: this.myFamilies[i].id,
      })
    }

    alert.addButton('Cancel');
    alert.addButton({
      text   : 'Okay',
      handler: data => {
        console.log(data);
        this.familiesCheckBoxOpen = false;
        this.familiesCheckResult  = data;
      }
    });

    alert.present().then(() => {
      this.familiesCheckBoxOpen = true;
    });

  }


  private sortAndModifyTale (familyCount, familyId) {
    this.storyService.createTale(familyCount, familyId, this.tale)
      .then(() => {

        this.tale = {body: ''};
        this.loading.dismiss();
        this.viewCtrl.dismiss();

      }, (error) => {
        console.log(error);
      }).catch((err) => {
      console.log(err)
      ;
    });
  }


  private showLoading (content) {
    this.loading = this.loadingCtrl.create({
      content            : content,
      duration           : 10000,
      dismissOnPageChange: true
    });
    this.loading.present().then(() => {
    });
  };


  private handleError (e : Error) : void {
    console.error(e);
    setTimeout(() => {
      this.loading.dismiss().then(() => {
      });
    });

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present().then(() => {
    });
  }

  takePicture () : void {
    if (!this.platform.is('cordova')) {
      return console.warn("You need to run this app in a device");
    }

    this.camera.getPicture().then((dataURI) => {
      const blob = this.postPictureService.convertDataURIToBlob(dataURI);


    })
  }

  private choosePicture () : void {
    this.showLoading('selecting photo');
    this.postPictureService.select().then((file) => {
      this.photos = file;

      this.grid  = Array(Math.ceil(this.photos.length / 2));

      let rowNum = 0;
      for (let i = 0; i < this.photos.length; i++) {
        this.grid[rowNum] = Array(2);
        if (this.photos[i]) {
          this.grid[rowNum][0] = this.photos[i];
        }

        if (this.photos[i + 1]) {
          this.grid[rowNum][1] = this.photos[i + 1]
        }
        rowNum++;
      }

      this.loading.dismiss();

    }, (e : Error) => {
      this.handleError(e);
    }).catch((err) => {
      console.log(err);
    })
  }

  goBack () {
    this.navCtrl.pop();
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
