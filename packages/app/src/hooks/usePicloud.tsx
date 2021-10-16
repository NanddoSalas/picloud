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
import { Asset, BackedUpAsset } from '../types';

const usePicloud = () => {
  const { data, loading, fetchMore, refetch } = usePhotosQuery({
    notifyOnNetworkStatusChange: true,
    variables: { photosLimit: 8 },
  });
  const [callDeletePhotos] = useDeletePhotosMutation();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  const [upload] = useUploadPhotoMutation();
  const [backedUpAssets, setBackedUpAssets] = useState<BackedUpAsset[]>([]);
  const [pending, setPending] = useState<BackedUpAsset[]>([]);
  const [uploading, setUploading] = useState(false);

  const client = useApolloClient();

  const getCachedImageUri = async (id: string, url: string) => {
    const fileInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory + id}`,
    );

    if (fileInfo.exists) return fileInfo.uri;

    const { uri } = await FileSystem.downloadAsync(
      url,
      `${FileSystem.documentDirectory + id}`,
    );

    return uri;
  };

  const getAssetsFromPhotos = async (photos: Photo[]) => {
    const assetsPromise = photos.map<Promise<Asset>>(async ({ id, url }) => ({
      id,
      uri: await getCachedImageUri(id, url),
    }));

    return Promise.all(assetsPromise);
  };

  const addMorePhotos = async (morePhotos: Photo[], nextCursor: string) => {
    const moreAssets = await getAssetsFromPhotos(morePhotos);

    setAssets((current) => [...current, ...moreAssets]);
    setCursor(nextCursor);
  };

  const addNewPhotos = async (newPhotos: Photo[]) => {
    const newAssets = await getAssetsFromPhotos(newPhotos);

    setAssets((current) => [...newAssets, ...current]);
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

  const loadState = async () => {
    const state = await AsyncStorage.getItem('backedUpPhotos');

    if (state) setBackedUpAssets(JSON.parse(state));
  };

  const saveState = async () => {
    const state = JSON.stringify(backedUpAssets);

    await AsyncStorage.setItem('backedUpPhotos', state);
  };

  const findBackedUpAsset = (
    id: string,
    state: BackedUpAsset[],
  ): BackedUpAsset | null => {
    const len = state.length;
    const mid = Math.trunc(len / 2);

    if (len === 0) return null;

    if (state[mid].localId === id) return state[mid];

    if (state[mid].localId < id) {
      return findBackedUpAsset(id, state.slice(mid + 1));
    }

    if (state[mid].localId > id) {
      return findBackedUpAsset(id, state.slice(0, mid));
    }

    return null;
  };

  const insertBackedUpAssets = (_backedUpAssets: BackedUpAsset[]) => {
    let newBackedUpAssets: BackedUpAsset[];

    setBackedUpAssets((current) => {
      newBackedUpAssets = _backedUpAssets.filter(
        ({ localId }) => findBackedUpAsset(localId, current) === null,
      );

      const newState = [...current, ...newBackedUpAssets];

      return newState.sort();
    });

    setPending((current) => [...current, ...newBackedUpAssets]);
  };

  const updateBackedUpAsset = (newAsset: BackedUpAsset) => {
    setBackedUpAssets((current) => {
      const newState = [...current];

      const index = newState.findIndex(
        ({ localId }) => localId === newAsset.localId,
      );

      newState[index] = newAsset;

      return newState.sort();
    });
  };

  const getLocalIdsFromRemoteIds = (ids: string[]) => {
    const localIds = ids
      .map((id) => backedUpAssets.find(({ remoteId }) => remoteId === id))
      .filter((x) => x !== undefined)
      .map((x) => x!.localId);

    return localIds;
  };

  const handleUpload = async () => {
    const { localId } = pending[0];

    const { uri } = await MediaLibrary.getAssetInfoAsync(localId);

    updateBackedUpAsset({ localId, status: 'UPLOADING', remoteId: null });

    const { data: uploadData } = await upload({
      variables: {
        uploadPhotoInput: {
          file: new ReactNativeFile({ uri, name: '', type: 'image/*' }),
        },
      },
      update: async (cache, res) => {
        const photo = res.data?.uploadPhoto.photo;

        if (photo) {
          await FileSystem.copyAsync({
            from: uri,
            to: `${FileSystem.documentDirectory + photo.id}`,
          });

          await addNewPhotos([photo]);

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

    const remoteId = uploadData?.uploadPhoto.photo?.id;

    if (remoteId) {
      updateBackedUpAsset({ localId, remoteId, status: 'BACKEDUP' });
    } else {
      updateBackedUpAsset({ localId, remoteId: null, status: 'ERROR' });
    }

    setPending((current) => current.slice(1));
    setUploading(false);
  };

  const clearFileSystem = async () => {
    if (FileSystem.documentDirectory) {
      const uris = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory,
      );

      return Promise.all(
        // eslint-disable-next-line arrow-body-style
        uris.map((uri) => {
          return FileSystem.deleteAsync(FileSystem.documentDirectory + uri);
        }),
      );
    }

    return Promise.all([]);
  };

  const fetchMoreAssets = async () => {
    if (cursor) {
      setCursor('');
      await fetchMore({
        variables: { photosCursor: cursor },
        updateQuery: (prev, { fetchMoreResult: more }) => {
          if (more?.photos.photos) {
            const { photos, nextCursor } = more.photos;
            addMorePhotos(photos, nextCursor || '');
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

  const backUpAssets = (ids: string[]) => {
    const newAssets: BackedUpAsset[] = ids.map<BackedUpAsset>((id) => ({
      localId: id,
      remoteId: null,
      status: 'PENDING',
    }));

    insertBackedUpAssets(newAssets);
  };

  const cleanup = async () => {
    setAssets([]);
    setCursor(null);
    setBackedUpAssets([]);
    setPending([]);
    setUploading(false);

    await Promise.all([
      clearFileSystem(),
      AsyncStorage.clear(),
      client.clearStore(),
    ]);
  };

  const deletePhotos = async (ids: string[]) => {
    try {
      const localIds = getLocalIdsFromRemoteIds(ids);

      await MediaLibrary.deleteAssetsAsync(localIds);

      setBackedUpAssets((current) => {
        const newState = current.filter(
          ({ localId }) => !localIds.includes(localId),
        );

        return newState;
      });

      await callDeletePhotos({
        variables: { deletePhotosInput: { ids } },
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

  useEffect(() => {
    main();
  }, [loading]);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [backedUpAssets]);

  useEffect(() => {
    if (pending.length > 0 && !uploading) {
      setUploading(true);
      handleUpload();
    }
  }, [pending, uploading]);

  return {
    assets,
    backedUpAssets,
    fetchMoreAssets,
    refreshAssets,
    backUpAssets,
    cleanup,
    deletePhotos,
  };
};

export default usePicloud;
