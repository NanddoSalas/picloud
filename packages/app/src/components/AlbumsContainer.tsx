import React from 'react';
import {
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

interface AlbumsContainerProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const AlbumsContainer: React.FC<AlbumsContainerProps> = ({
  children,
  refreshing,
  onRefresh,
}) => {
  const { width } = useWindowDimensions();

  const foldersPerWidth = Math.trunc(width / 150);
  const foldersWidth = foldersPerWidth * 150;
  const totalMargin = width - foldersWidth;
  const padding = totalMargin / (foldersPerWidth + 1) / 2;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
