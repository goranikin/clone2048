import './App.css';

import { useEffect, useState } from 'react';

import { addNewCell } from './entities/addNewCell.ts';
import { checkGameCondition } from './entities/checkGameCondition.ts';
import { moveFunctions, type moveResultType } from './entities/moveFunctions.ts';
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

  // 최고 점수 체크
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(storageBestScoreKey, score.toString());
    }
  }, [score, bestScore]);

  const [grid, setGrid] = useState<number[][]>(
    addNewCell(addNewCell(initialGrid))
  );

  // 사용자 키 조작 체크
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const { moveLeft, moveRight, moveUp, moveDown } = moveFunctions;

      if (!isGameOver && !isWinner) {
        let moveResult: moveResultType | undefined;
        switch (event.key) {
          case 'ArrowUp':
            moveResult = moveUp(grid);
            break;
          case 'ArrowDown':
            moveResult = moveDown(grid);
            break;
          case 'ArrowLeft':
            moveResult = moveLeft(grid);
            break;
          case 'ArrowRight':
            moveResult = moveRight(grid);
            break;
        }

        if (moveResult !== undefined && JSON.stringify(moveResult.resultGrid) !== JSON.stringify(grid)) {
          setGrid(addNewCell(moveResult.resultGrid));
          setScore((prevScore) => prevScore + moveResult.scoreIncrement);
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [grid, isGameOver, isWinner]);


  // 게임 종료 조건 체크
  useEffect(() => {
    const { checkWinningCondition, checkGameOver } = checkGameCondition;
    if (checkGameOver(grid)) setIsGameOver(true);
    if (checkWinningCondition(grid, winningCondition)) setIsWinner(true);
  }, [grid, winningCondition]);

  const restartGame = () => {
    setGrid(addNewCell(addNewCell(initialGrid)));
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
