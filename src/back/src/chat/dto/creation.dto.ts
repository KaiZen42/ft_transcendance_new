import {  IsNotEmpty } from "class-validator";

export class creationDto {

  @IsNotEmpty()
  idUser: number;

  otherUser: number;

  pass : string;

  name : string;
}
