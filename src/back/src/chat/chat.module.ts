import { Module } from '@nestjs/common';
import { EventsGateway } from './chat.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}

