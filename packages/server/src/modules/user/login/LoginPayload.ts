import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class LoginPayload {
  @Field({ nullable: true })
  accesToken?: string;
}
