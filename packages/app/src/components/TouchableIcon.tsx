import React from 'react';
import { TouchableHighlight } from 'react-native';

interface TouchableIconProps {
  onPress: () => void;
  icon: () => React.ReactElement;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({ onPress, icon }) => (
  <TouchableHighlight
    underlayColor="lightblue"
    style={{ padding: 10, marginHorizontal: 5, borderRadius: 100 }}
    onPress={onPress}
  >
    {icon()}
  </TouchableHighlight>
);

export default TouchableIcon;
