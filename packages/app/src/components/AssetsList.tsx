import React from 'react';
import { FlatList, ListRenderItem, useWindowDimensions } from 'react-native';
import { Asset } from '../types';
import AssetItem from './AssetItem';

interface AssetListProps {
  assets: Asset[];
  selectedAssetsId: string[];
  onAssetPress: (id: string, index: number) => void;
  onLongAssetPress: (id: string) => void;
  onEndReached: () => void;
}
const AssetsList: React.FC<AssetListProps> = ({
  assets,
  selectedAssetsId,
  onAssetPress,
  onLongAssetPress,
  onEndReached,
}) => {
  const { width } = useWindowDimensions();

  const minAssetWidth = 100;

  const assetsPerRow = Math.trunc(width / minAssetWidth);
  const assetsWidth = width - (assetsPerRow - 1);
  const assetWidth = assetsWidth / assetsPerRow;

  const renderItem: ListRenderItem<Asset> = ({ item, index }) => {
    const isSelected = selectedAssetsId.includes(item.id);

    return (
      <AssetItem
        key={item.id}
        uri={item.uri}
        isSelected={isSelected}
        assetWidth={assetWidth}
        onPress={() => onAssetPress(item.id, index)}
        onLongPress={() => onLongAssetPress(item.id)}
      />
    );
  };

  const keyExtractor = ({ id }: Asset) => id;

  const getItemLayout = (_data: Asset[] | null | undefined, index: number) => ({
    length: assetWidth,
    offset: assetWidth * index,
    index,
  });

  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={assetsPerRow}
      getItemLayout={getItemLayout}
      onEndReached={onEndReached}
      extraData={selectedAssetsId}
    />
  );
};

export default AssetsList;
