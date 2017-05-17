import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { MomentModule } from "angular2-moment";
import { IonicStorageModule } from "@ionic/storage";
import { MyApp } from "./app.component";
import { TabsPage } from "../pages/tabs/tabs";
import { AbsoluteDrag } from "../components/absolute-drag/absolute-drag";
import { AutoResizeTextArea } from "../components/auto-resize-text-area/auto-resize-text-area";

import { KeysPipe, ObjPipe } from "./pipes/keys-pipe";
import { ReversePipe, StatusPipe } from "./pipes/reverse-pipe";

import { ChatsMessagesPage } from "../pages/chats-messages/chats-messages";
import { ChatsPage } from "../pages/chats/chats";
import { KinsPage } from "../pages/kins/kins";
import { KinProfilePage } from "../pages/kin-profile/kin-profile";

import { GalleryPage } from "../pages/gallery/gallery";
import { ImagesPage } from "../pages/images/images";
import { ViewImagesPage } from "../pages/view-images/view-images";

import { StoriesPage } from "../pages/stories/stories";
import { StoryDetailPage } from "../pages/story-detail-page/story-detail-page";
import { AccountPage, ProfileMorePopOver } from "../pages/account/account";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";

import { CreateFamilyPage } from "../pages/create-family/create-family";
import { JoinFamilyPage } from "../pages/join-family/join-family";

import { InviteKinPage } from "../pages/invite-kin/invite-kin";
import { PhotoViewer} from "@ionic-native/photo-viewer";
// Import the AF2 Module
import { AngularFireModule, AuthMethods, AuthProviders } from "angularfire2";
import { FamilyService } from "../providers/family-service";


import { Device } from "@ionic-native/device";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Camera } from "@ionic-native/camera";
import { AuthService } from "../providers/auth-service";
import { StoriesService } from "../providers/stories-service";
import { GalleryService } from "../providers/gallery-service";
import { CreatePostPage } from "../pages/create-post/create-post";
import { ManageFamilyPage } from "../pages/manage-family/manage-family";
import { NewChatPage } from "../pages/new-chat/new-chat";
import { PostPictureService } from "../providers/post-picture-service";
import { ImagePicker } from "@ionic-native/image-picker";


// AF2 Settings
export const firebaseConfig = {
  apiKey           : "AIzaSyDmEphnRTKm_iz8d2VJWmPYxYqsY9SI3dg",
  authDomain       : "the-kindred-app.firebaseapp.com",
  databaseURL      : "https://the-kindred-app.firebaseio.com",
  projectId        : "the-kindred-app",
  storageBucket    : "the-kindred-app.appspot.com",
  messagingSenderId: "354373910035"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method  : AuthMethods.Password
};

@NgModule({
  declarations   : [
    MyApp,
    AbsoluteDrag,
    AutoResizeTextArea,
    KeysPipe,
    ObjPipe,
    ReversePipe,
    StatusPipe,
    LoginPage,
    SignupPage,
    StoriesPage,
    StoryDetailPage,
    GalleryPage,
    ImagesPage,
    ViewImagesPage,
    KinsPage,
    KinProfilePage,
    ChatsPage,
    ChatsMessagesPage,
    JoinFamilyPage,
    CreateFamilyPage,
    InviteKinPage,
    ProfileMorePopOver,
    ManageFamilyPage,
    // HomePage,
    AccountPage,
    EditProfilePage,
    TabsPage,
    CreatePostPage,
    NewChatPage
  ],
  imports        : [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    MomentModule,
    IonicStorageModule.forRoot({
      name       : '__kindreddb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap      : [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    StoriesPage,
    StoryDetailPage,
    GalleryPage,
    ImagesPage,
    ViewImagesPage,
    KinsPage,
    KinProfilePage,
    ChatsPage,
    ChatsMessagesPage,
    JoinFamilyPage,
    CreateFamilyPage,
    InviteKinPage,
    ProfileMorePopOver,
    ManageFamilyPage,
    //HomePage,
    AccountPage,
    EditProfilePage,
    CreatePostPage,
    TabsPage,
    NewChatPage
  ],
  providers      : [
    StatusBar,
    SplashScreen,
    Device,
    Camera,
    ImagePicker,
    PhotoViewer,
    AuthService,
    StoriesService,
    GalleryService,
    FamilyService,
    PostPictureService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
