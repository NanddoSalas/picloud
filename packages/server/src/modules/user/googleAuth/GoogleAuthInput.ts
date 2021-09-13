import { Field, InputType } from 'type-graphql';

@InputType()
export default class GoogleAuthInput {
  @Field()
  idToken: string;
}
