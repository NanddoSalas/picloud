import { createContext } from 'react';
import useBackup from '../hooks/useBackup';

const BackupContext = createContext<ReturnType<typeof useBackup>>({
  backedUpAssets: [],
  backUpAssets: () => null,
  findBackedUpAsset: () => null,
});

export default BackupContext;
