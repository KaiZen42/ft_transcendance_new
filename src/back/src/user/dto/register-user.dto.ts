import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUsreDto {
	@IsNotEmpty()
	@IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly passwordConfirm: string;
}
