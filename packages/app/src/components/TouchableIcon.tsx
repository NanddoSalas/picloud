import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableHighlight } from 'react-native';

interface TouchableIconProps {
  onPress: () => void;
  icon: () => React.ReactElement;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({ onPress, icon }) => {
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      underlayColor={colors.border}
      style={{
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 100,
      }}
      onPress={onPress}
    >
      {icon()}
    </TouchableHighlight>
  );
};
export default TouchableIcon;
