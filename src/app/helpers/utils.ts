import { Injectable } from "@angular/core";
import { Constants } from "../constants";

@Injectable()
export class Utils {

  constructor(){}

  public checkIfStringIsEmpty(str: string) {
    return Boolean(!str.replace(/\s/g, Constants.EMPTY_STRING).length)
  }
}
