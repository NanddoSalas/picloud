import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class UploadPhotoInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
