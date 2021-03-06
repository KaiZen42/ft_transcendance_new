import { JoinColumn, Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/models/user.entity';
import { Channel } from './channel.entity';

@Entity('partecipant')
export class Partecipant {

@PrimaryGeneratedColumn()
id: number;

@ManyToOne(() => User , user => user.id)
userId: number | User;


@Column({ nullable: false })
@ManyToOne(() => Channel , channel => channel.id)
channelId: number; 

@Column()
muted: number; 

@Column()
mod: string;
}
