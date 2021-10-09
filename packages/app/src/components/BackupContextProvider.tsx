import React from 'react';
import BackupContext from '../context/BackupContext';
import useBackup from '../hooks/useBackup';

const BackupContextProvider: React.FC = ({ children }) => {
  const backup = useBackup();

  return (
    <BackupContext.Provider value={backup}>{children}</BackupContext.Provider>
  );
};

export default BackupContextProvider;
