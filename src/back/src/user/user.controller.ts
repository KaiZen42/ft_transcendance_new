import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly user: UserService,
	  ) {}
	
	@Get()
	async users():Promise<User[]> {
	  return await this.user.getAll();
	}
  
	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<User> {
	  return await this.user.getUserById(id);
	}
  
	@Get('users/find/:name')
	async getUserByName(@Param('name') name: string): Promise<User> {
	  return await this.prisma.user.findFirst({ where: { name: name } });
	}
  
	@Get('user/name')
	async getUserByNameBody(@Body() user: UpdateUserDto): Promise<User> {
	  return await this.user.getByName(user);
	}
  
	@Post()
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
