import './App.css';

import { useCallback, useEffect, useState } from 'react';

import { Game2048 } from './pages/Layout';
import { implMoveFunctions } from './utils/moveLogic.ts';

const storageBestScoreKey = 'bestScore';

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



  useEffect(() => {

    const handleKeyUp = (event: KeyboardEvent) => {
      const { moveLeft, moveRight, moveUp, moveDown } = implMoveFunctions;

      if (!isGameOver && !isWinner) {
        switch (event.key) {
          case 'ArrowUp':
            moveUp(grid);
            break;
          case 'ArrowDown':
            moveDown(grid);
            break;
          case 'ArrowLeft':
            moveLeft(grid);
            break;
          case 'ArrowRight':
            moveRight(grid);
            break;
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [grid, isGameOver, isWinner]);

  const restartGame = () => {
    setGrid(addNewNumber(addNewNumber(initialGrid)));
    setScore(0);
    setIsGameOver(false);
    setIsWinner(false);
    setDoPlayerChooseWinningCondition(true);
  };

  const availableWinningConditions = [128, 256, 512, 1024, 2048];

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
          {availableWinningConditions.map((condition) => (
            <button
              key={condition}
              onClick={() => {
                chooseWinningCondition(condition);
              }}
            >
              {condition}
            </button>
          ))}
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
