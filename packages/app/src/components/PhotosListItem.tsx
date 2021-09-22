import React from 'react';
import {
  Image,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from 'react-native';

interface PhotosListItemProps {
  uri: string;
  index: number;
  handlePress: (i: number) => void;
}

const PhotosListItem: React.FC<PhotosListItemProps> = ({
  uri,
  handlePress,
  index,
}) => {
  const { width } = useWindowDimensions();

  const imagesPerLine = Math.trunc(width / 100);
  const wh = (width - (imagesPerLine - 1)) / imagesPerLine;

  return (
    <View>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor="#000000"
        onPress={() => handlePress(index)}
        style={{ width: wh, height: wh, marginBottom: 1, marginRight: 1 }}
      >
        <Image source={{ uri }} style={{ width: wh, height: wh }} />
      </TouchableHighlight>
    </View>
  );
};

export default PhotosListItem;