import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('channels')
export class Channels {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mode: string;

  @Column()
  pass: string;

  @Column()
  isPrivate: boolean;
}
