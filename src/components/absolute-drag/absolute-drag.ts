import { Directive, Input, ElementRef, Renderer } from '@angular/core';
import {DomController} from 'ionic-angular';
/*
  Generated class for the AbsoluteDrag directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[absolute-drag]' // Attribute selector
})
export class AbsoluteDrag {
@Input('startLeft') startLeft: any;
@Input('startTop') startTop: any;
@Input ('startBottom') startBottom: any;
@Input ('startRight') startRight:any;
  constructor(public element: ElementRef, public renderer: Renderer,
  	public domCtrl: DomController) {

    console.log('Hello AbsoluteDrag Directive');
  }

  ngAfterViewInit(){
  	this.renderer.setElementStyle(this.element.nativeElement,'position', 'absolute');
  	this.renderer.setElementStyle(this.element.nativeElement,'left',this.startLeft+'px');
	this.renderer.setElementStyle(this.element.nativeElement,'top',this.startTop+'px');
	this.renderer.setElementStyle(this.element.nativeElement,'right',this.startRight+'px');
	this.renderer.setElementStyle(this.element.nativeElement,'bottom',this.startBottom+'px');
  
  	let hammer =  new window['Hammer'](this.element.nativeElement);
  	hammer.get('pan').set({direction: window['Hammer'].DIRECTION_ALL})

  	hammer.on('pan', (ev)=>{
  		this.handlePan(ev);
  	});
  }

  handlePan(ev){
  	let newLeft  = ev.center.x;
  	let newTop=  ev.center.y;

  	this.domCtrl.write(()=>{
  		this.renderer.setElementStyle(this.element.nativeElement, 'left',newLeft +'px');
  		this.renderer.setElementStyle(this.element.nativeElement, 'top',newTop +'px');
  	})
  }
}
