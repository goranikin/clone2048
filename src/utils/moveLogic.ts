type gridType = number[][]

const moveGridLeftLogic = (grid: gridType): gridType => {
  return grid.map((line) => {
    const newLine = line
      .filter((num) => num !== 0)
      .map((entry, index, arr) => {
        if (entry === arr[index + 1]) {
          arr[index + 1] = 0;
          return entry ** 2;
        } else {
          return entry;
        }
      });
    while (newLine.length < 4) newLine.push(0);
    return newLine;
  });
};

const transpose = (parameterGrid: number[][]): number[][] => {
  return (parameterGrid[0] as number[]).map((_, colIndex) =>
    parameterGrid.map((row) => row[colIndex]),
  ) as number[][];
}

export const implMoveFunctions = {
  moveLeft: moveGridLeftLogic,

  moveRight: (grid: gridType) => {
    return moveGridLeftLogic(grid.map((row) => row.reverse()))
      .map((row) => row.reverse());
  },

  moveUp: (grid: gridType) => {
    return transpose(
      moveGridLeftLogic(
        transpose(grid)
      )
    );
  },

  moveDown: (grid: gridType) => {
    return transpose(
      moveGridLeftLogic(
        transpose(grid).map((row) => row.reverse()))
        .map((row) => row.reverse())
    );
  }
}