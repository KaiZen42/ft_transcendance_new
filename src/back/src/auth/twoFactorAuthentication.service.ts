import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly userService: UserService,
    
    
  ) {}
 
  
  public async generateTwoFactorAuthenticationSecret(user) {
    const secret = authenticator.generateSecret();
    console.log(user)
 
    const otpauthUrl = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
 
    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}