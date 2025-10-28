import React from 'react';
import { View, StyleSheet } from 'react-native';

const BlockPreview = ({ pattern, size = 20, color = '#4A90E2', opacity = 1 }) => {
  if (!pattern) return null;

  return (
    <View style={styles.container}>
      {pattern.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.cell,
                {
                  width: size,
                  height: size,
                  backgroundColor: cell ? color : 'transparent',
                  opacity: opacity,
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 1,
    borderRadius: 3,
  },
});

export default BlockPreview;
