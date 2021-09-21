/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { useMeQuery } from '@picloud/controller';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import React from 'react';
import AccountButton from './components/AccountButton';
import { Account, Folder, Gallery, Login, Photos, Signup } from './screens';
import { StackParams, TabParams } from './types';

const Stack = createNativeStackNavigator<StackParams>();
const Tab = createBottomTabNavigator<TabParams>();

const Main = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Photos" component={Photos} />
    <Tab.Screen name="Gallery" component={Gallery} />
  </Tab.Navigator>
);

const Navigation = () => {
  const { data, loading } = useMeQuery();

  if (loading) return <AppLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!data?.me ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ headerRight: () => <AccountButton /> }}
            />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Folder" component={Folder} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
