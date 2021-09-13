/* eslint-disable import/no-cycle */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';

@Entity()
@ObjectType()
export default class Photo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Field(() => String)
  url() {
    return `${process.env.BUCKET_URL}/${this.fileName}`;
  }

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.photos)
  owner: Promise<User>;
}
