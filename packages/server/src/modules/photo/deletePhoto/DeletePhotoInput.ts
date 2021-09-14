import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class DeletePhotoInput {
  @Field(() => ID)
  id: number;
}
