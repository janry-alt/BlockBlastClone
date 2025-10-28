import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Grid from './components/Grid';
import BlockSelector from './components/BlockSelector';
import { createGrid, canPlaceBlock, placeBlock, clearFullLines } from './utils/gameLogic';
import { blockShapes } from './utils/blocks';

export default function App() {
  const [grid, setGrid] = useState(createGrid(10, 10));
  const [selectedBlock, setSelectedBlock] = useState('square');
  const [score, setScore] = useState(0);

  const handleCellPress = (row, col) => {
    const block = blockShapes[selectedBlock];
    if (canPlaceBlock(grid, block, row, col)) {
      const newGrid = placeBlock(grid, block, row, col);
      const clearedGrid = clearFullLines(newGrid);
      setGrid(clearedGrid);
      setScore(score + 10); // Simple scoring
    } else {
      Alert.alert('Invalid Move', 'Cannot place block here.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Block Blast</Text>
      <Text>Score: {score}</Text>
      <Grid grid={grid} onCellPress={handleCellPress} />
      <BlockSelector selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, marginBottom: 20 },
});