import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Constants } from '../constants';
import { Utils } from '../helpers/utils';
import { RoomDetails } from '../home/types';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})

export class CreateRoomComponent implements OnInit {

  @Output() sendRoomDetails = new EventEmitter<RoomDetails>();

  public roomName: string;
  public tagName: string;
  public isRoomNameEmpty: boolean;
  public istagNameEmpty: boolean;

  constructor(private util : Utils) { }

  public ngOnInit(): void {
    this.roomName = Constants.EMPTY_STRING;
    this.tagName = Constants.EMPTY_STRING;
  }

  public enterRoom(){
    this.isRoomNameEmpty = this.util.checkIfStringIsEmpty(this.roomName);
    this.istagNameEmpty = this.util.checkIfStringIsEmpty(this.tagName);
    console.log(`${this.isRoomNameEmpty} :: ${this.istagNameEmpty}`)
    if(!this.isRoomNameEmpty && !this.istagNameEmpty) {
      this.sendRoomDetails.emit({
        roomName: this.roomName.trim(),
        tagName: this.tagName.trim()
      });
    }
  }

}
