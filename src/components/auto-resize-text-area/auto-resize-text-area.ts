import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';

/*
  Generated class for the AutoResizeTextArea directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
	selector: "ion-textarea[auto-resize-text-area]" // Attribute selector
})
export class AutoResizeTextArea implements  OnInit {

 @HostListener("input", ["$event.target"])
 oninput(textArea:HTMLTextAreaElement):void{
	 this.adjust();
 }
  constructor(public element: ElementRef) {
    console.log('Hello AutoResizeTextArea Directive');
  }

  ngOnInit() {
	  setTimeout(() => this.adjust(), 0);
  }

  adjust():void{
	  let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];

	  textArea.style.overflow = 'hidden';
	  textArea.style.height = '20px';
	  textArea.style.height = textArea.scrollHeight + "px";
    console.log(textArea.style.height);
  }

}


@Directive({
  selector: "ion-input[auto-resize-input]" // Attribute selector
})

export class AutoResizeInput implements  OnInit {

  @HostListener("input", ["$event.target"])
  oninput(input:HTMLTextAreaElement):void{
    this.adjust();
  }
  constructor(public element: ElementRef) {
    console.log('Hello AutoResizeInput Directive');
  }

  ngOnInit() {
    setTimeout(() => this.adjust(), 0);
  }

  adjust():void{
    let inputBox = this.element.nativeElement.getElementsByTagName('input')[0];

    inputBox.style.overflow = 'hidden';
    inputBox.style.height = 'auto';
    inputBox.style.height = inputBox.scrollHeight + "px";
    console.log(inputBox.style.height);
  }

}
