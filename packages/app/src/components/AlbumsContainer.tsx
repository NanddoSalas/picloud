import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

const AlbumsContainer: React.FC = ({ children }) => {
  const { width } = useWindowDimensions();

  const foldersPerWidth = Math.trunc(width / 150);
  const foldersWidth = foldersPerWidth * 150;
  const totalMargin = width - foldersWidth;
  const padding = totalMargin / (foldersPerWidth + 1) / 2;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            padding,
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export default AlbumsContainer;
