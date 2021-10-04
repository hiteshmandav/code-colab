import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  @Output() sendRoomDetails = new EventEmitter<RoomDetails>();

  public roomName: string;
  public tagName: string;
  public isError: boolean;

  constructor() { }

  ngOnInit(): void {
    this.roomName = '';
    this.tagName = '';
  }

  public enterRoom(){
    if(this.roomName !== '' && this.tagName !== '') {
      this.isError = false;
      this.sendRoomDetails.emit({
        roomName: this.roomName,
        tagName: this.tagName
      });
    } else {
      this.isError = true;
    }
  }

}

export class RoomDetails {
  roomName: string;
  tagName: string;
}
