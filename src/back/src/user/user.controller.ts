import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { LoginUsreDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  @Get()
  async users(): Promise<User[]> {
    return await this.user.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return await this.user.getById(id);
  }

  @Get(':name')
  async getByName(@Param('name') name: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { name } });
  }

  @Get(':email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    return await this.user.getByEmail(email);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<User> {
    return await this.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.user.delete(id);
  }
}
