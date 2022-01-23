import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserImg {
  @IsNotEmpty()
  id: number
  @IsNotEmpty()
  readonly image_url: string;
}

export class UpdateUserName {
  @IsNotEmpty()
  readonly login: string;
}
