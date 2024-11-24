type gridType = number[][]

export const implCheckWinningCondition = {
  checkWinningCondition: (grid: gridType, winningCondition: number): boolean => {
    return grid.some((row) =>
      row.some((cell) => cell === winningCondition),
    );
  },
}