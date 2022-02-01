import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {

  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  avatar: string;

  @Column()
  two_fa_auth: boolean;
  
  @Column({ nullable: true })
  public twoFaAuthSecret?: string;
}
