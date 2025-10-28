import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, Alert } from 'react-native';
import Grid from './components/Grid';
import DraggableBlock from './components/DraggableBlock';
import Leaderboard from './components/Leaderboard';
import { createGrid, canPlaceBlock, placeBlock, clearFullLines, calculateScore, canPlaceAnyBlock } from './utils/gameLogic';
import { getRandomBlocks } from './utils/blocks';
import { saveHighScore } from './services/supabase';

const GRID_SIZE = 8;
const CELL_SIZE = Math.min(Dimensions.get('window').width * 0.09, 40);

export default function App() {
  const [grid, setGrid] = useState(createGrid(GRID_SIZE, GRID_SIZE));
  const [previewGrid, setPreviewGrid] = useState(null);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [blocksPlaced, setBlocksPlaced] = useState(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentDragBlock, setCurrentDragBlock] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const gridLayout = useRef(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (availableBlocks.length > 0 && availableBlocks.every(b => b.used)) {
      setAvailableBlocks(getRandomBlocks(3).map(b => ({ ...b, used: false })));
    }
  }, [availableBlocks]);

  useEffect(() => {
    if (availableBlocks.length > 0) {
      const activeBlocks = availableBlocks.filter(b => !b.used);
      if (activeBlocks.length > 0 && !canPlaceAnyBlock(grid, activeBlocks)) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
      }
    }
  }, [grid, availableBlocks]);

  const initializeGame = () => {
    setGrid(createGrid(GRID_SIZE, GRID_SIZE));
    setAvailableBlocks(getRandomBlocks(3).map(b => ({ ...b, used: false })));
    setScore(0);
    setCombo(0);
    setBlocksPlaced(0);
    setTotalLinesCleared(0);
    setGameOver(false);
    setHistory([]);
    setPreviewGrid(null);
  };

  const handleDragStart = (block) => {
    setCurrentDragBlock(block);
  };

  const handleDragMove = (evt, gestureState, block) => {
    if (!gridLayout.current) return;

    const { pageX, pageY } = evt.nativeEvent;
    const { x: gridX, y: gridY, width: gridWidth, height: gridHeight } = gridLayout.current;

    const cellWidth = gridWidth / GRID_SIZE;
    const cellHeight = gridHeight / GRID_SIZE;

    const col = Math.floor((pageX - gridX) / cellWidth);
    const row = Math.floor((pageY - gridY) / cellHeight);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      if (canPlaceBlock(grid, block.pattern, row, col)) {
        const preview = grid.map(r => [...r]);
        for (let i = 0; i < block.pattern.length; i++) {
          for (let j = 0; j < block.pattern[i].length; j++) {
            if (block.pattern[i][j] && row + i < GRID_SIZE && col + j < GRID_SIZE) {
              preview[row + i][col + j] = 2;
            }
          }
        }
        setPreviewGrid(preview);
      } else {
        setPreviewGrid(null);
      }
    } else {
      setPreviewGrid(null);
    }
  };

  const handleDragEnd = (evt, gestureState, block) => {
    if (!gridLayout.current) {
      setPreviewGrid(null);
      setCurrentDragBlock(null);
      return false;
    }

    const { pageX, pageY } = evt.nativeEvent;
    const { x: gridX, y: gridY, width: gridWidth, height: gridHeight } = gridLayout.current;

    const cellWidth = gridWidth / GRID_SIZE;
    const cellHeight = gridHeight / GRID_SIZE;

    const col = Math.floor((pageX - gridX) / cellWidth);
    const row = Math.floor((pageY - gridY) / cellHeight);

    setPreviewGrid(null);
    setCurrentDragBlock(null);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      if (canPlaceBlock(grid, block.pattern, row, col)) {
        handleBlockPlacement(block, row, col);
        return true;
      }
    }

    return false;
  };

  const handleBlockPlacement = (block, row, col) => {
    const blockSize = block.pattern.flat().filter(cell => cell === 1).length;

    setHistory([...history, { grid: grid.map(r => [...r]), availableBlocks: [...availableBlocks], score, combo, blocksPlaced, totalLinesCleared }]);

    const newGrid = placeBlock(grid, block.pattern, row, col);
    const clearResult = clearFullLines(newGrid);

    const newCombo = clearResult.totalCleared > 0 ? combo + 1 : 0;
    const points = calculateScore(blockSize, clearResult.totalCleared, newCombo);

    setGrid(clearResult.grid);
    setScore(score + points);
    setCombo(newCombo);
    setBlocksPlaced(blocksPlaced + 1);
    setTotalLinesCleared(totalLinesCleared + clearResult.totalCleared);

    setAvailableBlocks(availableBlocks.map(b =>
      b.id === block.id ? { ...b, used: true } : b
    ));
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setGrid(lastState.grid);
    setAvailableBlocks(lastState.availableBlocks);
    setScore(lastState.score);
    setCombo(lastState.combo);
    setBlocksPlaced(lastState.blocksPlaced);
    setTotalLinesCleared(lastState.totalLinesCleared);
    setHistory(history.slice(0, -1));
    setGameOver(false);
  };

  const handleGridLayout = (layout) => {
    gridLayout.current = layout;
  };

  const handleSaveScore = async () => {
    const name = playerName.trim() || 'Anonymous';
    const result = await saveHighScore(name, score, blocksPlaced, totalLinesCleared);

    if (result.success) {
      setShowNameInput(false);
      setShowLeaderboard(true);
    } else {
      Alert.alert('Error', 'Failed to save score. Please try again.');
    }
  };

  const handleGameOverContinue = () => {
    setShowNameInput(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Block Blast</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Best</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>
        {combo > 1 && (
          <View style={styles.comboContainer}>
            <Text style={styles.comboText}>Combo x{combo}</Text>
          </View>
        )}
      </View>

      <Grid
        grid={grid}
        previewGrid={previewGrid}
        cellSize={CELL_SIZE}
        onLayout={handleGridLayout}
      />

      <View style={styles.blocksContainer}>
        {availableBlocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            isUsed={block.used}
            cellSize={CELL_SIZE}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, history.length === 0 && styles.buttonDisabled]}
          onPress={handleUndo}
          disabled={history.length === 0}
        >
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={initializeGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowLeaderboard(true)}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Blocks: {blocksPlaced}</Text>
        <Text style={styles.statText}>Lines: {totalLinesCleared}</Text>
      </View>

      <Modal
        visible={gameOver}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <Text style={styles.modalScore}>Final Score: {score}</Text>
            {score === highScore && score > 0 && (
              <Text style={styles.modalHighScore}>New High Score!</Text>
            )}
            <Text style={styles.modalStats}>Blocks Placed: {blocksPlaced}</Text>
            <Text style={styles.modalStats}>Lines Cleared: {totalLinesCleared}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleGameOverContinue}>
                <Text style={styles.modalButtonText}>Save Score</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.secondaryButton]} onPress={initializeGame}>
                <Text style={styles.modalButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNameInput}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Your Score</Text>
            <Text style={styles.modalScore}>Score: {score}</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveScore}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => {
                  setShowNameInput(false);
                  initializeGame();
                }}
              >
                <Text style={styles.modalButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Leaderboard
        visible={showLeaderboard}
        onClose={() => {
          setShowLeaderboard(false);
          if (gameOver) {
            initializeGame();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#4A90E2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
  },
  scoreLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  comboContainer: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comboText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blocksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  statText: {
    color: '#aaa',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalScore: {
    fontSize: 24,
    color: '#4A90E2',
    marginBottom: 10,
    fontWeight: '600',
  },
  modalHighScore: {
    fontSize: 18,
    color: '#f39c12',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalStats: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#555',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameInput: {
    backgroundColor: '#1a252f',
    color: '#fff',
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
});