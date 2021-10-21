import { makeReference, Reference, useApolloClient } from '@apollo/client';
import {
  Photo,
  useDeletePhotosMutation,
  usePhotosQuery,
  useUploadPhotoMutation,
} from '@picloud/controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNativeFile } from 'apollo-upload-client';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Asset, BackupPayload } from '../types';
import {
  clearFileSystem,
  findInsertionIndex,
  findPayload,
  getAssetsFromPhotos,
} from '../utils';

const usePicloud = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [backupPayloads, setBackupPayloads] = useState<BackupPayload[]>([]);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const client = useApolloClient();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhotos] = useDeletePhotosMutation();
  const { data, loading, fetchMore, refetch } = usePhotosQuery({
    notifyOnNetworkStatusChange: true,
    variables: { photosLimit: 8 },
  });

  // state utilities

  const addMoreAssets = async (photos: Photo[], nextCursor: string) => {
    const moreAssets = await getAssetsFromPhotos(photos);

    setAssets((current) => [...current, ...moreAssets]);
    setCursor(nextCursor);
  };

  const addNewAssets = async (photos: Photo[]) => {
    const newAssets = await getAssetsFromPhotos(photos);

    setAssets((current) => [...newAssets, ...current]);
  };

  const insertPayload = (payload: BackupPayload) => {
    setBackupPayloads((current) => {
      const index = findInsertionIndex(payload.localId, current);

      if (index === -1) return current;

      return [
        ...current.slice(0, index),
        payload,
        ...current.slice(index, current.length),
      ];
    });
  };

  const deletePayload = (localId: string) => {
    setBackupPayloads((current) => {
      const [payload, index] = findPayload(localId, current);

      if (!payload) return current;

      return [
        ...current.slice(0, index),
        ...current.slice(index + 1, current.length),
      ];
    });
  };

  const getLocalIdsFromRemoteIds = (remoteIds: string[]) => {
    const localIds = remoteIds
      .map((id) => backupPayloads.find(({ remoteId }) => remoteId === id))
      .filter((x) => x !== undefined)
      .map((x) => x!.localId);

    return localIds;
  };

  // returned functions

  const fetchMoreAssets = async () => {
    if (cursor) {
      setCursor('');
      await fetchMore({
        variables: { photosCursor: cursor },
        updateQuery: (prev, { fetchMoreResult: more }) => {
          if (more?.photos.photos) {
            const { photos, nextCursor } = more.photos;
            addMoreAssets(photos, nextCursor || '');
          }

          return {
            ...prev,
            photos: {
              ...prev.photos,
              nextCursor: more?.photos.nextCursor,
              photos: [...prev.photos.photos!, ...(more?.photos.photos || [])],
            },
          };
        },
      });
    }
  };

  const refreshAssets = async () => {
    await refetch();
  };

  const backupAssets = (localIds: string[]) => {
    const ids = localIds.filter(
      (localId) => findPayload(localId, backupPayloads)[0] === null,
    );

    if (ids.length > 0) {
      setUploadQueue((current) => [...current, ...ids]);
    }
  };

  const deleteAssets = async (remoteIds: string[]) => {
    try {
      const localIds = getLocalIdsFromRemoteIds(remoteIds);

      await MediaLibrary.deleteAssetsAsync(localIds).then(() => {
        localIds.forEach((localId) => deletePayload(localId));
      });

      await deletePhotos({
        variables: { deletePhotosInput: { ids: remoteIds } },
        update: (cache, res) => {
          const deletedPhotosId = res.data?.deletePhotos.deletedPhotosId || [];

          if (deletedPhotosId.length > 0) {
            setAssets((current) => {
              const newState = current.filter(
                ({ id }) => !deletedPhotosId.includes(id),
              );

              return newState;
            });

            cache.modify({
              fields: {
                photos: (currentCache, { readField }) => {
                  const newCache = {
                    ...currentCache,
                    photos: (currentCache.photos as Array<Reference>).filter(
                      (photoRef) => {
                        const photoId = readField<string>('id', photoRef);

                        return !deletedPhotosId.includes(photoId!);
                      },
                    ),
                  };

                  return newCache;
                },
              },
              broadcast: false,
            });
          }
        },
      });
    } catch (error) {
      // TODO: error handling
    }
  };

  const cleanup = async () => {
    setAssets([]);
    setCursor(null);
    setBackupPayloads([]);
    setUploadQueue([]);
    setUploading(false);

    await Promise.all([clearFileSystem(), client.clearStore()]);
  };

  // effect handlers

  const init = async () => {
    const backupPayloadsItem = await AsyncStorage.getItem('backupPayloads');

    if (backupPayloadsItem) {
      const state = JSON.parse(backupPayloadsItem);
      setBackupPayloads(state);
    }

    setHasLoaded(true);
  };

  const main = async () => {
    if (!loading && data) {
      const { photos, nextCursor } = data.photos;

      if (photos) {
        setAssets(await getAssetsFromPhotos(photos));
      } else {
        setAssets([]);
      }

      setCursor(nextCursor || null);
    }
  };

  const handleUpload = async () => {
    const localId = uploadQueue[0];

    const [payload] = findPayload(localId, backupPayloads);

    if (payload) {
      setUploading(false);
      setUploadQueue((current) => current.slice(1));
      return;
    }

    const { uri } = await MediaLibrary.getAssetInfoAsync(localId);

    await uploadPhoto({
      variables: {
        uploadPhotoInput: {
          file: new ReactNativeFile({ uri, name: '', type: 'image/*' }),
        },
      },
      update: async (cache, res) => {
        const photo = res.data?.uploadPhoto.photo;

        if (photo) {
          insertPayload({ localId, remoteId: photo.id });

          await FileSystem.copyAsync({
            from: uri,
            to: `${FileSystem.documentDirectory + photo.id}`,
          });

          await addNewAssets([photo]);

          cache.modify({
            fields: {
              photos: (currentCache) => {
                const photoRef = cache.identify(photo);
                if (photoRef) {
                  const newCache = {
                    ...currentCache,
                    photos: [
                      makeReference(photoRef),
                      ...(currentCache.photos || []),
                    ],
                  };

                  return newCache;
                }
                return currentCache;
              },
            },
            broadcast: false,
          });
        }
      },
    });

    setUploading(false);
    setUploadQueue((current) => current.slice(1));
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    main();
  }, [loading]);

  useEffect(() => {
    if (hasLoaded) {
      AsyncStorage.setItem('backupPayloads', JSON.stringify(backupPayloads));
    }
  }, [backupPayloads]);

  useEffect(() => {
    if (uploadQueue.length > 0 && !uploading) {
      setUploading(true);
      handleUpload();
    }
  }, [uploadQueue]);

  return {
    assets,
    backupPayloads,
    fetchMoreAssets,
    refreshAssets,
    backupAssets,
    deleteAssets,
    cleanup,
  };
};

export default usePicloud;
