import { Field, ObjectType } from 'type-graphql';
import { Photo } from '../../../entities';

@ObjectType()
export default class UploadPhotoPayload {
  @Field(() => Photo, { nullable: true })
  photo?: Photo;
}
