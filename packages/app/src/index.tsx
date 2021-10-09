import { ApolloProvider } from '@apollo/client';
import * as MediaLibrary from 'expo-media-library';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';
import client from './client';
import BackupContextProvider from './components/BackupContextProvider';
import PhotosContextProvider from './components/PhotosContextProvider';
import Navigation from './Navigation';

const App = () => {
  useEffect(() => {
    const main = async () => {
      const { accessPrivileges } = await MediaLibrary.getPermissionsAsync();

      if (accessPrivileges !== 'all') MediaLibrary.requestPermissionsAsync();
    };

    main();
  }, []);

  return (
    <NativeBaseProvider>
      <ApolloProvider client={client}>
        <PhotosContextProvider>
          <BackupContextProvider>
            <Navigation />
          </BackupContextProvider>
        </PhotosContextProvider>
      </ApolloProvider>
    </NativeBaseProvider>
  );
};

export default App;
