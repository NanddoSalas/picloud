import { useUploadPhotoMutation } from '@picloud/controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNativeFile } from 'apollo-upload-client';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';

type BackedUpAssetStatus = 'PENDING' | 'UPLOADING' | 'BACKEDUP' | 'ERROR';

type BackedUpAsset = {
  localId: string;
  remoteId: string | null;
  status: BackedUpAssetStatus;
};

const useBackup = () => {
  const [upload] = useUploadPhotoMutation();
  const [backedUpAssets, setBackedUpAssets] = useState<BackedUpAsset[]>([]);
  const [pending, setPending] = useState<BackedUpAsset[]>([]);
  const [uploading, setUploading] = useState(false);

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

  const insertBackedUpAssets = (assets: BackedUpAsset[]) => {
    let newAssets: BackedUpAsset[];

    setBackedUpAssets((current) => {
      newAssets = assets.filter(
        ({ localId }) => findBackedUpAsset(localId, current) === null,
      );

      const newState = [...current, ...newAssets];

      return newState.sort();
    });

    setPending((current) => [...current, ...newAssets]);
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

  const handleUpload = async () => {
    const { localId } = pending[0];

    const { uri } = await MediaLibrary.getAssetInfoAsync(localId);

    updateBackedUpAsset({ localId, status: 'UPLOADING', remoteId: null });

    const { data } = await upload({
      variables: {
        uploadPhotoInput: {
          file: new ReactNativeFile({ uri, name: '', type: 'image/*' }),
        },
      },
    });

    const remoteId = data?.uploadPhoto.photo?.id;

    if (remoteId) {
      updateBackedUpAsset({ localId, remoteId, status: 'BACKEDUP' });
    } else {
      updateBackedUpAsset({ localId, remoteId: null, status: 'ERROR' });
    }

    setPending((current) => current.slice(1));
    setUploading(false);
  };

  const backUpAssets = (ids: string[]) => {
    const newAssets: BackedUpAsset[] = ids.map<BackedUpAsset>((id) => ({
      localId: id,
      remoteId: null,
      status: 'PENDING',
    }));

    insertBackedUpAssets(newAssets);
  };

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

  return { backedUpAssets, backUpAssets, findBackedUpAsset };
};

export default useBackup;
