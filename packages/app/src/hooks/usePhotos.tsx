/* eslint-disable @typescript-eslint/indent */
import { Photo, usePhotosQuery } from '@picloud/controller';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

type Asset = {
  id: string;
  uri: string;
};

const usePhotos = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, loading, fetchMore } = usePhotosQuery({
    notifyOnNetworkStatusChange: true,
    variables: { photosLimit: 8 },
  });

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

  // TODO
  // const deletePhotos = async () => {};

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

  const enhancedFetchMore = async () => {
    if (cursor) {
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

  useEffect(() => {
    main();
  }, [loading]);

  return { assets, fetchMore: enhancedFetchMore, addNewPhotos };
};

export default usePhotos;
