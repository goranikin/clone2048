type gridType = number[][]

const moveGridLeftLogic = (grid: gridType): gridType => {
  return grid.map((line) => {
    const nonZeroLine = line.filter((num) => num !== 0);

    const newLine = nonZeroLine
      .reduce((acc: number[], curr, index, arr) => {
        if (index < arr.length - 1 && curr == arr[index + 1]) {
          acc.push(curr * 2);
          arr[index + 1] = 0;
        } else if (curr != 0) {
          acc.push(curr)
        }
        return acc;
    }, []);

    while (newLine.length < 4) {
      newLine.push(0);
    }

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