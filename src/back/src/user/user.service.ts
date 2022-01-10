import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUsreDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userDB: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userDB.find();
  }

  async getById(id: number): Promise<User> {
    return this.userDB.findOne({ where: { id: id } });
  }

  async getByEmail(email: string): Promise<User> {
    // return this.prisma.user.findFirst({ where: { email } });
    return this.userDB.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    if (userData.password != userData.passwordConfirm) {
      throw new BadRequestException('Passwords do not math!');
    }
    const hashed = await bcrypt.hash(userData.password, 12);
    return this.userDB.save({
      email: userData.email,
      name: userData.name,
      password: hashed,
    });
  }

  async update(id: number, userData): Promise<any> {
  
    return this.userDB.update(id, userData);
  }

  async delete(id: number) {
    return this.userDB.delete({ id });
  }

  async login(userData: LoginUsreDto, response: Response): Promise<User> {
    const user = await this.getByEmail(userData.email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (!(await bcrypt.compare(userData.password, user.password))) {
      throw new BadRequestException('Wrong password!');
    }
    const token = await this.jwt.signAsync({ id: user.id });

    response.cookie('token', token, { httpOnly: true });
    return user;
  }

  async userCookie(cookie): Promise<any> {
    const data = await this.jwt.verifyAsync(cookie);
    return this.userDB.findOne({ id: data['id'] });
  }
}
