import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';

interface AssetProps {
  id: string;
  uri: string;
  index: number;
  minwh: number;
  isSelected: boolean;
  isSelectionEnabled: boolean;
  handleLongPress: (id: string) => void;
  handlePress: (id: string, index: number) => void;
}

const Asset: React.FC<AssetProps> = ({
  id,
  uri,
  index,
  minwh,
  isSelected,
  isSelectionEnabled,
  handleLongPress,
  handlePress,
}) => {
  const { width } = useWindowDimensions();

  const assetsPerLine = Math.trunc(width / minwh);
  const wh = (width - (assetsPerLine - 1)) / assetsPerLine;

  return (
    <View>
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

export default Asset;
