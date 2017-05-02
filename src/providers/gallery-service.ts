import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Images} from '../models';
import {IMAGES} from '../images';
//import { Camera} from '@ionic-native/camera';


/*
  Generated class for the GalleryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GalleryService {

  constructor(public http: Http) {
    console.log('Hello GalleryService Provider');
  }

  getImages(): Promise<any>{
  	return Promise.resolve(IMAGES);
  }

}
