import {Component} from "@angular/core";

import {StoriesPage} from "../stories/stories";
import {KinsPage} from "../kins/kins";
import {ChatsPage} from "../chats/chats";
import {AccountPage} from "../account/account";
import {GalleryPage} from "../gallery/gallery";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = StoriesPage;
  tab2Root: any = GalleryPage;
  tab3Root: any = KinsPage;
  tab4Root: any = ChatsPage;
  tab5Root: any = AccountPage;


  constructor() {

  }
}
