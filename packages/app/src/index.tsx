import { ApolloProvider } from '@apollo/client';
import React from 'react';
import client from './client';
import GalleryContext from './context/GalleryContext';
import useGallery from './hooks/useGallery';
import Navigation from './Navigation';

const App = () => {
  const { folders, getBackground, getPhotos, reload } = useGallery();

  return (
    <ApolloProvider client={client}>
      <GalleryContext.Provider
        value={{ folders, getBackground, getPhotos, reload }}
      >
        <Navigation />
      </GalleryContext.Provider>
    </ApolloProvider>
  );
};

export default App;
