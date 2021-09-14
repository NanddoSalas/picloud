import { Field, ID, ObjectType } from 'type-graphql';
import { Photo } from '../../../entities';

@ObjectType()
export default class PhotosPayload {
  @Field(() => [Photo], { nullable: true })
  photos?: Photo[];

  @Field(() => ID, { nullable: true })
  nextCursor?: number;
}
