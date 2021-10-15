import { ApolloProvider } from '@apollo/client';
import * as MediaLibrary from 'expo-media-library';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';
import client from './client';
import { PicloudContextProvider } from './context/PicloudContext';
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
        <PicloudContextProvider>
          <Navigation />
        </PicloudContextProvider>
      </ApolloProvider>
    </NativeBaseProvider>
  );
};

export default App;
