import React from 'react';
import { View } from 'react-native';
import { Photo } from '../types';
import PhotosListItem from './PhotosListItem';

interface PhotosListInterface {
  photos: Photo[];
}

const PhotosList: React.FC<PhotosListInterface> = ({ photos }) => (
  <View
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginRight: -1,
    }}
  >
    {photos.map(({ uri, id }) => (
      <PhotosListItem uri={uri} key={id} />
    ))}
  </View>
);

export default PhotosList;
