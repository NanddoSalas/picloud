import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class InputError {
  @Field()
  path: string;

  @Field()
  message: string;
}
