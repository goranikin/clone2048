import './App.css';

import { useCallback, useEffect, useState } from 'react';

import { Game2048 } from './pages/Layout';

const storageBestScoreKey = 'bestScore';

// 리팩토링하자..
function App() {
  const initialGrid: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem(storageBestScoreKey) ?? '0'),
  );
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [winningCondition, setWinningCondition] = useState<number>(-1);
  const [doPlayerChooseWinningCondition, setDoPlayerChooseWinningCondition] =
    useState<boolean>(true);

  const chooseWinningCondition = (condition: number) => {
    setWinningCondition(condition);
    setDoPlayerChooseWinningCondition(false);
  };

  // if any cell would be winningCondition, player win!
  const checkWinningCondition = useCallback(
    (parameterGrid: number[][]): boolean => {
      return parameterGrid.some((row) =>
        row.some((cell) => cell === winningCondition),
      );
    },
    [winningCondition],
  );

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(storageBestScoreKey, score.toString());
    }
  }, [score, bestScore]);

  // if player lose the game, gameOver function would be executed and return grid which is filled -1.
  // why return -1 grid? -> addNewNumber function's return type is number[][].
  const gameOver = useCallback((): number[][] => {
    setIsGameOver(true);
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(-1) as number[]);
  }, []);

  const checkGameOver = useCallback((parameterGrid: number[][]): boolean => {
    const hasEmptyCell = parameterGrid.some((line) =>
      line.some((cell) => cell === 0),
    );
    if (hasEmptyCell) return false;

    const hasMergeableCells = parameterGrid.some((line, i) =>
      line.some((cell, j) => {
        const rightCell = line[j + 1];
        const bottomCell = parameterGrid[i + 1]?.[j];
        return (
          (rightCell !== undefined && cell === rightCell) ||
          (bottomCell !== undefined && cell === bottomCell)
        );
      }),
    );
    return !hasMergeableCells;
  }, []);

  const addNewNumber = useCallback(
    (parameterGrid: number[][]): number[][] => {
      const newGrid = parameterGrid.map((row) => [...row]);

      const randomZeroPosition = newGrid
        .flatMap((row, i) =>
          row.flatMap((cell, j) => (cell !== 0 ? [] : [{ i, j }])),
        )
        .sort(() => Math.random() - 0.5)[0];

      if (randomZeroPosition === undefined) {
        return checkGameOver(newGrid) ? gameOver() : newGrid;
      }

      return newGrid.map((row, i) => {
        return row.map((cell, j) => {
          return i === randomZeroPosition.i && j === randomZeroPosition.j
            ? Math.random() > 0.2
              ? 2
              : 4
            : cell;
        });
      });
    },
    [checkGameOver, gameOver],
  );

  // 초기 설정
  const [grid, setGrid] = useState<number[][]>(
    addNewNumber(addNewNumber(initialGrid)),
  );

  const updateScore = useCallback((newGrid: number[][]) => {
    const newScore = newGrid.reduce(
      (acc, row) => acc + row.reduce((sum, cell) => sum + cell, 0),
      0,
    );
    setScore(newScore);
  }, []);

  const move = useCallback(
    (moveFunction: (line: number[]) => number[]) => {
      let changed = false;
      const newGrid = grid.map((line) => {
        const newLine = moveFunction(line);
        if (newLine.join(',') !== line.join(',')) changed = true;
        return newLine;
      });
      if (changed as boolean) {
        const gridWithNewNumber = addNewNumber(newGrid);
        setGrid(gridWithNewNumber);
        updateScore(gridWithNewNumber);
        if (checkWinningCondition(gridWithNewNumber)) {
          setIsWinner(true);
        } else if (checkGameOver(gridWithNewNumber)) {
          gameOver();
        }
      }
    },
    [
      grid,
      addNewNumber,
      updateScore,
      checkWinningCondition,
      checkGameOver,
      gameOver,
      setGrid,
      setIsWinner,
    ],
  );

  const moveLeftLogic = useCallback((line: number[]): number[] => {
    let newLine = line.filter((num) => num !== 0);
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        (newLine[i] as number) *= 2;
        newLine[i + 1] = 0;
        i++;
      }
    }
    newLine = newLine.filter((num) => num !== 0);
    while (newLine.length < 4) newLine.push(0);
    return newLine;
  }, []);

  const moveLeft = useCallback(() => {
    move(moveLeftLogic);
  }, [move, moveLeftLogic]);

  const moveRight = useCallback(() => {
    move((line) => {
      const reversedLine = [...line].reverse();
      const movedLine = moveLeftLogic(reversedLine);
      return movedLine.reverse();
    });
  }, [move, moveLeftLogic]);

  const transpose = useCallback((parameterGrid: number[][]): number[][] => {
    return (parameterGrid[0] as number[]).map((_, colIndex) =>
      parameterGrid.map((row) => row[colIndex]),
    ) as number[][];
  }, []);

  const moveUp = useCallback(() => {
    const transposed = transpose(grid);
    const movedGrid = transposed.map(moveLeftLogic);
    const newGrid = transpose(movedGrid);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      const gridWithNewNumber = addNewNumber(newGrid);
      setGrid(gridWithNewNumber);
      updateScore(gridWithNewNumber);
      if (checkWinningCondition(gridWithNewNumber)) {
        setIsWinner(true);
      } else if (checkGameOver(gridWithNewNumber)) {
        gameOver();
      }
    }
  }, [
    grid,
    transpose,
    moveLeftLogic,
    addNewNumber,
    updateScore,
    checkWinningCondition,
    checkGameOver,
    setGrid,
    setIsWinner,
    gameOver,
  ]);

  const moveDown = useCallback(() => {
    const transposed = transpose(grid);
    const movedGrid = transposed.map((row) =>
      moveLeftLogic([...row].reverse()).reverse(),
    );
    const newGrid = transpose(movedGrid);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      const gridWithNewNumber = addNewNumber(newGrid);
      setGrid(gridWithNewNumber);
      updateScore(gridWithNewNumber);
      if (checkWinningCondition(gridWithNewNumber)) {
        setIsWinner(true);
      } else if (checkGameOver(gridWithNewNumber)) {
        gameOver();
      }
    }
  }, [
    grid,
    transpose,
    moveLeftLogic,
    addNewNumber,
    updateScore,
    checkWinningCondition,
    checkGameOver,
    setGrid,
    setIsWinner,
    gameOver,
  ]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isGameOver && !isWinner) {
        switch (event.key) {
          case 'ArrowUp':
            moveUp();
            break;
          case 'ArrowDown':
            moveDown();
            break;
          case 'ArrowLeft':
            moveLeft();
            break;
          case 'ArrowRight':
            moveRight();
            break;
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameOver, isWinner, moveDown, moveLeft, moveRight, moveUp]);

  const restartGame = () => {
    setGrid(addNewNumber(addNewNumber(initialGrid)));
    setScore(0);
    setIsGameOver(false);
    setIsWinner(false);
    setDoPlayerChooseWinningCondition(true);
  };

  return (
    <div className="App">
      <h1>2048</h1>
      <div className="score-container">
        <p>점수: {score}</p>
        <p>최고 점수: {bestScore}</p>
      </div>
      <Game2048 grid={grid} setGrid={setGrid} />
      <button onClick={restartGame}>다시하기</button>
      {doPlayerChooseWinningCondition && (
        <div className="choose-condition">
          <p>목표 점수를 설정하세요.</p>
          <button
            onClick={() => {
              chooseWinningCondition(128);
            }}
          >
            128
          </button>
          <button
            onClick={() => {
              chooseWinningCondition(256);
            }}
          >
            256
          </button>
          <button
            onClick={() => {
              chooseWinningCondition(512);
            }}
          >
            512
          </button>
          <button
            onClick={() => {
              chooseWinningCondition(1024);
            }}
          >
            1028
          </button>
          <button
            onClick={() => {
              chooseWinningCondition(2048);
            }}
          >
            2048
          </button>
          <button
            onClick={() => {
              chooseWinningCondition(-1);
            }}
          >
            무한으로 즐겨요
          </button>
        </div>
      )}
      {isGameOver && (
        <div className="game-over">
          <p>패배~</p>
          <button onClick={restartGame}>다시하기</button>
        </div>
      )}
      {isWinner && (
        <div className="winner">
          <p>승리!</p>
          <button onClick={restartGame}>다시하기</button>
        </div>
      )}
      <h1></h1>
    </div>
  );
}

export default App;
