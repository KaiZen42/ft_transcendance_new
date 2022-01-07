import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUsreDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
