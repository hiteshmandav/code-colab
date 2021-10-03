import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType } from './types'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('vid') vidOutput: ElementRef;
  @ViewChild('chatArea') chatArea: ElementRef;

  public message = '';
  public messageList: MessageType[];


  constructor() { }

  ngOnInit(): void {
    this.messageList = [];
  }

  sendMessage(){
    console.log(`send Message ${this.message}`);
    
    if(this.message !== '') {
      this.displayMessage(this.message, 'You', true); 
      this.message = '';
    } else {

    }
  }

  displayMessage(message, sender, isMine) {
    this.messageList.push({message: message, user: sender, isMine: isMine});
    this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
  }

  ngAfterViewInit() {
    // child is set
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    }).then(stream => {
      this.vidOutput.nativeElement.srcObject = stream;
    }).catch(error => console.error(error))
  }
}
