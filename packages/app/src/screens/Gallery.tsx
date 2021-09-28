import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import Album from '../components/Album';
import AlbumsContainer from '../components/AlbumsContainer';
import { StackParams } from '../types';

const Gallery: React.FC = () => {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const { navigate } = useNavigation<NavigationProp<StackParams>>();

  useEffect(() => {
    MediaLibrary.getAlbumsAsync().then((value) => setAlbums(value));
  }, []);

  return (
    <AlbumsContainer>
      {albums.map(({ id, title }) => (
        <Album
          key={id}
          albumId={id}
          albumName={title}
          onPress={() => navigate('Album', { albumId: id, albumName: title })}
        />
      ))}
    </AlbumsContainer>
  );
};

export default Gallery;
