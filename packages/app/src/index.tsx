import { ApolloProvider } from '@apollo/client';
import React from 'react';
import client from './client';
import Navigation from './Navigation';

const App = () => (
  <ApolloProvider client={client}>
    <Navigation />
  </ApolloProvider>
);

export default App;
