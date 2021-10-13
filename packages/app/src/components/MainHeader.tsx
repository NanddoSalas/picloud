import { useApolloClient } from '@apollo/client';
import { MaterialIcons } from '@expo/vector-icons';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';
import { setItemAsync } from 'expo-secure-store';
import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableIcon from './TouchableIcon';

interface MainHeaderProps {
  title?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const client = useApolloClient();
  const headerHeight = getDefaultHeaderHeight(
    { height, width },
    false,
    Constants.statusBarHeight,
  );

  return (
    <View
      style={{
        height: headerHeight,
        paddingTop: insets.top,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        backgroundColor: colors.card,
      }}
    >
      <Text style={{ fontSize: 20, color: colors.text }}>{title}</Text>
      <TouchableIcon
        icon={() => (
          <MaterialIcons name="logout" size={24} color={colors.text} />
        )}
        onPress={() => {
          setItemAsync('accesToken', '');
          client.refetchQueries({ include: ['Me'] });
        }}
      />
    </View>
  );
};

MainHeader.defaultProps = {
  title: 'Picloud',
};

export default MainHeader;
