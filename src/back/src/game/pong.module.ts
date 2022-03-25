import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match } from './models/match.entity';
import PongGateway from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Match, User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MatchController],
  providers: [PongGateway, PongService, MatchService],
})
export class PongModule {}
