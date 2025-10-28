import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const Grid = ({ grid, previewGrid, cellSize = 30, onLayout }) => {
  const gridRef = useRef(null);

  const handleLayout = () => {
    if (gridRef.current && onLayout) {
      gridRef.current.measure((x, y, width, height, pageX, pageY) => {
        onLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  return (
    <View
      ref={gridRef}
      style={styles.gridContainer}
      onLayout={handleLayout}
    >
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isPreview = previewGrid && previewGrid[rowIndex][colIndex] === 2;
              const isFilled = cell === 1;

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                    },
                  ]}
                >
                  {isFilled && (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      style={styles.filledCell}
                    />
                  )}
                  {isPreview && (
                    <View style={styles.previewCell} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grid: {
    flexDirection: 'column',
    backgroundColor: '#34495e',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a252f',
  },
  filledCell: {
    width: '85%',
    height: '85%',
    backgroundColor: '#3498db',
    borderRadius: 4,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  previewCell: {
    width: '85%',
    height: '85%',
    backgroundColor: '#52c41a',
    borderRadius: 4,
    opacity: 0.5,
  },
});

export default Grid;