/* eslint-disable operator-linebreak */
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';

interface AssetProps {
  uri: string;
  assetWidth: number;
  isSelected: boolean;
  onLongPress: () => void;
  onPress: () => void;
}

const AssetItem: React.FC<AssetProps> = ({
  uri,
  assetWidth,
  isSelected,
  onLongPress,
  onPress,
}) => (
  <View>
    <TouchableWithoutFeedback
      onLongPress={onLongPress}
      onPress={onPress}
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
          width={assetWidth}
          height={assetWidth}
          style={{
            width: assetWidth,
            height: assetWidth,
          }}
        />
        {isSelected && (
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

// eslint-disable-next-line arrow-body-style
export default React.memo(AssetItem, (prev, next) => {
  return (
    prev.uri === next.uri &&
    prev.assetWidth === next.assetWidth &&
    prev.isSelected === next.isSelected &&
    prev.onPress === next.onPress &&
    prev.onLongPress === next.onLongPress
  );
});
