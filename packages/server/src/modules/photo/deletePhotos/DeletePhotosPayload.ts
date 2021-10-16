import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default class DeletePhotosPayload {
  @Field(() => [ID], { nullable: true })
  deletedPhotosId?: number[];
}
