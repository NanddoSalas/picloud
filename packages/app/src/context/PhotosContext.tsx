import { createContext } from 'react';
import usePhotos from '../hooks/usePhotos';

const PhotosContext = createContext<ReturnType<typeof usePhotos>>({
  assets: [],
  fetchMore: () => Promise.resolve(),
  addNewPhotos: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
});

export default PhotosContext;
