import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  image_url: string;
}
