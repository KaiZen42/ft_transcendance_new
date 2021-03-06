import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

//socket
import { ChatModule } from './chat/chat.module';
import { User } from './user/models/user.entity';
import { Message } from './chat/models/message.entity';
import { PongModule } from './game/pong.module';
import { Channel } from './chat/models/channel.entity';
import { Partecipant } from './chat/models/partecipant.entity';
import { Match } from './game/models/match.entity';
import { Relation } from './relation/models/relation.entity';
import { RelationModule } from './relation/relation.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ChatModule,
    PongModule,
    RelationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Message, Channel, Partecipant, Match, Relation],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
