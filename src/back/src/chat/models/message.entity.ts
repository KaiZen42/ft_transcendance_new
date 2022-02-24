import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/models/user.entity';
import { Channel } from './channel.entity';

@Entity("message")
export class Message {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User , user => user.id)
	userId: number;

	@ManyToOne(() => Channel , channel => channel.id)
	channelId: number;

	@Column()
	data: string; 

	@Column()
	sendDate: Date;

}
