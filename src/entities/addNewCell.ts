type gridType = number[][]

export const addNewCell = (grid: gridType): gridType => {
    const newGrid = grid.map((row) => [...row]);

    const randomZeroPosition = newGrid
      .flatMap((row, i) =>
        row.flatMap((cell, j) => (cell !== 0 ? [] : [{ i, j }])),
      )
      .sort(() => Math.random() - 0.5)[0];
    
    if (randomZeroPosition === undefined) return grid;

    return newGrid.map((row, i) => {
      return row.map((cell, j) => {
        return i === randomZeroPosition.i && j === randomZeroPosition.j
        ? Math.random() > 0.2 ? 2 : 4
          : cell;
      });
    });
  }