import { ApolloProvider } from '@apollo/client';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import client from './client';
import Context from './components/Context';
import Navigation from './Navigation';

const App = () => (
  <NativeBaseProvider>
    <ApolloProvider client={client}>
      <Context>
        <Navigation />
      </Context>
    </ApolloProvider>
  </NativeBaseProvider>
);

export default App;
