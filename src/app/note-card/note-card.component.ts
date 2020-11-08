import { Component, OnInit,ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  @Input() title: String;
  @Input() body: String; 
  @Input() link: String;  

  @Output('delete') deleteEventt: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator') truncator:ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  constructor(private renderer: Renderer2) { }
  ngOnInit(){

  }
  ngAfterViewInit() {
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight= parseInt(style.getPropertyValue("height"), 10);
    // console.log(this.bodyText.nativeElement.scrollHeight, "**" ,viewableHeight);

    if(this.bodyText.nativeElement.scrollHeight > viewableHeight){
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }else{
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }

  }

  onXButtonClick(){
    this.deleteEventt.emit();
  }

}