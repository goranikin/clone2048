import { describe, expect, it } from 'vitest';

import { moveFunctions } from './moveFunctions.ts';

describe('2048 Move Functions', () => {
  // Left Move Tests
  describe('moveLeft', () => {
    it('should merge identical adjacent numbers', () => {
      const grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveLeft(grid);

      expect(resultGrid).toEqual([
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(4);
    });

    it('should handle multiple merges in a row', () => {
      const grid = [
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveLeft(grid);

      expect(resultGrid).toEqual([
        [4, 8, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(12);
    });
  });

  // Right Move Tests
  describe('moveRight', () => {
    it('should merge and shift numbers to the right', () => {
      const grid = [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveRight(grid);

      expect(resultGrid).toEqual([
        [0, 0, 0, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(4);
    });
  });

  // Up Move Tests
  describe('moveUp', () => {
    it('should merge vertically from top', () => {
      const grid = [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveUp(grid);

      expect(resultGrid).toEqual([
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(4);
    });
  });

  // Down Move Tests
  describe('moveDown', () => {
    it('should merge vertically from bottom', () => {
      const grid = [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveDown(grid);

      expect(resultGrid).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(4);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should not merge when no adjacent numbers match', () => {
      const grid = [
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveLeft(grid);

      expect(resultGrid).toEqual([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(0);
    });

    it('should handle grid with zeros', () => {
      const grid = [
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const { resultGrid, scoreIncrement } = moveFunctions.moveLeft(grid);

      expect(resultGrid).toEqual([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(scoreIncrement).toBe(0);
    });
  });
});
