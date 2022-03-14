import { User } from 'src/user/models/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  REQUESTED = 'REQUESTED',
  FRIENDS = 'FRIENDS',
}

@Entity('relation')
export class Relation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  requesting: number | User;

  @ManyToOne(() => User, (user) => user.id)
  receiving: number | User;

  @Column()
  status: Status;
}
