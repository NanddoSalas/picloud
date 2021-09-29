import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ImageView from 'react-native-image-viewing';
import Asset from '../components/Asset';
import AssetsContainer from '../components/AssetsContainer';
import SelectionHeader from '../components/SelectionHeader';
import useImageView from '../hooks/useImageView';
import useSelection from '../hooks/useSelection';
import { StackParams } from '../types';

const Album: React.FC<NativeStackScreenProps<StackParams, 'Album'>> = ({
  route,
  navigation,
}) => {
  const { albumId, albumName } = route.params;
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
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
                <MaterialIcons name="select-all" size={26} color="black" />
              ),
              onPress: () => selectAll(assets.map(({ id }) => id)),
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

  return (
    <AssetsContainer>
      <ImageView
        images={assets}
        visible={isVisible}
        imageIndex={imageIndex}
        onRequestClose={hiddeImageView}
      />
      {assets.map(({ id, uri }, index) => {
        const isSelected = selectedItems.includes(id);

        return (
          <Asset
            key={id}
            id={id}
            uri={uri}
            index={index}
            minwh={100}
            isSelected={isSelected}
            isSelectionEnabled={isSelectionEnabled}
            handlePress={handlePress}
            handleLongPress={handleLongPress}
          />
        );
      })}
    </AssetsContainer>
  );
};

export default Album;
