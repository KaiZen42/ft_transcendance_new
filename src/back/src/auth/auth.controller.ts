import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  async addUser(@Body() userData: CreateUserDto): Promise<User> {
    return await this.user.create(userData);
  }
}
