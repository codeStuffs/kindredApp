import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { Platform } from "ionic-angular";
import { ImagePicker } from "@ionic-native/image-picker";
/*
 Generated class for the PostPictureService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PostPictureService {

  constructor (public http : Http, private platform : Platform, private imagePicker : ImagePicker) {
    console.log('Hello PostPictureService Provider');
  }

  select () : Promise<any> {

    let options = {
      maximumImagesCount: 2,
      width             : 500,
      height            : 500,
      quality           : 75
    };

    if (!this.platform.is('cordova') || !this.platform.is('mobile')) {
      return new Promise((resolve, reject) => {
        try {
          console.log('choose a photo');
          alert('opps');
        } catch (e) {
          reject(e);
        }
      })
    }

    return this.imagePicker.getPictures(options)
      .then((URL : string) => {
          return URL; //this.convertURLtoBlob(URL);
        }, (err) => {return err}
      ).catch((e) => { return e});
  }

  convertURLtoBlob (URL : string) : Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = document.createElement('img');

      image.onload = () => {
        try {
          const dataURI = this.convertImageToDataURI(image);
          const blob    = this.convertDataURIToBlob(dataURI);

          resolve(blob);
        }
        catch (e) {
          reject(e)
        }
      };
    })
  }

  convertImageToDataURI (image : HTMLImageElement) : string {
    const canvas  = document.createElement('canvas');
    canvas.width  = image.width;
    canvas.height = image.height;


    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  convertDataURIToBlob (dataURI) : Blob {
    const binary = atob(dataURI);

    const charCodes = Object.keys(binary)
      .map<number>(Number)
      .map<number>(binary.charCodeAt.bind(binary));

    return new Blob([new Uint8Array(charCodes)], {type: 'image/jpeg'});
  }
}
