import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType } from './types';
import * as client from 'socket.io-client';

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
  private socket: any;
  public canStartChat: boolean;


  constructor() { }

  ngOnInit(): void {
    this.messageList = [];
    this.socket = client.io(`localhost:3000`);
    this.socket.on('connect', () => {
      this.displayMessage(`You are connected with Id : ${this.socket.id}`, 'other', false);
      console.log(`socket :: $`)
    });

    this.socket.on('recive-message', (msg) => {
      console.log(`message recived ${msg}`)
      this.displayMessage(msg, 'other', false)
    });
  }

  startChat(){

  }

  sendMessage(){
    console.log(`send Message ${this.message}`);

    if(this.message !== '') {
      this.displayMessage(this.message, 'You', true);
      this.socket.emit('send-message', this.message);
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
