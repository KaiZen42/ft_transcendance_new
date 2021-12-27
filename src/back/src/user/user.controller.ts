import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  @Get()
  getUser() {
    return 'user';
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {

  }
}
