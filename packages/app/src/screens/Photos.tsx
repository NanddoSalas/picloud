/* eslint-disable operator-linebreak */
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Box } from 'native-base';
import React, { useContext, useLayoutEffect } from 'react';
import ImageView from 'react-native-image-viewing';
import AssetsList from '../components/AssetsList';
import MainHeader from '../components/MainHeader';
import SelectionHeader from '../components/SelectionHeader';
import PhotosContext from '../context/PhotosContext';
import useImageView from '../hooks/useImageView';
import useSelection from '../hooks/useSelection';
import { TabParams } from '../types';

const Photos: React.FC<BottomTabScreenProps<TabParams, 'Photos'>> = ({
  navigation,
}) => {
  const { assets, fetchMore } = useContext(PhotosContext);
  const { isVisible, imageIndex, hiddeImageView, showImageView } =
    useImageView();
  const {
    isSelectionEnabled,
    handleSelection,
    enableSelection,
    selectedItems,
    disableSelection,
  } = useSelection();

  const handleAssetPress = (id: string, index: number) => {
    if (isSelectionEnabled) handleSelection(id);
    else showImageView(index);
  };
  const handleAssetLongPress = (id: string) => {
    Haptics.selectionAsync();
    if (isSelectionEnabled) handleSelection(id);
    else enableSelection(id);
  };

  useLayoutEffect(() => {
    if (isSelectionEnabled) {
      navigation.setOptions({
        header: () => (
          <SelectionHeader
            title=""
            selectedItems={selectedItems}
            isSelectionEnabled={isSelectionEnabled}
            operations={[]}
            onGoBack={() => {}}
            onDisableSelection={disableSelection}
          />
        ),
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        header: () => <MainHeader />,
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [isSelectionEnabled, selectedItems]);

  return (
    <Box>
      <ImageView
        images={assets}
        visible={isVisible}
        imageIndex={imageIndex}
        onRequestClose={hiddeImageView}
      />
      <AssetsList
        assets={assets}
        selectedAssetsId={selectedItems}
        onAssetPress={handleAssetPress}
        onLongAssetPress={handleAssetLongPress}
        onEndReached={() => fetchMore()}
      />
    </Box>
  );
};

export default Photos;
