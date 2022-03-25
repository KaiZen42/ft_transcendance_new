import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  providers: [TwoFactorAuthenticationService],
  controllers: [AuthController],
  exports: [TwoFactorAuthenticationService],
})
export class AuthModule {}
