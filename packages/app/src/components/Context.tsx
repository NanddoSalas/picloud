import * as MediaLibrary from 'expo-media-library';
import React, { useEffect } from 'react';
import BackupContext from '../context/BackupContext';
import useBackup from '../hooks/useBackup';

const Context: React.FC = ({ children }) => {
  const backup = useBackup();

  useEffect(() => {
    const main = async () => {
      const { accessPrivileges } = await MediaLibrary.getPermissionsAsync();

      if (accessPrivileges !== 'all') MediaLibrary.requestPermissionsAsync();
    };

    main();
  }, []);

  return (
    <BackupContext.Provider value={backup}>{children}</BackupContext.Provider>
  );
};

export default Context;
