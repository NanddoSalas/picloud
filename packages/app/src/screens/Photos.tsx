/* eslint-disable operator-linebreak */
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Box } from 'native-base';
import React, { useContext, useLayoutEffect, useState } from 'react';
import ImageView from 'react-native-image-viewing';
import AssetsList from '../components/AssetsList';
import MainHeader from '../components/MainHeader';
import SelectionHeader from '../components/SelectionHeader';
import { PicloudContext } from '../context/PicloudContext';
import useImageView from '../hooks/useImageView';
import useSelection from '../hooks/useSelection';
import { TabParams } from '../types';

const Photos: React.FC<BottomTabScreenProps<TabParams, 'Photos'>> = ({
  navigation,
}) => {
  const { assets, fetchMoreAssets, refreshAssets, deleteAssets } =
    useContext(PicloudContext);
  const [refreshing, setRefreshing] = useState(false);
  const { isVisible, imageIndex, hiddeImageView, showImageView } =
    useImageView();
  const {
    isSelectionEnabled,
    handleSelection,
    enableSelection,
    selectedItems,
    disableSelection,
  } = useSelection();
  const { colors } = useTheme();

  const handleAssetPress = (id: string, index: number) => {
    if (isSelectionEnabled) handleSelection(id);
    else showImageView(index);
  };

  const handleAssetLongPress = (id: string) => {
    Haptics.selectionAsync();
    if (isSelectionEnabled) handleSelection(id);
    else enableSelection(id);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshAssets();
    setRefreshing(false);
  };

  useLayoutEffect(() => {
    if (isSelectionEnabled) {
      navigation.setOptions({
        header: () => (
          <SelectionHeader
            title=""
            selectedItems={selectedItems}
            isSelectionEnabled={isSelectionEnabled}
            operations={[
              {
                name: 'Delete from cloud and device',
                icon: () => (
                  <MaterialIcons name="delete" size={26} color={colors.text} />
                ),
                onPress: async (ids) => deleteAssets(ids),
                position: 'actionsSheet',
              },
            ]}
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
        onEndReached={() => fetchMoreAssets()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </Box>
  );
};

export default Photos;
