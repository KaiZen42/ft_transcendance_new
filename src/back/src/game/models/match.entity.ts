import { User } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("match")
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(()=> User, user=>user.id)
	player1: number | User

	@ManyToOne(()=> User, user=>user.id)
	player2: number | User

	@Column()
	points1: number

	@Column()
	points2: number
}