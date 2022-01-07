import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { LoginUsreDto } from 'src/user/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.user.create(userData);
  }
	
	@Post('login')
	async login(@Body() userData: LoginUsreDto): Promise<User> {
		return await this.user.login(userData);
	}
}
