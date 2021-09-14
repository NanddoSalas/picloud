/* eslint-disable @typescript-eslint/indent */
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import Auth from '../../decorators/Auth';
import { Context } from '../../types';
import { validateAndUploadPhoto } from '../../utils';
import { UploadPhotoInput, UploadPhotoPayload } from './uploadPhoto';

@Resolver()
export default class PhotoResolver {
  @Auth()
  @Mutation(() => UploadPhotoPayload)
  async uploadPhoto(
    @Arg('input') { file }: UploadPhotoInput,
    @Ctx() { user }: Context,
  ): Promise<UploadPhotoPayload> {
    const photo = await validateAndUploadPhoto(file, user!);
    return { photo };
  }
}
