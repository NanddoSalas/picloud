import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class GoogleAuthPayload {
  @Field({ nullable: true })
  accesToken?: string;
}
