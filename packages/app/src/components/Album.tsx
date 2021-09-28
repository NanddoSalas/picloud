import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from 'react-native';

interface AlbumProps {
  albumId: string;
  albumName: string;
  onPress: () => void;
}

const Album: React.FC<AlbumProps> = ({ albumId, albumName, onPress }) => {
  const [thumbnailUri, setThumbnailUri] = useState('');
  const { width } = useWindowDimensions();

  useEffect(() => {
    MediaLibrary.getAssetsAsync({
      album: albumId,
      first: 1,
      mediaType: 'photo',
    }).then(({ totalCount, assets }) => {
      if (totalCount > 0) setThumbnailUri(assets[0].uri);
    });
  }, []);

  if (!thumbnailUri) return null;

  const folders = Math.trunc(width / 150);
  const foldersWidth = folders * 150;
  const totalMargin = width - foldersWidth;
  const margin = totalMargin / (folders + 1) / 2;

  return (
    <View style={{ margin }}>
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor="#000000"
        onPress={onPress}
        style={{ borderRadius: 10 }}
      >
        <Image
          source={{ uri: thumbnailUri }}
          style={{ width: 150, height: 150, borderRadius: 10 }}
        />
      </TouchableHighlight>
      <Text>{albumName}</Text>
    </View>
  );
};

export default Album;
