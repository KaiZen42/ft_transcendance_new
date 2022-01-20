import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {

  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  avatar: string;
}
