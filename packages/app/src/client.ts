import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import Constants from 'expo-constants';
import { getItemAsync } from 'expo-secure-store';

const httpLink = createUploadLink({
  uri: Constants.manifest?.extra!.GRAPHQL_URI,
});

const authLink = setContext(async (_, { headers }) => {
  const accesToken = await getItemAsync('accesToken');

  return {
    headers: {
      ...headers,
      authorization: accesToken ? `Bearer ${accesToken}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
