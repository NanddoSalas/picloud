import React, { createContext } from 'react';
import usePicloud from '../hooks/usePicloud';

export const PicloudContext = createContext<ReturnType<typeof usePicloud>>({
  assets: [],
  backupPayloads: [],
  fetchMoreAssets: () => Promise.resolve(),
  refreshAssets: () => Promise.resolve(),
  backupAssets: () => null,
  deleteAssets: () => Promise.resolve(),
  cleanup: () => Promise.resolve(),
});

export const PicloudContextProvider: React.FC = ({ children }) => {
  const picloud = usePicloud();

  return (
    <PicloudContext.Provider value={picloud}>
      {children}
    </PicloudContext.Provider>
  );
};
