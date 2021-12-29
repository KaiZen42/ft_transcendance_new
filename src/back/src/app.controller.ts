import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async users(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: +id } });
  }

  @Get('users/find/:name')
  async getUserByName(@Param('name') name: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { name: name } });
  }

  @Get('user/name')
  async getUserByNameBody(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.findFirst({ where: { name: updateUserDto.name } });
  }

  @Post('users')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: createUserDto });
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id: +id },
      data: updateUserDto,
    });
  }
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.prisma.user.delete({ where: { id: +id } });
  }
}
