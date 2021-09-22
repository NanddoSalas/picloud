import React, { useState } from 'react';
import { View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { Photo } from '../types';
import PhotosListItem from './PhotosListItem';

interface PhotosListInterface {
  photos: Photo[];
}

const PhotosList: React.FC<PhotosListInterface> = ({ photos }) => {
  const [showImage, setShowImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const handlePress = (i: number) => {
    setImageIndex(i);
    setShowImage(true);
  };

  const handleOnRequestClose = () => setShowImage(false);

  return (
    <View
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginRight: -1,
      }}
    >
      <ImageView
        imageIndex={imageIndex}
        visible={showImage}
        onRequestClose={handleOnRequestClose}
        images={photos}
        presentationStyle="fullScreen"
      />
      {photos.map(({ uri, id }, index) => (
        <PhotosListItem
          uri={uri}
          key={id}
          index={index}
          handlePress={handlePress}
        />
      ))}
    </View>
  );
};
export default PhotosList;
