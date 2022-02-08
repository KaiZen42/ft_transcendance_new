import {  IsNotEmpty } from "class-validator";

export class messageDto {

  @IsNotEmpty()
  idUser: number;
  
  @IsNotEmpty()
  room : string;

  @IsNotEmpty()
  user: string;
  
  @IsNotEmpty()
  data: string;
}
