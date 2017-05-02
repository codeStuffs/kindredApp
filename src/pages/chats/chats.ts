import { Component, OnInit } from "@angular/core";

import {
  AlertController,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  PopoverController
} from "ionic-angular";
import { Chat } from "../../models";
import { ChatsMessagesPage } from "../chats-messages/chats-messages";
import { NewChatPage } from "../new-chat/new-chat";
import { AuthService } from "../../providers/auth-service";
import { AngularFire } from "angularfire2";
import firebase from "firebase";

@Component({
  selector   : 'page-chat',
  templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit {
  senderId : string;
  chats;
  loading : Loading;
  currentUser : any;
  text = 'text';

  constructor (public navCtrl : NavController, public popoverCtrl : PopoverController,
               public modalCtrl : ModalController, private loadingCtrl : LoadingController,
               public authService : AuthService,
               public angFire : AngularFire,
               public alertCtrl : AlertController) {
    this.showLoading();
    // this.chats = this.findChats();

    this.loading.dismiss();

  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad Chat Page');
  }

  ngOnInit () {
    this.getUserDetails();
    this.findChats();
  }

  getUserDetails () {
    this.authService.getUserInfo().then((snapshot) => {
      this.currentUser = snapshot;

    }).catch((error) => {
      this.handleError(error);
    });
  };

  private findChats () : any {
    const uid = firebase.auth().currentUser.uid;

    const Chats = this.angFire.database.list('/chats/', {
      query: {
        orderByChild: 'membersId',
        limitToLast : 10,

      }
    });
    Chats.subscribe(chats => {

      const myChats = [];
      chats.forEach(chat => {
        const myChat = chat.membersId.find(myId => myId === uid);
        console.log(myChat);
        if (myChat) {
          chat.title   = "";
          chat.picture = "";


          const receiverId = chat.membersId.find(memberId => memberId !== uid);

          if (receiverId) {
            this.angFire.database.object('/users/' + receiverId + '/', {preserveSnapshot: true})
              .subscribe(snapshot => {
                chat.title   = snapshot.val().firstname + " " + snapshot.val().lastName;
                chat.picture = snapshot.val().photoUrl;
              });
          }
          //const receiver = this.getReceiverInfo(receiverId);

          this.findLastMessage(chat.$key).subscribe({
            next    : (messages) => {
              if (!messages.length) {
                return;
              }
              const lastMessage = messages;
              chat.lastMessage  = lastMessage[0];
            },
            error   : (e) => {

            },
            complete: () => {

            }
          });
          myChats.push(chat);
        }
      });

      this.chats = myChats;

    })


  }

  findLastMessage (chatId : string) : any {
    return this.angFire.database.list('chat-messages/' + chatId + '/', {
      query: {
        limitToLast: 1
      }
    })
  }

  private getReceiverInfo (receiverId) : any {
    const receiver = this.angFire.database.object('users/' + receiverId + '/', {preserveSnapshot: true});
    let data       = {};
    receiver.subscribe(snapshot => {
      //console.log(snapshot.val());
      data = snapshot.val();
    });
    return data;
  }

  addChat () : void {
    const modal = this.modalCtrl.create(NewChatPage, {userData: this.currentUser});
    modal.present();
  }

  showMessages (chat) : void {
    this.navCtrl.push(ChatsMessagesPage, {chat});
  }

  private handleError (e) : void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title  : 'Oops!',
      message: e,
      buttons: ['OK']
    });

    alert.present();
  }

  showLoading () {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  removeChat (chat : Chat) : void {

  }
}
