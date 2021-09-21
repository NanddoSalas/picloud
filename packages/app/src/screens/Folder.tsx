import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import PhotosList from '../components/PhotosList';
import GalleryContext from '../context/GalleryContext';
import { StackParams } from '../types';

const Folder: React.FC<NativeStackScreenProps<StackParams, 'Folder'>> = ({
  route,
  navigation,
}) => {
  const { getPhotos } = useContext(GalleryContext);
  const { name } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  const photos = getPhotos(name);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <PhotosList photos={photos} />
      </ScrollView>
    </View>
  );
};
export default Folder;
