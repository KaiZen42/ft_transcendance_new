import { isNotEmpty, IsNotEmpty } from "class-validator";

export class messageDto {
  //@IsNotEmpty()
  id: number;
  @IsNotEmpty()
  idUser: number;

  @IsNotEmpty()
  user: string;
  @IsNotEmpty()
  data: string;
}
