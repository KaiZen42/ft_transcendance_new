import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { JwtService } from "@nestjs/jwt";
import { LoginUsreDto } from 'src/user/dto/login-user.dto';
import { Token } from './token.interface';


@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    
  ) {}
 
  
  public async generatetwoFaAuthSecret(user) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, process.env.TWO_FA_AUTH_APP_NAME, secret);
    console.log(otpauthUrl);
    await this.userService.settwoFaAuthSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public checkTwoFaAuthCode(twoFaAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFaAuthCode,
      secret: user.twoFaAuthSecret
    })
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: any = this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET
    });
    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }

  public getCookieWithJwtAccessToken(id: number, two_fa_auth = false) {
    const payload: Token = { id, two_fa_auth };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }
}