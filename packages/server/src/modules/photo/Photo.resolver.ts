/* eslint-disable @typescript-eslint/indent */
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import Auth from '../../decorators/Auth';
import { Photo } from '../../entities';
import { Context } from '../../types';
import { validateAndUploadPhoto } from '../../utils';
import PhotosArgs from './photos/PhotosArgs';
import PhotosPayload from './photos/PhotosPayload';
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

  @Auth()
  @Query(() => PhotosPayload)
  async photos(
    @Args() { limit, cursor }: PhotosArgs,
    @Ctx() { user }: Context,
  ): Promise<PhotosPayload> {
    const query = Photo.createQueryBuilder('photo').where(
      'photo.ownerId = :userId',
      { userId: user!.id },
    );

    if (cursor) query.andWhere('photo.id < :cursor', { cursor });

    query.orderBy('photo.id', 'DESC').take(limit);

    const photos = await query.getMany();
    const nextCursor = photos[photos.length - 1].id;

    return { photos, nextCursor };
  }
}
