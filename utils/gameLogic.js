export const createGrid = (rows, cols) => Array(rows).fill().map(() => Array(cols).fill(0));

export const canPlaceBlock = (grid, block, row, col) => {
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      if (block[i][j] && (row + i >= grid.length || col + j >= grid[0].length || grid[row + i][col + j])) {
        return false;
      }
    }
  }
  return true;
};

export const placeBlock = (grid, block, row, col) => {
  const newGrid = grid.map(r => [...r]);
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      if (block[i][j]) newGrid[row + i][col + j] = 1;
    }
  }
  return newGrid;
};

export const clearFullLines = (grid) => {
  let newGrid = grid.map(r => [...r]);
  let clearedRows = 0;
  let clearedCols = 0;

  const fullRows = [];
  for (let i = 0; i < newGrid.length; i++) {
    if (newGrid[i].every(cell => cell === 1)) {
      fullRows.push(i);
    }
  }

  const fullCols = [];
  for (let j = 0; j < newGrid[0].length; j++) {
    if (newGrid.every(row => row[j] === 1)) {
      fullCols.push(j);
    }
  }

  for (const row of fullRows) {
    for (let j = 0; j < newGrid[row].length; j++) {
      newGrid[row][j] = 0;
    }
    clearedRows++;
  }

  for (const col of fullCols) {
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i][col] = 0;
    }
    clearedCols++;
  }

  return { grid: newGrid, clearedRows, clearedCols, totalCleared: clearedRows + clearedCols };
};

export const calculateScore = (blockSize, linesCleared, combo = 1) => {
  const baseScore = blockSize * 5;
  const lineBonus = linesCleared * 100;
  const comboMultiplier = combo > 1 ? combo * 1.5 : 1;
  return Math.floor((baseScore + lineBonus) * comboMultiplier);
};

export const canPlaceAnyBlock = (grid, blocks) => {
  for (const block of blocks) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (canPlaceBlock(grid, block.pattern, row, col)) {
          return true;
        }
      }
    }
  }
  return false;
};