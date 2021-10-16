/* eslint-disable @typescript-eslint/indent */
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Auth } from '../../decorators';
import { Photo } from '../../entities';
import { Context } from '../../types';
import { validateAndUploadPhoto } from '../../utils';
import { DeletePhotoInput, DeletePhotoPayload } from './deletePhoto';
import { DeletePhotosInput, DeletePhotosPayload } from './deletePhotos';
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

    const nextCursor = photos[photos.length - 1]?.id;

    return { photos, nextCursor };
  }

  @Auth()
  @Mutation(() => DeletePhotoPayload)
  async deletePhoto(
    @Arg('input') { id }: DeletePhotoInput,
    @Ctx() { user }: Context,
  ): Promise<DeletePhotoPayload> {
    const { affected } = await Photo.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .andWhere('ownerId = :userId', { userId: user!.id })
      .execute();

    return { deletedPhotoId: affected ? id : undefined };
  }

  @Auth()
  @Mutation(() => DeletePhotosPayload)
  async deletePhotos(
    @Arg('input') { ids }: DeletePhotosInput,
    @Ctx() { user }: Context,
  ): Promise<DeletePhotosPayload> {
    const { affected } = await Photo.createQueryBuilder()
      .delete()
      .where('id IN (:...ids) ', { ids })
      .andWhere('ownerId = :userId', { userId: user!.id })
      .execute();

    if (affected === ids.length) {
      return { deletedPhotosId: ids };
    }

    // TODO: return affected rows id

    return { deletedPhotosId: [] };
  }
}
