import { ArgsType, Field, ID, Int } from 'type-graphql';

@ArgsType()
export default class PhotosArgs {
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit: number;

  @Field(() => ID, { nullable: true })
  cursor: number;
}
