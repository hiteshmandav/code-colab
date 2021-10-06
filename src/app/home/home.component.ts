import { Utils } from './../helpers/utils';
import { Constants } from './../constants';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType, RoomDetails } from './types';
import * as client from 'socket.io-client';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('chatArea') chatArea: ElementRef;

  public message = Constants.EMPTY_STRING;
  public messageList: MessageType[];
  private socket: any;
  public roomCreated: boolean;
  public userList = [];
  public roomDetails: RoomDetails;
  public privateMessage: string;
  public id: string;
  public video: number = 1;
  public selfVid: any;


  // public peer = new Peer(undefined , {
  //   path: '/peerjs',
  //   host: 'localhost',
  //   port: '3030'
  // });

  constructor(private util: Utils) { }

  public ngOnInit(): void {
    this.messageList = [];
  }

  public reciveRoomDetails(roomDetails: RoomDetails) {
    this.roomDetails = roomDetails;
    this.roomCreated = true;
    this.socket = client.io(Constants.SERVER_URL,
                             { query: {
                                        roomName: roomDetails.roomName,
                                        tagName: roomDetails.tagName
                                      }
                             });
    this.socket.on('connect', () => {
      this.id = this.socket.id;
      console.log(this.id)
      this.displayMessage(Constants.JOIN_ROOM_MESSAGE, Constants.YOU, true, undefined);
      this.startVideoCapture();
      // this.peer.on('open', id => {
      //   console.log(`peer Id : ${id}`);
      // })

      this.socket.emit('join-room', joinedDetail => {
        this.displayMessage(Constants.JOIN_ROOM_MESSAGE, joinedDetail, true, undefined);
      });
    });



    this.socket.on('room-joined', joinedDetail => {
      this.displayMessage(Constants.JOIN_ROOM_MESSAGE, joinedDetail, true, undefined);
    });

    this.socket.on('user-disconnected', joinedDetail => {
      this.displayMessage(Constants.LEFT_ROOM_MESSAGE, joinedDetail, true, undefined);
    });

    this.socket.on('recive-message', (msg) => {
      // console.log(`message recived ${msg.message}, ${msg.tag}`)
      this.displayMessage(msg.message, msg.tag , false, undefined);
    });

    this.socket.on('recive-private-message', (msg) => {
      this.displayMessage(msg.message, `${Constants.PRIVATE_MESSAGE} ${msg.tag}` , false, msg.senderId);
    });

    this.socket.on('all-users', users =>{
      this.userList = users.filter(user => user.id != this.id);
      this.userList.forEach((user) => {
        user.openMessage = false;
        user.stream = null
      })
      // console.log(`userList :: ${this.userList}`)
    });

    // this.socket.on('recive-video', users => {

    //   this.userList = users.filter(user => user.id != this.id);
    //   // this.userList = users;
    //   // console.log(`reciving vid :: ${vid}`);
    //   // this.startVideoCapture()

    //   this.userList.forEach(element => {
    //     console.log(`vid recived ${element.id}`)
    //      let el = document.getElementById(element.id);
    //      console.log(`el :: ${el}`)
    //       // el.srcObject = element.stream;

    //     try {
    //       el.srcObject = element.stream;
    //     } catch (error) {
    //       el.src = URL.createObjectURL(element.stream);
    //     }
    //   });
    // })

    // this.socket.on('stream-send', stream =>{
    //   console.log(stream)
    // });
  }

  togglePrivateMessage(user){
    user.openMessage = !user.openMessage;
    this.privateMessage = Constants.EMPTY_STRING;
  }

  // sendPrivateMessage(user) {
  //   // console.log(`private message :: ${user.tagName} ${user.roomName} :: ${user.id}`)
  //   user.openMessage = false;
  //   this.socket.emit('send-private-msg', ({'message' : this.privateMessage , 'id': user.id}));
  //   this.privateMessage = Constants.EMPTY_STRING;
  //   // this.displayMessage(`sent private message to ${user.tagName}`, `You`, true, undefined);
  // }

  sendPrivateMessage(user) {
    // console.log(`private message :: ${user.tagName} ${user.roomName} :: ${user.id}`)
    const isPrivateMessageEmpty = this.util.checkIfStringIsEmpty(this.privateMessage);
    if(!isPrivateMessageEmpty) {
      user.openMessage = false;
      this.socket.emit('send-private-msg', ({'message' : this.privateMessage , 'id': user.id}), (conformation) => {
        this.displayMessage(conformation, `Your`, true, undefined);
      });
      this.privateMessage = Constants.EMPTY_STRING;;
    }
    // this.displayMessage(`replied a private message.`, `You`, true, undefined);
  }

  sendMessage(){
    // console.log(`send Message ${this.message}`);
    const isMessageEmpty = this.util.checkIfStringIsEmpty(this.message);
    if(!isMessageEmpty) {
      this.displayMessage(this.message, 'You', false, false);
      this.socket.emit('send-message', this.message);
      this.message = Constants.EMPTY_STRING;
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
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    }).then(stream => {
      this.selfVid = document.getElementById('selfVid')
      this.selfVid.srcObject = stream;
      // console.log(stream)
      // this.socket.emit('video', ({
      //   'id' : this.id,
      //   'stream': stream
      // }));
    }).catch(error =>

      console.error(error))
  }
}
