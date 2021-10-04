import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType } from './types';
import * as client from 'socket.io-client';
import { RoomDetails } from '../create-room/create-room.component';

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
  public roomCreated: boolean;


  constructor() { }

  ngOnInit(): void {
    this.messageList = [];
  }

  startChat(){

  }

  public reciveRoomDetails(roomDetails: RoomDetails) {
    console.log(roomDetails);
    this.roomCreated = true;
    this.socket = client.io(`localhost:3000`,
                             { query: {
                                        roomName: roomDetails.roomName,
                                        tagName: roomDetails.tagName
                                      }
                             });
    this.socket.on('connect', () => {
      this.displayMessage(`Joined the room`, 'You', true);
      console.log(`socket :: $`)
      this.socket.emit('join-room', joinedDetail => {
        this.displayMessage(`Joined the room`, joinedDetail, true);
      });
    });

    this.socket.on('room-joined', joinedDetail => {
      this.displayMessage(`Joined the room`, joinedDetail, true);
    });

    this.socket.on('recive-message', (msg) => {
      console.log(`message recived ${msg.message}, ${msg.tag}`)
      this.displayMessage(msg.message, msg.tag , false);
    });
  }

  sendMessage(){
    console.log(`send Message ${this.message}`);

    if(this.message !== '') {
      this.displayMessage(this.message, 'You', false);
      this.socket.emit('send-message', this.message);
      this.message = '';
    } else {

    }
  }

  displayMessage(message, sender, isSystem) {
    this.messageList.push({message: message, user: sender, isSystem: isSystem});
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
