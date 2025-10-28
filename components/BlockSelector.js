import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { blockShapes } from '../utils/blocks';

const BlockSelector = ({ selectedBlock, onSelectBlock }) => {
  return (
    <View style={styles.selector}>
      {Object.keys(blockShapes).map((shape) => (
        <TouchableOpacity
          key={shape}
          style={[styles.block, selectedBlock === shape && styles.selected]}
          onPress={() => onSelectBlock(shape)}
        >
          <Text>{shape}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selector: { flexDirection: 'row', justifyContent: 'space-around', margin: 20 },
  block: { padding: 10, borderWidth: 1, borderColor: '#000' },
  selected: { backgroundColor: '#ddd' },
});

export default BlockSelector;