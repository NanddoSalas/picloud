import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { PhotoId } from '../types';

interface SelectableImageProps {
  handleLongPress: (id: PhotoId) => void;
  handlePress: (id: PhotoId, index: number) => void;
  isSelectionEnabled: boolean;
  isSelected: boolean;
  index: number;
  minWH: number;
  uri: string;
  id: PhotoId;
}

const SelectableImage: React.FC<SelectableImageProps> = ({
  handleLongPress,
  handlePress,
  id,
  index,
  isSelected,
  isSelectionEnabled,
  minWH,
  uri,
}) => {
  const { width } = useWindowDimensions();

  const imagesPerLine = Math.trunc(width / minWH);
  const wh = (width - (imagesPerLine - 1)) / imagesPerLine;

  return (
    <View key={id}>
      <TouchableWithoutFeedback
        onLongPress={() => handleLongPress(id)}
        onPress={() => handlePress(id, index)}
        style={{
          width: wh,
          height: wh,
          marginBottom: 1,
          marginRight: 1,
        }}
      >
        <View
          style={{
            width: wh,
            height: wh,
            marginBottom: 1,
            marginRight: 1,
            display: 'flex',
          }}
        >
          <Image
            source={{ uri }}
            style={{
              width: wh,
              height: wh,
            }}
          />
          {isSelectionEnabled && (
            <Feather
              name={isSelected ? 'check-circle' : 'circle'}
              size={24}
              color={isSelected ? 'black' : 'gray'}
              style={{ position: 'absolute', margin: 5 }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SelectableImage;
