import { MaterialIcons } from '@expo/vector-icons';
import { useMeQuery } from '@picloud/controller';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import React from 'react';
import MainHeader from './components/MainHeader';
import { Album, Gallery, Login, Photos, Signup } from './screens';
import { StackParams, TabParams } from './types';

const Stack = createNativeStackNavigator<StackParams>();
const Tab = createBottomTabNavigator<TabParams>();

const Main = () => (
  <Tab.Navigator screenOptions={{ header: () => <MainHeader /> }}>
    <Tab.Screen
      name="Photos"
      component={Photos}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="photo" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Gallery"
      component={Gallery}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="photo-library" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Navigation = () => {
  const { data, loading } = useMeQuery();

  if (loading) return <AppLoading />;

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
        }}
      >
        {!data?.me ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={Main}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Album" component={Album} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
