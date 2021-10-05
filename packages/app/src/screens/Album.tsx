import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { Box } from 'native-base';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import ImageView from 'react-native-image-viewing';
import Asset from '../components/Asset';
import SelectionHeader from '../components/SelectionHeader';
import BackupContext from '../context/BackupContext';
import useImageView from '../hooks/useImageView';
import useSelection from '../hooks/useSelection';
import { StackParams } from '../types';

const Album: React.FC<NativeStackScreenProps<StackParams, 'Album'>> = ({
  route,
  navigation,
}) => {
  const { colors } = useTheme();
  const { albumId, albumName } = route.params;
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const { width } = useWindowDimensions();
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

  useEffect(() => {
    const getAssets = async (cursor?: string) => {
      const pageInfo = await MediaLibrary.getAssetsAsync({
        album: albumId,
        mediaType: 'photo',
        after: cursor,
      });

      setAssets((current) => [...current, ...pageInfo.assets]);

      if (pageInfo.hasNextPage) getAssets(pageInfo.endCursor);
    };

    getAssets();

    const listener = MediaLibrary.addListener(
      ({
        hasIncrementalChanges,
        deletedAssets,
        insertedAssets,
        updatedAssets,
      }) => {
        if (hasIncrementalChanges) {
          if (insertedAssets) {
            setAssets((current) => [...current, ...insertedAssets]);
          } else if (deletedAssets) {
            setAssets((current) => {
              const deletedAssetsId = deletedAssets.map(({ id }) => id);

              const newState = current.filter(
                ({ id }) => !deletedAssetsId.includes(id),
              );

              return newState;
            });
          } else if (updatedAssets) {
            setAssets((current) => {
              const updatedAssetsId = updatedAssets.map(({ id }) => id);

              return current.map((asset) => {
                const index = updatedAssetsId.indexOf(asset.id);

                if (index) return updatedAssets[index];

                return asset;
              });
            });
          }
        } else {
          setAssets([]);
          getAssets();
        }
      },
    );

    return listener.remove;
  }, []);

  const handlePress = (id: string, index: number) => {
    if (isSelectionEnabled) handleSelection(id);
    else showImageView(index);
  };

  const handleLongPress = (id: string) => {
    if (!isSelectionEnabled) enableSelection(id);
    else handleSelection(id);
    Haptics.selectionAsync();
  };

  const minAssetWidth = 100;

  const assetsPerRow = Math.trunc(width / minAssetWidth);
  const assetsWidth = width - (assetsPerRow - 1);
  const assetWidth = assetsWidth / assetsPerRow;

  return (
    <Box>
      <ImageView
        images={assets}
        visible={isVisible}
        imageIndex={imageIndex}
        onRequestClose={hiddeImageView}
      />
      <FlatList
        data={assets}
        renderItem={({ item, index }) => {
          const isSelected = selectedItems.includes(item.id);

          return (
            <Asset
              id={item.id}
              uri={item.uri}
              index={index}
              assetWidth={assetWidth}
              isSelected={isSelected}
              isSelectionEnabled={isSelectionEnabled}
              handlePress={handlePress}
              handleLongPress={handleLongPress}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        initialNumToRender={20}
        numColumns={assetsPerRow}
        getItemLayout={(data, index) => ({
          length: assetWidth,
          offset: assetWidth * index,
          index,
        })}
      />
    </Box>
  );
};

export default Album;
