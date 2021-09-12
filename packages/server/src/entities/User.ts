import bcrypt from 'bcrypt';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  hashedPassword?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  tokenVersion: number;

  async setPassword(password: string) {
    this.hashedPassword = await bcrypt.hash(password, 10);
    return this;
  }

  async checkPassword(password: string) {
    return bcrypt.compare(password, this.hashedPassword!);
  }
}
