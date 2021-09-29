import React from 'react';
import { ScrollView, View } from 'react-native';

const AssetsContainer: React.FC = ({ children }) => (
  <View style={{ flex: 1 }}>
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginRight: -1,
          marginBottom: -1,
        }}
      >
        {children}
      </View>
    </ScrollView>
  </View>
);

export default AssetsContainer;
