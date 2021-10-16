import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import AppLoading from 'expo-app-loading';
import * as MediaLibrary from 'expo-media-library';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import getClient from './client';
import { PicloudContextProvider } from './context/PicloudContext';
import Navigation from './Navigation';

const App = () => {
  // eslint-disable-next-line operator-linebreak
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    getClient().then((x) => setClient(x));

    const main = async () => {
      const { accessPrivileges } = await MediaLibrary.getPermissionsAsync();

      if (accessPrivileges !== 'all') MediaLibrary.requestPermissionsAsync();
    };

    main();
  }, []);

  if (!client) return <AppLoading />;

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
