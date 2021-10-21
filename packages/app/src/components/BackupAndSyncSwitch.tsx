import { HStack, Switch, Text } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { PicloudContext } from '../context/PicloudContext';

interface BackupAndSyncSwitchProps {
  albumId: string;
}

const BackupAndSyncSwitch: React.FC<BackupAndSyncSwitchProps> = ({
  albumId,
}) => {
  const { backedUpAlbums, backupAlbumSwitch } = useContext(PicloudContext);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((x) => !x);
    backupAlbumSwitch(albumId);
  };

  useEffect(() => {
    if (backedUpAlbums.includes(albumId)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, []);

  return (
    <HStack alignItems="center">
      <Text fontSize="xs" color="lightText">
        Backup and Sync
      </Text>
      <Switch
        isChecked={isChecked}
        onToggle={handleToggle}
        mx={2}
        size="lg"
        colorScheme="darkBlue"
      />
    </HStack>
  );
};

export default BackupAndSyncSwitch;
