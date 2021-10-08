import { useApolloClient } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteAsync,
  documentDirectory,
  readDirectoryAsync,
} from 'expo-file-system';
import useBackup from './useBackup';

const useCleanup = () => {
  const client = useApolloClient();
  const { cleanup: cleanupBackupState } = useBackup();

  const cleanupFileSystem = async () => {
    if (documentDirectory) {
      const uris = await readDirectoryAsync(documentDirectory);

      return Promise.all(
        uris.map((uri) => deleteAsync(documentDirectory + uri)),
      );
    }

    return Promise.all([]);
  };

  const cleanupAsyncStorage = async () => {
    cleanupBackupState();
    await AsyncStorage.removeItem('backedUpPhotos');
  };

  const cleanupApolloCache = async () => client.clearStore();

  const cleanup = async () => {
    await Promise.all([
      cleanupFileSystem(),
      cleanupAsyncStorage(),
      cleanupApolloCache(),
    ]);
  };

  return cleanup;
};

export default useCleanup;
