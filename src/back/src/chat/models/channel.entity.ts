import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Message } from './message.entity';

@Entity('channel')
export class Channel {

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
