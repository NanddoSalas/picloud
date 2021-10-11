/* eslint-disable operator-linebreak */
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Asset } from '../types';

const useAlbum = (albumId: string) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAssets = async () => {
    const { endCursor, hasNextPage, ...props } =
      await MediaLibrary.getAssetsAsync({
        album: albumId,
        mediaType: 'photo',
        after: cursor || undefined,
      });

    setCursor(hasNextPage ? endCursor : '');
    setAssets((current) => {
      const moreAssets = props.assets.map<Asset>(
        ({ id, uri, creationTime }) => ({
          id,
          uri,
          isSelected: false,
          createdAt: creationTime,
        }),
      );

      return [...current, ...moreAssets];
    });
  };

  const loadNextPage = async () => {
    if (cursor && !loading) {
      setLoading(true);
      await getAssets();
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssets();
  }, []);

  useEffect(() => {
    const listener = MediaLibrary.addListener((event) => {
      if (event.hasIncrementalChanges) {
        const { deletedAssets, insertedAssets, updatedAssets } = event;

        if (insertedAssets) {
          setAssets((current) => [...current, ...insertedAssets]);
        } else if (deletedAssets) {
          setAssets((current) => {
            const deletedAssetsId = deletedAssets.map(({ id }) => id);

            const newState = current.filter(
              ({ id }) => !deletedAssetsId.includes(id),
            );

            return newState;
          });
        } else if (updatedAssets) {
          setAssets((current) => {
            const updatedAssetsId = updatedAssets.map(({ id }) => id);

            return current.map((asset) => {
              const index = updatedAssetsId.indexOf(asset.id);

              if (index) return updatedAssets[index];

              return asset;
            });
          });
        }
      } else {
        setAssets([]);
        getAssets();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return { assets, loadNextPage };
};

export default useAlbum;
