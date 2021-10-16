import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUploadLink } from 'apollo-upload-client';
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';
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

const cache = new InMemoryCache();

const getClient = async () => {
  await persistCache({
    cache,

    storage: new AsyncStorageWrapper(AsyncStorage),
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
};

export default getClient;
