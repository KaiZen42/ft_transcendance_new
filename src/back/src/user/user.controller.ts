import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUsreDto } from './dto/login-user.dto';
import { User } from './models/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly user: UserService,
  ) {}

  @Get()
  async users(): Promise<User[]> {
    return await this.user.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    return await this.user.getById(id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    return await this.user.getByEmail(email);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto){
    await this.user.update(id, userData);

    return this.user.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.user.delete(id);
  }
}
