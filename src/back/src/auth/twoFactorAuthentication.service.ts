import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';


@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UserService,
  ) {}

  public async generatetwoFaAuthSecret(id: number) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      'Transcendence',
      process.env.TWO_FA_AUTH_APP_NAME,
      secret,
    );
    await this.userService.settwoFaAuthSecret(secret, id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public checkTwoFaAuthCode(twoFaAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFaAuthCode,
      secret: user.twoFaAuthSecret,
    });
  }

  // public getCookieWithJwtAccessToken(id: number, two_fa_auth = false) {
  //   const payload: Token = { id, two_fa_auth };
  //   const token = this.jwtService.sign(payload, {
  //     secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  //     expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
  //   });
  //   return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  // }
}
