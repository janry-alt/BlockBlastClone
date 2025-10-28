export const blockShapes = {
  single: [[1]],

  double: [[1, 1]],

  doubleVertical: [
    [1],
    [1],
  ],

  triple: [[1, 1, 1]],

  tripleVertical: [
    [1],
    [1],
    [1],
  ],

  square: [
    [1, 1],
    [1, 1],
  ],

  line: [
    [1],
    [1],
    [1],
    [1],
  ],

  lineHorizontal: [[1, 1, 1, 1]],

  line5: [
    [1],
    [1],
    [1],
    [1],
    [1],
  ],

  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],

  LMirror: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],

  LRotated: [
    [1, 1, 1],
    [1, 0, 0],
  ],

  LRotatedMirror: [
    [1, 1, 1],
    [0, 0, 1],
  ],

  T: [
    [1, 1, 1],
    [0, 1, 0],
  ],

  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],

  ZMirror: [
    [0, 1, 1],
    [1, 1, 0],
  ],

  bigSquare: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],

  corner: [
    [1, 1],
    [1, 0],
  ],

  cornerMirror: [
    [1, 1],
    [0, 1],
  ],
};

export const getRandomBlocks = (count = 3) => {
  const keys = Object.keys(blockShapes);
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    selected.push({
      id: `${randomKey}-${Date.now()}-${i}`,
      shape: randomKey,
      pattern: blockShapes[randomKey],
    });
  }
  return selected;
};