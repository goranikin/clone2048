import './App.css';

import { useEffect, useState } from 'react';

import { implAddNewCell } from './infrastructures/implAddNewCell.ts';
import { implCheckGameDone } from './infrastructures/implCheckGameDone.ts';
import { implMoveFunctions } from './infrastructures/implMoveLogic.ts';
import { Game2048 } from './pages/Layout';

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

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(storageBestScoreKey, score.toString());
    }
  }, [score, bestScore]);

  const [grid, setGrid] = useState<number[][]>(
    implAddNewCell.addNewCell(implAddNewCell.addNewCell(initialGrid))
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const { moveLeft, moveRight, moveUp, moveDown } = implMoveFunctions;
      const { addNewCell } = implAddNewCell;

      if (!isGameOver && !isWinner) {
        let movedGrid;
        switch (event.key) {
          case 'ArrowUp':
            movedGrid = moveUp(grid);
            break;
          case 'ArrowDown':
            movedGrid = moveDown(grid);
            break;
          case 'ArrowLeft':
            movedGrid = moveLeft(grid);
            break;
          case 'ArrowRight':
            movedGrid = moveRight(grid);
            break;
        }

        if (movedGrid !== undefined) {
          setGrid(addNewCell(movedGrid))
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [grid, isGameOver, isWinner]);


  useEffect(() => {
    const { checkWinningCondition, checkGameOver } = implCheckGameDone;

    if (checkGameOver(grid)) setIsGameOver(true);
    if (checkWinningCondition(grid, winningCondition)) setIsWinner(true);

  }, [grid, winningCondition]);

  const restartGame = () => {
    setGrid(implAddNewCell.addNewCell(implAddNewCell.addNewCell(initialGrid)));
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
