import { IsNotEmpty } from "class-validator";

export class messageDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user: number;
  @IsNotEmpty()
  data: string;
}
