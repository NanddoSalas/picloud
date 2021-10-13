import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { Box } from 'native-base';
import React, { useContext, useLayoutEffect } from 'react';
import ImageView from 'react-native-image-viewing';
import AssetsList from '../components/AssetsList';
import SelectionHeader from '../components/SelectionHeader';
import BackupContext from '../context/BackupContext';
import useAlbum from '../hooks/useAlbum';
import useImageView from '../hooks/useImageView';
import useSelection from '../hooks/useSelection';
import { StackParams } from '../types';

const Album: React.FC<NativeStackScreenProps<StackParams, 'Album'>> = ({
  route,
  navigation,
}) => {
  const { colors } = useTheme();
  const { albumId, albumName } = route.params;
  const { assets, loadNextPage } = useAlbum(albumId);
  const { backUpAssets } = useContext(BackupContext);
  const {
    isSelectionEnabled,
    selectedItems,
    handleSelection,
    enableSelection,
    disableSelection,
    selectAll,
  } = useSelection();
  // eslint-disable-next-line operator-linebreak
  const { isVisible, imageIndex, showImageView, hiddeImageView } =
    useImageView();

  const handleAssetPress = (id: string, index: number) => {
    if (isSelectionEnabled) handleSelection(id);
    else showImageView(index);
  };

  const handleAssetLongPress = (id: string) => {
    Haptics.selectionAsync();
    if (!isSelectionEnabled) enableSelection(id);
    else handleSelection(id);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SelectionHeader
          title={albumName}
          selectedItems={selectedItems}
          isSelectionEnabled={isSelectionEnabled}
          operations={[
            {
              name: 'Select All',
              icon: () => (
                <MaterialIcons
                  name="select-all"
                  size={26}
                  color={colors.text}
                />
              ),
              onPress: () => selectAll(assets.map(({ id }) => id)),
              position: 'header',
            },
            {
              name: 'Buck Up',
              icon: () => (
                <MaterialIcons name="backup" size={26} color={colors.text} />
              ),
              onPress: (ids) => backUpAssets(ids),
              position: 'actionsSheet',
            },
            {
              name: 'Delete from device',
              icon: () => (
                <MaterialIcons name="delete" size={26} color={colors.text} />
              ),
              onPress: async (ids) => MediaLibrary.deleteAssetsAsync(ids),
              position: 'actionsSheet',
            },
          ]}
          // eslint-disable-next-line react/prop-types
          onGoBack={navigation.goBack}
          onDisableSelection={disableSelection}
        />
      ),
    });
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
        onEndReached={() => loadNextPage()}
      />
    </Box>
  );
};

export default Album;
