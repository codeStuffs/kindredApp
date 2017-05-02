import { Pipe, PipeTransform } from "@angular/core";
import _ from "underscore";

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform (value, args : string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(
        {key: key, value: value[key]});
    }
    return keys;
  }
}

@Pipe({
  name: 'objkeys'
})
export class ObjPipe implements PipeTransform {
  transform (value, args : string[]) : any {
   console.log(_.object(['content','createdAt','senderId','type','ownership'],value));
    /*
    _.map(value, function (obj) {
      obj['content']   = obj[0];
      obj['createdAt'] = obj[1];
      obj['senderId']  = obj[2];
      obj['type']      = obj[3];
      obj['ownership'] = obj[4];
      delete  obj[0];
      delete  obj[1];
      delete  obj[2];
      delete  obj[3];
      delete obj[4];

    });*/
   // return _.object(['content','createdAt','senderId','type','ownership'],value);
    return Object.keys(value);//.map(key=> Object.assign({key}, value[key]));
  }
}
