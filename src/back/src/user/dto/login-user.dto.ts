import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUsreDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  image_url: string;
  @IsNotEmpty()
  readonly two_fa_auth: boolean
  @IsNotEmpty()
  readonly twoFaAuthCode: string
}
