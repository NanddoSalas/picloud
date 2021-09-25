import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableIcon from './TouchableIcon';

interface SelectionHeaderProps {
  title: string;
  isSelectionEnabled: boolean;
  selectedItems: any[];
  onGoBack: () => void;
  onDisableSelection: () => void;
  onSelectAll: () => void;
  onBuckup: () => void;
  onDelete: () => void;
}

const ImageSelectionHeader: React.FC<SelectionHeaderProps> = ({
  title,
  isSelectionEnabled,
  selectedItems,
  onDisableSelection,
  onGoBack,
  onSelectAll,
  onBuckup,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        height: headerHeight,
        paddingTop: insets.top,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TouchableIcon
        onPress={isSelectionEnabled ? onDisableSelection : onGoBack}
        icon={() => (
          <AntDesign
            name={isSelectionEnabled ? 'close' : 'arrowleft'}
            size={26}
            color="black"
          />
        )}
      />
      <Text style={{ fontSize: 20 }}>
        {isSelectionEnabled ? selectedItems.length.toString() : title}
      </Text>
      {isSelectionEnabled && (
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableIcon
            onPress={onSelectAll}
            icon={() => (
              <MaterialIcons name="select-all" size={26} color="black" />
            )}
          />
          <TouchableIcon
            onPress={onBuckup}
            icon={() => <MaterialIcons name="backup" size={26} color="black" />}
          />
          <TouchableIcon
            onPress={onDelete}
            icon={() => <AntDesign name="delete" size={26} color="black" />}
          />
        </View>
      )}
    </View>
  );
};

export default ImageSelectionHeader;
