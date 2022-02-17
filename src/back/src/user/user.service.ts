import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import {
  Connection,
  getConnection,
  Repository,
  Like,
  getRepository,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import fetch from 'node-fetch';
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

  async getLeader(): Promise<User[]> {
    return await this.userDB.find({ order: { points: 'DESC' } });
  }

  async getById(id: number): Promise<User> {
    return this.userDB.findOne({ where: { id: id } });
  }

  async getByUsername(username: string): Promise<User[]> {
    return await this.userDB.find({
      where: { username: Like(`${username}%`) },
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userDB.findOne({ where: { email } });
  }

  // async find_image_url(username: string)
  // {
  //   let avatar = `https://cdn.intra.42.fr/users/${username}.`;
  //   let res = await fetch(avatar+"jpeg")
  //   if (res.status === 200)
  //     return (avatar += "jpeg")
  //   res = await fetch(avatar+"jpg")
  //   if (res.status === 200)
  //     return (avatar += "jpg")
  //   res = await fetch(avatar+"png")
  //   if (res.status === 200)
  //     return (avatar += "png")
  //   return ("")
  // }

  async create(userData: CreateUserDto): Promise<User> {
    //const avatar = await this.find_image_url(userData.login)

    return this.userDB.save({
      id: userData.id,
      username: userData.login,
      avatar: userData.image_url,
      two_fa_auth: false,
      points: 0,
      wins: 0,
      losses: 0,
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

    const user: User = await this.getById(data.id);
    token = await this.jwt.signAsync({
      id: data.id,
      two_fa: user ? user.two_fa_auth : false,
    });
    res.cookie('token', token, { httpOnly: true });
    if (!user) return this.create(data);
    else return user;
  }

  async userCookie(cookie): Promise<any> {
    const data = await this.jwt.verifyAsync(cookie);
    const user = await this.getById(data['id']);
    return user;
  }
}
