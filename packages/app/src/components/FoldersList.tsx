import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import FoldersListItem from './FoldersListItem';

interface FoldersListProps {
  folders: string[];
}

const FoldersList: React.FC<FoldersListProps> = ({ folders }) => {
  const { width } = useWindowDimensions();

  const foldersPerWidth = Math.trunc(width / 150);
  const foldersWidth = foldersPerWidth * 150;
  const totalMargin = width - foldersWidth;
  const padding = totalMargin / (foldersPerWidth + 1) / 2;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding,
      }}
    >
      {folders.map((folderName) => (
        <FoldersListItem key={folderName} name={folderName} />
      ))}
    </View>
  );
};

export default FoldersList;
