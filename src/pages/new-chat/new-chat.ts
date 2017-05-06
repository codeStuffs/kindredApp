import { Component } from "@angular/core";
import { AlertController, NavController, NavParams, ViewController } from "ionic-angular";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AngularFire } from "angularfire2";
import { Subscription } from "rxjs/Subscription";

import firebase from "firebase";
import { Observable } from "rxjs/Observable";
import { FamilyService } from "../../providers/family-service";

/*
 Generated class for the NewChat page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector   : 'page-new-chat',
  templateUrl: 'new-chat.html'
})
export class NewChatPage {
  searchPattern : BehaviorSubject<any>;
  senderId : string;
  kins : Observable<any>;
  kinSubscription : Subscription;
  userData : any;
  members;

  constructor (public navCtrl : NavController, private angFire : AngularFire,
               public familyService : FamilyService, private viewCtrl : ViewController,
               public alertCtrl : AlertController,
               public navParams : NavParams) {
    this.senderId      = firebase.auth().currentUser.uid;
    this.searchPattern = new BehaviorSubject(undefined);
    this.userData      = navParams.get('userData');
  }

  ngOnInit () {
    this.newChatSearchBar();
  }

  newChatSearchBar () : void {

    if (typeof this.userData !== "undefined") {

      this.searchPattern.asObservable()
        .debounce(() => Observable.timer(1000))
        .forEach(() => {
          if (this.kinSubscription) {
            this.kinSubscription.unsubscribe();
          }
          this.kinSubscription = this.subscribeKins();
        })
    }
  }
  subscribeKins () : Subscription {

      let userFamilies = this.familyService.transformFamilyObject(this.userData.families);
      userFamilies.forEach(value => {
        this.members = this.angFire.database
          .list('/family-members/' + value.key);
      });
      /*
       * , {
       query: {
       orderByChild: 'firstname',
       equalTo     : this.searchPattern.getValue()
       }
       }*/
      console.log(this.searchPattern.getValue());
      return this.members.subscribe((result) => {
        this.kins = this.findKins(result);
      });

  }

  private findKins (kins) {

    /*const tip = _.filter(kins, (obj) => {
     console.log(obj);
     return obj.firstname.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || obj.middleName.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || obj.lastName.toLowerCase() == this.searchPattern.getValue().toLowerCase().trim()
     || (obj.firstname.toLowerCase() + " " + obj.middleName.toLowerCase()) == this.searchPattern.getValue().toLowerCase().trim()
     || (obj.firstname.toLowerCase() + " " + obj.middleName.toLowerCase() + " " + obj.lastName.toLowerCase()) == this.searchPattern.getValue().toLowerCase().trim();
     });*/
    let value = this.searchPattern.getValue();
    const tip = kins.filter((kin) => {

      if (typeof value !== "undefined") {
        if (typeof kin.firstname !== "undefined" && typeof kin.middleName !== "undefined" && typeof kin.lastName !== "undefined") {
          return kin.firstname.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || kin.middleName.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || kin.lastName.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            || (kin.firstname.toLowerCase() + " " + kin.middleName.toLowerCase()).indexOf(value.toLowerCase().trim()) > -1
            || (kin.firstname.toLowerCase() + " " + kin.middleName.toLowerCase() + " " + kin.lastName.toLowerCase()).indexOf(value.toLowerCase().trim()) > -1;

        }
      }
    });
    if (typeof value == 'undefined' || value == "") return Observable.of(kins);
    return Observable.of(tip);
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad NewChatPage');

  }

  updateSubscription (value) {
    console.log(value);
    this.searchPattern.next(value);
  }


  addChat (receiverId) : void {

    const uid = firebase.auth().currentUser.uid;
    if (uid !== null) {

      if (this.checkUser(uid, receiverId)) {
        this.error("Not Allow");
        return;
      }
      const isChat = firebase.database().ref('/chat-members/').once('value');
      isChat.then((snapshot) => {
        let isExist = false;
        snapshot.forEach((childSnapshot) => {
          /*let key        = childSnapshot.key;*/
          let isSender   = childSnapshot.child(uid).exists();
          let isReceiver = childSnapshot.child(receiverId).exists();
          if (isSender && isReceiver) {
            return isExist = true;
          }
        });
        if (!isExist) {
          this.letsTango(uid, receiverId);
        } else {
          this.error("You have an ongoing chat with this user");
        }
      }, (error) => {
        console.error(error);
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  private checkUser (sender, receiver) {
    return sender === receiver;
  }

  private letsTango (uid, receiverId) {



    let chat    = {
      title      : "",
      lastMessage: "",
      timestamp  : firebase.database.ServerValue.TIMESTAMP,
      membersId  : [uid, receiverId]
    };
    let members = {
      [uid]       : true,
      [receiverId]: true,
    };

    let newChatId = firebase.database().ref().child('chats').push().key;

    let chats                           = {};
    chats['/chats/' + newChatId]        = chat;
    chats['/chat-members/' + newChatId] = members;

    firebase.database().ref().update(chats).then(() => {
      this.viewCtrl.dismiss();
    }, (a : Error) => {
      this.handleError(a);
    }).catch(a => {
      this.handleError(a);
    });
    //check if conversation already exits
  }


  private handleError (e : Error) : void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

  private error (message) : void {

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: message,
      buttons: ['OK']
    });

    alert.present();
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

}
