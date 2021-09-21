import React, { useContext } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import FoldersList from '../components/FoldersList';
import GalleryContext from '../context/GalleryContext';

const Gallery = () => {
  const { folders, reload } = useContext(GalleryContext);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={reload} />
        }
      >
        <FoldersList folders={folders} />
      </ScrollView>
    </View>
  );
};

export default Gallery;
