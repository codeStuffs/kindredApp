import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Storage } from "@ionic/storage";

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2";
import firebase from "firebase";

import "rxjs/add/operator/map";

import { Observable } from "rxjs/Observable";

import { AuthService } from "./auth-service";
import { Stories } from "./models";

/*
 Generated class for the FamilyService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FamilyService {
  familyObservable : FirebaseObjectObservable<any>;
  joinFamilyObservable : FirebaseObjectObservable<any>;
  createFamilyObservable : FirebaseListObservable<any>;
  familyList : any;
  familyRequestObservable : FirebaseListObservable<any>;
  familyRef : any;
  myFamily : FirebaseListObservable<any>;
  members : FirebaseListObservable<any>;
  data : any;
  requestRef : any;
  familyRequestList : FirebaseListObservable<any>;

  constructor (public http : Http,
               public authService : AuthService,
               public angFire : AngularFire,
               public storage : Storage,) {

    this.createFamilyObservable = angFire.database.list('/families');
    console.log('Hello FamilyService Provider');
    this.load();
  }

  load () : any {
    //  let data = this.getUserFamilies();
    this.familyRef = firebase.database().ref('/families');
    if (this.familyList) {
      console.log('okay');
      return Observable.of(this.familyList);
    } else {
      this.familyRef.on('value', familyList => {
        let families = [];
        familyList.forEach(family => {
          families.push(family.val());
        });
        return this.familyList = families;
      });
    }
  }

  loadFamilyRequest () : any {

    /*this.familyRequestList = this.angFire.database.list("/family-requests");
     return this.familyRequestList;*/

    this.requestRef = firebase.database().ref('/family-requests');
    this.requestRef.on('value', request => {
      let requests = [];
      request.forEach(request => {
        requests.push(request.val());
      });
      console.log(requests);

      return requests;
    });
  }

  getUserFamilies () : any {
    let userId       = firebase.auth().currentUser.uid;
    let userFamilies = this.angFire.database.object('/users/' + userId + 'families', {preserveSnapshot: true});
    return userFamilies.subscribe((snapshot) => {
      return snapshot;
    })
  }

  joinFamily (familyId, name) : firebase.Promise<any> {
    let userId = firebase.auth().currentUser.uid;

    this.joinFamilyObservable = this.angFire.database.object('/users/' + userId);
    return this.joinFamilyObservable.update({
      families: {
        [familyId]: name
      }
    });
  };

  familyRequest (familyId, userData) : firebase.Promise<any> {
    let user = firebase.auth().currentUser;

    if (user.uid !== null) {
      let request              = {
        name    : userData.firstname + " " + userData.lastName,
        id      : user.uid,
        photo   : userData.photoUrl,
        accepted: false,
        date    : firebase.database.ServerValue.TIMESTAMP
      };

      let newRequest                                                  = {};
      newRequest["/family-requests/" + familyId + '/' + user.uid]     = request;
      newRequest['/families/' + familyId + '/members/' + user.uid]    = false;
      newRequest['/users/' + user.uid + "/sent-requests/" + familyId] = true;
      //	this.joinFamilyObservable = this.angFire.database.object('/family-requests/' + familyId + '/' + user.uid);
      return firebase.database().ref().update(newRequest);
    }
  };

  // this.familyService.getMyRequest();
  getMyAcceptedRequests (key) : any {
    let uid = firebase.auth().currentUser.uid;

    let ref     = firebase.database().ref('/families/' + key);
    let request = [];
    ref.once('value').then(function (snapshot) {
      request.push({
        name  : snapshot.child('name').val(),
        status: snapshot.child('members').child(uid).val()
      })
    });
    return request;
  }


  registerFamily (userData, data) : firebase.Promise<any> {
    let user = firebase.auth().currentUser;
    let key  = user.uid;

    //create a new member array using the users key as a unique identifier

    /*Get the key for the new family */
    let newFamKey = firebase.database().ref().child('families').push().key;

    //create the new fam data
    let fam               = {
      id            : newFamKey, //wanna use this later for making request
      name          : this.authService.firstToUpper(data.name),
      country       : data.location,
      description   : data.description ? data.description : '',
      administrators: {
        [key]: userData.firstname + ' ' + userData.lastName
      },
      members       : {
        [key]: true
      }
    };
    let saveFamToUserNode = {
      [newFamKey]: this.authService.firstToUpper(data.name)
    };
    let userDetails       = {
      firstname : userData.firstname,
      lastName  : userData.lastName,
      middleName: userData.middleName ? userData.middleName : ' ',
      photoUrl  : userData.photoUrl
    };

    let newFam                       = {};
    //create the family node
    newFam['/families/' + newFamKey] = fam;
    //create the members node
    //newFam['/family-members/' + newFamKey] = setAdminAsMember;
    // alternative way to add member
    //create users families under users node.
    newFam['/users/' + key + '/families/']             = saveFamToUserNode;
    newFam['/family-members/' + newFamKey + '/' + key] = userDetails;
    return firebase.database().ref().update(newFam);
  };


  acceptRequest (family, user) : firebase.Promise<any> {
    let newData                                                                    = {};
    newData["/family-requests/" + family['id'] + "/" + user.id + "/" + "accepted"] = true;  //family request
    newData["/families/" + family['id'] + "/members/" + user['id']]                = true;      // families node
    //newData['/families/' + family['id'] + '/request-accepted/' + user['id']] = true;			 //  users node
    return firebase.database().ref().update(newData);
  }

  updateFamilyInfo (data) : void { }

  searchFamilies (searchTerm) {
    return this.familyList.filter((family) => {
      return family.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  //get
  getMyFamilyMembers (familyId) : any {
    let userId = firebase.auth().currentUser.uid;
    let myFam  = [];
    familyId.forEach(value => {
      this.members = this.angFire.database
        .list('/family-members/' + value.key);
    });
    //console.log(this.members);
    return this.members;
  };

  //Set user family on user node since only the user has permission to write
  setMyfamiily (familyId, user) : firebase.Promise<any> {
    let userId       = firebase.auth().currentUser.uid;
    let upDate       = {};
    let familyMember = {
      firstname : user.firstname,
      middleName: user.middleName,
      lastName  : user.lastName,
      photoUrl  : user.photoUrl
    };

    upDate["/users/" + userId + '/families/' + familyId + '/'] = true;
    upDate["/family-members/" + familyId + "/" + userId]       = familyMember;
    firebase.database().ref('/user/' + userId + "/sent-requests/" + familyId).remove();
    firebase.database().ref("/families/" + familyId + "/request-accepted/" + userId).remove();
    return firebase.database().ref().update(upDate);
  }

  getMyFamilies ():any {

    let userId = firebase.auth().currentUser.uid;
    if (userId !== null) {
      return firebase.database().ref('/users/' + userId + '/families/')
        .once('value')
        .then(snapshot => {
          return snapshot.val();
        });
    } else {
      console.log('uuid is null do something');
    }
  }

  createFamilyNetwork (data) {

  }

  //save user family id to indexDb
  setMyFamilies (families) : void {

    let data = this.transformFamilyObject(families);
    this.storage.set('myFamilies', data);
  }

  transformFamilyObject (value) : any {
    let keys = [];
    for (let key in value) {
      keys.push(
        {key: key, value: value[key]});
    }
    console.log(keys)
    return keys;
  }


}
