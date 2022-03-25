import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserImg {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  readonly image_url: string;
}

export class UpdateUserName {
  @IsNotEmpty()
  readonly login: string;
}

export class UpdateUser {
  @IsNotEmpty()
  readonly id: number;
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly avatar: string;
  @IsNotEmpty()
  readonly two_fa_auth: boolean;
  readonly twoFaAuthCode?: string;
}
