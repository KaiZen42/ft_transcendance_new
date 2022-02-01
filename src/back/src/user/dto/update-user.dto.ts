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

export class UpdateUser {
  readonly username: string
  readonly avatar: string
  readonly two_fa_auth: boolean
  @IsNotEmpty()
  readonly twoFaAuthCode: string
}
