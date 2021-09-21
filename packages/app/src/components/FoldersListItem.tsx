import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from 'react-native';
import GalleryContext from '../context/GalleryContext';
import { StackParams } from '../types';

interface FoldersListItemProps {
  name: string;
}

const FoldersListItem: React.FC<FoldersListItemProps> = ({ name }) => {
  const { getBackground } = useContext(GalleryContext);
  const navigation = useNavigation<NavigationProp<StackParams>>();

  const { width } = useWindowDimensions();
  const uri = getBackground(name);

  const folders = Math.trunc(width / 150);
  const foldersWidth = folders * 150;
  const totalMargin = width - foldersWidth;
  const margin = totalMargin / (folders + 1) / 2;

  return (
    <View style={{ margin }}>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor="#000000"
        onPress={() => navigation.navigate('Folder', { name })}
        style={{ borderRadius: 10 }}
      >
        <Image
          source={{ uri }}
          style={{ width: 150, height: 150, borderRadius: 10 }}
        />
      </TouchableHighlight>
      <Text>{name}</Text>
    </View>
  );
};

export default FoldersListItem;
