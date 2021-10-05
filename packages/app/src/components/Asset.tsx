import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';

interface AssetProps {
  id: string;
  uri: string;
  index: number;
  assetWidth: number;
  isSelected: boolean;
  isSelectionEnabled: boolean;
  handleLongPress: (id: string) => void;
  handlePress: (id: string, index: number) => void;
}

const Asset: React.FC<AssetProps> = ({
  id,
  uri,
  index,
  assetWidth,
  isSelected,
  isSelectionEnabled,
  handleLongPress,
  handlePress,
}) => (
  <View>
    <TouchableWithoutFeedback
      onLongPress={() => handleLongPress(id)}
      onPress={() => handlePress(id, index)}
      style={{
        width: assetWidth,
        height: assetWidth,
        marginBottom: 1,
        marginRight: 1,
      }}
    >
      <View
        style={{
          width: assetWidth,
          height: assetWidth,
          marginBottom: 1,
          marginRight: 1,
          display: 'flex',
        }}
      >
        <Image
          source={{ uri }}
          style={{
            width: assetWidth,
            height: assetWidth,
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

export default Asset;
