import { ApolloProvider } from '@apollo/client';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import client from './client';
import Navigation from './Navigation';

const App = () => (
  <NativeBaseProvider>
    <ApolloProvider client={client}>
      <Navigation />
    </ApolloProvider>
  </NativeBaseProvider>
);

export default App;
