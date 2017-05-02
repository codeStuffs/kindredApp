import { Pipe, PipeTransform } from '@angular/core';
import { FamilyService } from "../../providers/family-service";

@Pipe({
	name: 'fetch'
})
export class ReversePipe {

	constructor(public familyService: FamilyService) {

	}
	transform(value, args: string[]): any {
		let keys = [];
		//console.log(value);
		let data = this.familyService.getMyAcceptedRequests(value);
		//console.log(data);
		return data;
		//return value.slice().reverse();
	}
}

@Pipe({
	name: 'status'
})
export class StatusPipe {
	transform(value, args: string[]): any {
	}
}

@Pipe({
  name: 'chatter'
})

export class ChatPipe{

  transform(value, args:string[]):any{
    console.log(value);
  }
}
