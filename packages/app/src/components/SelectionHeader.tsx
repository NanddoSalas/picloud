import { AntDesign } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderOperation } from '../types';
import TouchableIcon from './TouchableIcon';

interface SelectionHeaderProps {
  title: string;
  isSelectionEnabled: boolean;
  selectedItems: string[];
  operations: HeaderOperation[];
  onGoBack: () => void;
  onDisableSelection: () => void;
}

const SelectionHeader: React.FC<SelectionHeaderProps> = ({
  title,
  isSelectionEnabled,
  selectedItems,
  operations,
  onGoBack,
  onDisableSelection,
}) => {
  const { colors } = useTheme();
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
        backgroundColor: colors.card,
      }}
    >
      <TouchableIcon
        onPress={isSelectionEnabled ? onDisableSelection : onGoBack}
        icon={() => (
          <AntDesign
            name={isSelectionEnabled ? 'close' : 'arrowleft'}
            size={26}
            color={colors.text}
          />
        )}
      />
      <Text style={{ fontSize: 20, color: colors.text }}>
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
          {operations.map(({ icon, onPress }, index) => (
            <TouchableIcon
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={icon}
              onPress={() => onPress(selectedItems)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectionHeader;
