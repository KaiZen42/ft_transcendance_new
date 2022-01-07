import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
	@IsNotEmpty()
	  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly password: string;
}
