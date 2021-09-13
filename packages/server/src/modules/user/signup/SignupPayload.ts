import { Field, ObjectType } from 'type-graphql';
import { User } from '../../../entities';
import { InputError } from '../../../objectTypes';

@ObjectType()
export default class SignupPayload {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [InputError], { nullable: true })
  inputErrors?: InputError[];
}
