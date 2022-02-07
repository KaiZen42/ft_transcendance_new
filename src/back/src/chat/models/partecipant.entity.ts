import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/models/user.entity';
import { Channels } from './channel.entity';


export class Partecipant {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(() => User , user => user.id)
userId: number;

/* @ManyToOne(() => Channels , channel => channel.id)
channelId: number; */

@Column()
muted: number; 

@Column()
mod: string;
}
