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
import { Camera, CameraOptions } from "@ionic-native/camera";
import firebase from "firebase";
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
  base64Img : string;
  loading : Loading;
  currentUser : any;
  familyCount : number;
  familiesCheckBoxOpen : boolean;
  familiesCheckResult;
  blob : Blob;
  private photos : Array<any>;
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


    if (this.familyCount > 1) {
      this.showOptions();
    } else {
      let famId = this.myFamilies[0].id;
      this.sortAndModifyTale(this.familyCount, famId);
    }
  }


  /*allow the user to select the family(ies) to post to*/
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


  takePicture () : void {
    this.showLoading('Please wait...');
    if (!this.platform.is('cordova')) {
      return console.warn("You need to run this app in a device");
    }
    const options : CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType   : this.camera.EncodingType.JPEG,
      mediaType      : this.camera.MediaType.PICTURE,
      quality        : 75
    }

    this.camera.getPicture(options).then((dataURI) => {
      if (this.photos.length > 0) this.photos = [];
      this.base64Img = "data:image/jpeg;base64," + dataURI;
      const blob     = this.postPictureService.convertDataURIToBlob(dataURI);
      this.blob      = blob;
      this.loading.dismiss();
    }).catch(err => {
      this.handleError(err);
    })
  }

  private choosePicture () : void {
    this.showLoading('Selecting photo');
    this.postPictureService.select().then((file) => {
      this.photos = file;

      this.grid = Array(Math.ceil(this.photos.length / 2));

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
      this.postPictureService.convertURLtoBlob(file).then(blob => {
        console.log(typeof blob);
        this.blob = blob;
      }, err => {

        console.error(err);
        this.handleError(err);
      }).catch(err => {
        this.handleError(err);
        console.log(err);
      });

      this.loading.dismiss();

    }, (e : Error) => {
      this.handleError(e);
    }).catch((err) => {
      console.log(err);
    })
  }


  /*sort the chosen families and make the post*/
  private sortAndModifyTale (familyCount, familyId) {
    this.showLoading('Creating Post..');
    let storyKey = firebase.database().ref().child('stories').push().key;
    if (this.blob) {

      this.storyService.uploadStoryPhoto(familyId, this.blob, storyKey)
        .then((snapshot) => {

          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('image is ' + progress + ' % done');
          let downloadUrl = snapshot.downloadURL;
          this.storyService.createTale(familyCount, familyId, this.tale, downloadUrl, storyKey)
            .then(() => {
              this.tale = {body: ''};

              this.viewCtrl.dismiss().then(() => {

              });
            }, (error) => {
              this.handleError(error);
            }).catch((err) => {
            this.handleError(err);
          });
        }).catch(err => {
        this.handleError(err);
      })
    } else {
      this.storyService.createTale(familyCount, familyId, this.tale, '', storyKey)
        .then(() => {
          this.tale = {body: ''};
          this.viewCtrl.dismiss()
            .then(() => {
              this.loading.dismiss();
            });
        }, (error) => {
          this.handleError(error);
        }).catch((err) => {
        this.handleError(err);
      });
    }
  }


  private showLoading (content) {
    this.loading = this.loadingCtrl.create({
      content            : content,
      dismissOnPageChange: true
    });
    this.loading.present();
  };


  private handleError (e) : void {
    console.error(e);
    setTimeout(() => {
      this.loading.dismiss();
    });

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e,
      buttons: ['OK']
    });

    alert.present();
  }

  goBack () {
    this.navCtrl.pop();
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }
}
