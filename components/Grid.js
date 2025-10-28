import React from 'react';
import { View, StyleSheet } from 'react-native';

const Grid = ({ grid, onCellPress }) => {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={colIndex}
              style={[styles.cell, cell ? styles.filled : styles.empty]}
              onTouchEnd={() => onCellPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  cell: { width: 30, height: 30, borderWidth: 1, borderColor: '#000' },
  empty: { backgroundColor: '#fff' },
  filled: { backgroundColor: '#333' },
});

export default Grid;