import { Photo } from '@picloud/controller';
import * as FileSystem from 'expo-file-system';
import { Asset, BackupPayload } from './types';

export const getCachedImageUri = async (id: string, url: string) => {
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

export const getAssetsFromPhotos = async (photos: Photo[]) => {
  const assetsPromise = photos.map<Promise<Asset>>(async ({ id, url }) => ({
    id,
    uri: await getCachedImageUri(id, url),
  }));

  return Promise.all(assetsPromise);
};

export const findInsertionIndex = (
  localId: string,
  payloads: BackupPayload[],
) => {
  if (payloads.length === 0) return 0;

  let start = 0;
  let end = payloads.length - 1;

  while (start <= end) {
    const mid = Math.trunc((end - start) / 2) + start;

    if (payloads[mid].localId === localId) return -1;

    if (payloads[mid].localId < localId) {
      start = mid + 1;
    } else if (payloads[mid].localId > localId) {
      end = mid - 1;
    }
  }

  return start;
};

export const findPayload = (
  localId: string,
  payloads: BackupPayload[],
): [BackupPayload | null, number] => {
  let start = 0;
  let end = payloads.length - 1;

  while (start <= end) {
    const mid = Math.trunc((end - start) / 2) + start;

    if (payloads[mid].localId === localId) return [payloads[mid], mid];

    if (payloads[mid].localId < localId) {
      start = mid + 1;
    } else if (payloads[mid].localId > localId) {
      end = mid - 1;
    }
  }

  return [null, -1];
};

export const clearFileSystem = async () => {
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
