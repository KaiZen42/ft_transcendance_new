import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

	constructor(
		private readonly prisma: PrismaService,
	  ) {}
	
	  async getAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	  }

	  async getUserById(id: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { id: +id } });
	  }

	  async getByName(user: UpdateUserDto): Promise<User> {
		return await this.prisma.user.findFirst({ where: { name: user.name } });
	  }
	
}
