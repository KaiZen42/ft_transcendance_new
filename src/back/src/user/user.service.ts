import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query
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
    return this.userDB.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    return this.userDB.save({
      id : userData.id,
      username: userData.login,
      avatar: userData.image_url
    });
  }

  async update(id: number, userData): Promise<any> {
  
    return this.userDB.update(id, userData);
  }

  async delete(id: number) {
    return this.userDB.delete({ id });
  }

  async login(mycode: string, res: Response): Promise<User> {
      // TDOO: aggiungere valori a .env
    const body: any = {
      "grant_type" : "authorization_code",
		  "client_id" : process.env.CLIENT_ID,
      "client_secret" : process.env.CLIENT_SECRET,
      "code": mycode,
      "redirect_uri" : process.env.REDIRECT_URI
    };
    let response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    });
    let data = await response.json() as any;
    let token: string =  data.access_token;
    response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {'Authorization': 'Bearer '+ token}
    });
    data = await response.json();
    token = await this.jwt.signAsync({ id: data.id });
    res.cookie('token', token, { httpOnly: true });
    const user : User = await this.getById(data.id)
    if (!user)
      return this.create(data);
    else return user;
  }

  async userCookie(cookie): Promise<any> {
    const data = await this.jwt.verifyAsync(cookie);
    return this.userDB.findOne({ id: data['id'] });
  }
}
