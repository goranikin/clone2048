import React from 'react';

interface Game2048Props {
  grid: number[][];
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
}

export function Game2048({ grid }: Game2048Props) {
  return (
    <div className="game-board">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <Cell key={j} value={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CellProps {
  value: number;
}

function Cell({ value }: CellProps) {
  return <div className={`cell cell-${value}`}>{value > 0 ? value : ''}</div>;
}
