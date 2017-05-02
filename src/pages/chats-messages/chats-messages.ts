import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NavController, NavParams } from "ionic-angular";
import { Chat, Message, MessageType } from "../../models";
import { Observable } from "rxjs";
import * as moment from "moment";
import { AngularFire } from "angularfire2";
import { Subscriber } from "rxjs/Subscriber";

import firebase from "firebase";
import _ from "underscore";
import { Subscription } from "rxjs/Subscription";
/*
 Generated class for the ChatsMessages page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector   : 'page-messages',
  templateUrl: 'chats-messages.html'
})
export class ChatsMessagesPage implements OnInit, OnDestroy {
  selectedChat : Chat;
  messageData : Array<any> = [];
  title : string;
  picture : string;
  messagesDayGroups : Observable<any>;
  messages : Observable<any>;
  message : string         = '';
  autoScroller : MutationObserver;
  senderId : string;
  scrollOffset             = 0;
  scrollControll : FormControl;
  loadingMessages : boolean;
  messagesComputation : Subscription;


  constructor (public navCtrl : NavController,
               private angFire : AngularFire,
               public navParams : NavParams,
               private el : ElementRef) {
    this.selectedChat   = <Chat>navParams.get('chat');
    this.title          = this.selectedChat.title;
    this.picture        = this.selectedChat.picture;
    this.scrollControll = new FormControl();
    this.senderId       = firebase.auth().currentUser.uid;

    console.log(this.selectedChat.$key);
  }

  private get messagesPageContent () : Element {
    return this.el.nativeElement.querySelector('.messages-page-content');
  }

  private get messagesList () : Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get scroller () : Element {
    return this.messagesList.querySelector('.scroll-content');
  }


  ngOnInit () {
    this.autoScroller = this.autoScroll();
    this.subscribeMessages();

    this.angFire.database.list('/chat-messages/' + this.selectedChat.$key)
      .subscribe(data => {
        this.messageData = data;
        Observable
          .fromEvent(this.scroller, 'scroll')
          .takeUntil(this.autoRemoveScrollListener(data.length))
          .filter(() => !this.scroller.scrollTop)
          .filter(() => !this.loadingMessages)
          .forEach(() => this.subscribeMessages());
      })
  }

  subscribeMessages () : void {
    this.loadingMessages = true;
    this.scrollOffset    = this.scroller.scrollHeight;
    const messages       = this.angFire.database.list('/chat-messages/' + this.selectedChat.$key);
    messages.subscribe((messages) => {

      this.messagesDayGroups = this.findMessagesByDayGroup(messages);
      /*if (!this.messagesComputation) {
       this.messagesComputation = this.autoRunMessages(messages);
       }*/
      this.loadingMessages = false;
    });

  }

  autoRunMessages (messages) : Subscription {
    this.messagesDayGroups = this.findMessagesByDayGroup(messages);
    console.log(this.messagesDayGroups);
    return new Subscription();
  }

  findMessagesByDayGroup (Messages) {

    const sortOwner = Messages.map((messages : Message) => {
      messages.ownership = this.senderId == messages.senderId ? 'mine' : 'other';
      return messages;
    });

    //console.log(sortOwner);

    const grouped = _.groupBy(sortOwner, (obj, key, value) => {
      return moment(obj.createdAt).format("D MMMM Y");
    });

    //console.info(grouped);

    const groups = Object.keys(grouped).map((timestamp : string) => {
      return {
        timestamp: timestamp,
        messages : grouped[timestamp],
        today    : moment().format("D MMMM Y") === timestamp
      }
    });

    console.debug(groups);
    return Observable.of(groups);

  }

  ngOnDestroy () {
    this.autoScroller.disconnect();
  }

  onInputKeypress ({keyCode} : KeyboardEvent) : void {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }


  autoScroll () : MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree  : true
    });

    return autoScroller;
  }

  autoRemoveScrollListener<T> (messageCount : number) : Observable<T> {
    return Observable.create((observer : Subscriber<T>) => {
      console.log(this.messageData);
      console.info(messageCount);
      const messages = this.angFire.database.list('/chat-messages/' + this.selectedChat.$key);
      messages.subscribe({
        next : (messages) => {
          if (messageCount !== messages.length) {
            return;
          }

          observer.next();

          observer.complete();
        },
        error: (e) => {
          observer.error(e)
        }
      });
    })
  }

  scrollDown () : void {
    if (this.loadingMessages) {
      return;
    }
    // Scroll down and apply specified offset
    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
    // Zero offset for next invocation
    this.scrollOffset       = 0;
  }

  sendTextMessage () : void {
    // If message was yet to be typed, abort
    if (!this.message) {
      return;
    }
    let message = {
      content  : this.message,
      type     : MessageType.TEXT,
      senderId : this.senderId,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };

    this.angFire.database.list('/chat-messages/' + this.selectedChat.$key).push(message)
      .then(() => {
        this.message = '';
        console.log('done');
      })
      .catch((a) => {
        console.log(a);
      })
    /**/
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad ChatsMessagesPage');

    this.scrollControll.valueChanges.debounceTime(1000).subscribe(search => {
      let textAreaH      = this.el.nativeElement.getElementsByTagName('textarea')[0];
      let scrollContentB = this.el.nativeElement.getElementsByClassName('scroll-content')[0];
      let messageBtn     = this.el.nativeElement.getElementsByClassName('message-editor-button')[0];

      if (textAreaH.scrollHeight > 20) {
        scrollContentB.style.marginBottom = textAreaH.scrollHeight + 100 + "px";
        if (messageBtn) messageBtn.style.marginBottom = "-" + (textAreaH.scrollHeight + 1) + "px";
        if (textAreaH.value === "") textAreaH.style.height = 20 + "px";
      }
      if (textAreaH.scrollHeight === 20) {
        scrollContentB.style.marginBottom = 70 + "px";
        if (this.message !== "" || typeof messageBtn !== "undefined")
          messageBtn.style.paddingBottom = 0 + 'px';
      }

    });
  }

}
