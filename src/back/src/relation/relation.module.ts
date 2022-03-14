import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './models/relation.entity';
import { RelationController } from './relation.controller';
import { RelationService } from './relation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relation])],
  providers: [RelationService],
  controllers: [RelationController],
  exports: [RelationService],
})
export class RelationModule {}
