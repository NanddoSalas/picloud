/* eslint-disable object-curly-newline */
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Photo } from '../types';

interface GalleryInterface {
  [folderName: string]: Photo[];
}

const getFolderName = (uri: string) => {
  const folderName = uri.match('[^,/]+[/][^,/]+$')?.toString().split('/')[0];

  return folderName as string;
};

const useGallery = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryInterface>({});

  const insertFolder = (folderName: string) => {
    setFolders((currentFolders) => {
      if (currentFolders.indexOf(folderName) === -1) {
        return [...currentFolders, folderName];
      }
      return currentFolders;
    });
  };

  const insertAssets = (assets: MediaLibrary.Asset[]) => {
    // eslint-disable-next-line object-curly-newline
    assets.forEach(({ id, filename, uri, creationTime }) => {
      const folderName = getFolderName(uri);

      setGallery((currentGallery) => {
        const newGallery = { ...currentGallery };

        if (!newGallery[folderName]) newGallery[folderName] = [];

        newGallery[folderName].push({
          creationTime,
          filename,
          id,
          uri,
        });

        return newGallery;
      });

      insertFolder(folderName);
    });
  };

  const main = async (cursor?: string) => {
    // eslint-disable-next-line operator-linebreak
    const { assets, hasNextPage, endCursor } =
      await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: 'creationTime',
        after: cursor,
      });

    insertAssets(assets);

    if (hasNextPage) main(endCursor);
  };

  const getPhotos = (folderName: string) => gallery[folderName];

  const getBackground = (folderName: string) => {
    const photos = gallery[folderName];
    return photos[0].uri;
  };

  const reload = () => {
    setFolders([]);
    setGallery({});
    main();
  };

  useEffect(() => {
    main();
  }, []);

  return { folders, getPhotos, getBackground, reload };
};

export default useGallery;
