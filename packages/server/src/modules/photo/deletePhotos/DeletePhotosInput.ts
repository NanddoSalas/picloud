import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class DeletePhotosInput {
  @Field(() => [ID])
  ids: number[];
}
