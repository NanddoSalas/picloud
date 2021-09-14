import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default class DeletePhotoPayload {
  @Field(() => ID, { nullable: true })
  deletedPhotoId?: number;
}
