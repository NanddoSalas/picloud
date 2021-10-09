import React from 'react';
import PhotosContext from '../context/PhotosContext';
import usePhotos from '../hooks/usePhotos';

const PhotosContextProvider: React.FC = ({ children }) => {
  const photos = usePhotos();

  return (
    <PhotosContext.Provider value={photos}>{children}</PhotosContext.Provider>
  );
};

export default PhotosContextProvider;
