// src/test/ai.test.ts
import { describe, it, expect } from 'vitest';
import { AI } from '@/ai';
import { P, S, Board } from '@/types';

describe('AI', () => {
  const createEmptyBoard = (): Board => 
    Array(S).fill(null).map(() => Array(S).fill(P.N));

  describe('evalDanger', () => {
    it('should detect danger when piece is surrounded by opponents', () => {
      const board = createEmptyBoard();
      board[0][0] = P.B;  // наша фишка
      board[0][1] = P.A;  // фишка противника
      board[1][0] = P.A;  // фишка противника
      board[1][1] = P.A;  // фишка противника
      
      const danger = AI.evalDanger(board, 0, 0, P.B);
      expect(danger).toBeGreaterThan(0);
    });

    it('should return 0 when piece is safe', () => {
      const board = createEmptyBoard();
      board[0][0] = P.B;  // наша фишка
      board[0][1] = P.A;  // одна фишка противника
      
      const danger = AI.evalDanger(board, 0, 0, P.B);
      expect(danger).toBe(0);
    });
  });

  describe('evalGroup', () => {
    it('should detect own group strength', () => {
      const board = createEmptyBoard();
      // Создаем группу из трех фишек
      board[0][0] = P.B;
      board[0][1] = P.B;
      board[1][0] = P.B;
      
      const strength = AI.evalGroup(board, 0, 0, P.B);
      expect(strength).toBeGreaterThan(0);
    });
  });

  describe('evalBlock', () => {
    it('should detect potential opponent replacements', () => {
      const board = createEmptyBoard();
      // Создаем ситуацию, где у противника почти замена
      board[0][0] = P.A;
      board[0][1] = P.A;
      board[1][0] = P.A;
      board[1][1] = P.B; // наша фишка под угрозой
      
      const blocking = AI.evalBlock(board, 1, 1, P.B);
      expect(blocking).toBeGreaterThan(0);
    });
  });

  describe('findMove', () => {
    it('should find best move for empty board', () => {
      const board = createEmptyBoard();
      const move = AI.findMove(board, P.B, O.PL);
      
      expect(move).toBeDefined();
      if (move) {
        expect(move.x).toBeGreaterThanOrEqual(0);
        expect(move.x).toBeLessThan(S);
        expect(move.y).toBeGreaterThanOrEqual(0);
        expect(move.y).toBeLessThan(S);
        expect(move.s).toBeGreaterThan(0);
      }
    });

    it('should prefer moves that prevent opponent replacements', () => {
      const board = createEmptyBoard();
      // Создаем ситуацию, где у противника почти замена
      board[0][0] = P.A;
      board[0][1] = P.A;
      board[1][0] = P.A;
      board[1][1] = P.N; // свободная клетка
      
      const move = AI.findMove(board, P.B, O.PL);
      expect(move).toBeDefined();
      if (move) {
        expect(move.x).toBe(1);
        expect(move.y).toBe(1);
      }
    });
  });
});
