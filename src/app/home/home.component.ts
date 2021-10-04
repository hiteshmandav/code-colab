import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType } from './types';
import * as client from 'socket.io-client';
import { RoomDetails } from '../create-room/create-room.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('vid') vidOutput: ElementRef;
  @ViewChild('chatArea') chatArea: ElementRef;

  public message = '';
  public messageList: MessageType[];
  private socket: any;
  public roomCreated: boolean;
  public userList = [];
  public roomDetails: RoomDetails;
  public privateMessage: string;
  public id: string;


  constructor() { }

  ngOnInit(): void {
    this.messageList = [];
  }

  startChat(){

  }

  public reciveRoomDetails(roomDetails: RoomDetails) {
    // console.log(roomDetails);
    this.roomDetails = roomDetails;
    this.roomCreated = true;
    this.socket = client.io(`localhost:3000`,
                             { query: {
                                        roomName: roomDetails.roomName,
                                        tagName: roomDetails.tagName
                                      }
                             });
    this.socket.on('connect', () => {
      this.id = this.socket.id;
      console.log(this.id)
      this.displayMessage(`Joined the room`, 'You', true, undefined);
      this.startVideoCapture();
      this.socket.emit('join-room', joinedDetail => {
        this.displayMessage(`Joined the room`, joinedDetail, true, undefined);
      });
    });

    this.socket.on('room-joined', joinedDetail => {
      this.displayMessage(`Joined the room`, joinedDetail, true, undefined);
    });

    this.socket.on('user-disconnected', joinedDetail => {
      this.displayMessage(`left the room`, joinedDetail, true, undefined);
    });

    this.socket.on('recive-message', (msg) => {
      console.log(`message recived ${msg.message}, ${msg.tag}`)
      this.displayMessage(msg.message, msg.tag , false, undefined);
    });

    this.socket.on('recive-private-message', (msg) => {
      this.displayMessage(msg.message, `You Recived private Message from ${msg.tag}` , false, msg.senderId);
    });

    this.socket.on('all-users', users =>{
      this.userList = users.filter(user => user.id != this.id);
      this.userList.forEach((user) => {
        user.openMessage = false;
      })
      console.log(`userList :: ${this.userList}`)
    });

    // this.socket.on('stream-send', stream =>{
    //   console.log(stream)
    // });
  }

  openPrivateMessage(user){
    user.openMessage = true;
    this.privateMessage = '';
  }

  // sendPrivateMessage(user) {
  //   // console.log(`private message :: ${user.tagName} ${user.roomName} :: ${user.id}`)
  //   user.openMessage = false;
  //   this.socket.emit('send-private-msg', ({'message' : this.privateMessage , 'id': user.id}));
  //   this.privateMessage = '';
  //   // this.displayMessage(`sent private message to ${user.tagName}`, `You`, true, undefined);
  // }

  sendPrivateMessage(user) {
    // console.log(`private message :: ${user.tagName} ${user.roomName} :: ${user.id}`)
    user.openMessage = false;
    this.socket.emit('send-private-msg', ({'message' : this.privateMessage , 'id': user.id}), (conformation) => {
      this.displayMessage(conformation, `You`, true, undefined);
    });
    this.privateMessage = '';
    // this.displayMessage(`replied a private message.`, `You`, true, undefined);
  }

  sendMessage(){
    console.log(`send Message ${this.message}`);

    if(this.message !== '') {
      this.displayMessage(this.message, 'You', false, false);
      this.socket.emit('send-message', this.message);
      this.message = '';
    } else {

    }
  }

  displayMessage(message, sender, isSystem, isPrivate) {
    this.messageList.push({message: message,
                           user: sender,
                          isSystem: isSystem,
                          id: isPrivate,
                          openMessage : false
                          });
    this.chatArea.nativeElement.scrollTop  = this.chatArea.nativeElement.scrollHeight;
  }

  startVideoCapture() {
    // child is set
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    }).then(stream => {
      this.vidOutput.nativeElement.srcObject = stream;
      this.socket.emit('stream', (stream) => {
        console.log(stream)
      });
    }).catch(error => console.error(error))
  }
}
