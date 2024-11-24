type gridType = number[][]

export const implCheckGameOver = {
  checkGameOver: (grid: gridType): boolean => {
    if (grid.some((line) => line.some((cell) => cell === 0))) {
      return false;
    }

    const hasHorizontalMerge = grid.some((line) =>
      line.some((cell, j) => cell === line[j + 1])
    );

    const hasVerticalMerge = grid.some((line, i) =>
      line.some((cell, j) => cell === grid[i + 1]?.[j])
    );

    return !hasHorizontalMerge && !hasVerticalMerge;
  },
}