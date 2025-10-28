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
  let newGrid = [...grid];
  // Clear full rows
  newGrid = newGrid.filter(row => row.some(cell => cell === 0));
  while (newGrid.length < grid.length) newGrid.unshift(Array(grid[0].length).fill(0));
  // Clear full columns (transpose, filter, transpose back)
  const transposed = newGrid[0].map((_, col) => newGrid.map(row => row[col]));
  const clearedTransposed = transposed.filter(col => col.some(cell => cell === 0));
  while (clearedTransposed.length < transposed.length) clearedTransposed.unshift(Array(newGrid.length).fill(0));
  newGrid = clearedTransposed[0].map((_, row) => clearedTransposed.map(col => col[row]));
  return newGrid;
};