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
}
