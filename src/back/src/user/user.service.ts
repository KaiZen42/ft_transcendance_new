import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUsreDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { json } from 'stream/consumers';
import fetch from 'node-fetch';
import { retry } from 'rxjs';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userDB: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userDB.find();
  }

  async getById(id: number): Promise<User> {
    return this.userDB.findOne({ where: { id: id } });
  }
  async getByUsername(username: string): Promise<User> {
    return this.userDB.findOne({ where: { username: username } });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userDB.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    return this.userDB.save({
      id: userData.id,
      username: userData.login,
      avatar: userData.image_url,
      two_fa_auth: false,
    });
  }

  async update(id: number, userData: UpdateUser): Promise<any> {
    return this.userDB.update(id, {
      ...userData,
    });
  }

  async addImage(id: number, image_url: string) {
    return this.userDB.update(id, { avatar: image_url });
  }

  async settwoFaAuthSecret(secret: string, userId: number) {
    return this.userDB.update(userId, {
      twoFaAuthSecret: secret,
    });
  }

  async turnOnTwoFaAuth(userId: number) {
    return this.userDB.update(userId, {
      two_fa_auth: true,
    });
  }

  async delete(id: number) {
    return this.userDB.delete({ id });
  }

  async login(mycode: string, res: Response): Promise<User> {
    const body: any = {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: mycode,
      redirect_uri: process.env.REDIRECT_URI,
    };
    let response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    let data = (await response.json()) as any;
    let token: string = data.access_token;
    response = await fetch('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: 'Bearer ' + token },
    });
    data = await response.json();
    token = await this.jwt.signAsync({ id: data.id });
    res.cookie('token', token, { httpOnly: true });
    const user: User = await this.getById(data.id);
    if (!user) return this.create(data);
    else return user;
  }

  async userCookie(cookie): Promise<any> {
    console.log('arrivo' + cookie);
    const data = await this.jwt.verifyAsync(cookie);
    console.log(data['id']);
    const user = await this.getById(data['id']);
    console.log('user=' + user.id);
    return user;
  }
}
