type gridType = number[][];

export type moveResultType = {
  resultGrid: gridType;
  scoreIncrement: number;
};

const moveGridLeftLogic = (grid: gridType): moveResultType => {
  const scoreIncrement: number[] = [];
  const resultGrid = grid.map((line) => {
    const nonZeroLine = line.filter((num) => num !== 0);

    const newLine = nonZeroLine.reduce((acc: number[], curr, index, arr) => {
      if (index < arr.length - 1 && curr === arr[index + 1]) {
        scoreIncrement.push(curr * 2);
        acc.push(curr * 2);
        arr[index + 1] = 0;
      } else if (curr != 0) {
        acc.push(curr);
      }
      return acc;
    }, []);

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return newLine;
  });

  return {
    resultGrid: resultGrid,
    scoreIncrement: scoreIncrement.reduce((prev, curr) => prev + curr, 0),
  };
};

const transpose = (grid: gridType): gridType => {
  return grid.map((_, colIndex) => grid.map((row) => row[colIndex]),) as gridType
};

export const moveFunctions = {
  moveLeft: moveGridLeftLogic,

  moveRight: (grid: gridType): moveResultType => {
    const { resultGrid, scoreIncrement } = moveGridLeftLogic(
      grid.map((row) => row.reverse()),
    );
    return {
      resultGrid: resultGrid.map((row) => row.reverse()),
      scoreIncrement,
    };
  },

  moveUp: (grid: gridType): moveResultType => {
    const { resultGrid, scoreIncrement } = moveGridLeftLogic(transpose(grid));
    return { resultGrid: transpose(resultGrid), scoreIncrement };
  },

  moveDown: (grid: gridType): moveResultType => {
    const { resultGrid, scoreIncrement } = moveGridLeftLogic(
      transpose(grid).map((row) => row.reverse()),
    );
    return {
      resultGrid: transpose(resultGrid.map((row) => row.reverse())),
      scoreIncrement,
    };
  },
};
