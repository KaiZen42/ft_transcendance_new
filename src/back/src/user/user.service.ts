import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: +id } });
  }

  async getByName(user: UpdateUserDto): Promise<User> {
    return this.prisma.user.findFirst({ where: { name: user.name } });
  }

	async create(userData: CreateUserDto): Promise<User> {
		if (userData.password != userData.passwordConfirm) {
			throw new BadRequestException("Passwords do not math!");
			
		}
    const hashed = await bcrypt.hash(userData.password, 12);
		return this.prisma.user.create({
			data: {
				email: userData.email,
				name: userData.name,
				password: hashed,
			}
		});
  }
}
