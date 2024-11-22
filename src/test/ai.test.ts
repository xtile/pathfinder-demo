// src/test/ai.test.ts
 
import { describe, it, expect } from 'vitest';
import { AI } from '@/ai';
import { P, O, S, Board } from '@/types';

describe('AI', () => {
  const createEmptyBoard = (): Board => 
    Array(S).fill(null).map(() => Array(S).fill(P.N));

  describe('evalDanger', () => {
    it('should detect danger when piece is surrounded by opponents', () => {
      const board = createEmptyBoard();
      board[0][0] = P.B;
      board[0][1] = P.A;
      board[1][0] = P.A;
      board[1][1] = P.A;
      
      const danger = AI.evalDanger(board, 0, 0, P.B);
      expect(danger).toBeGreaterThan(0);
    });

    it('should return 0 when piece is safe', () => {
      const board = createEmptyBoard();
      board[0][0] = P.B;
      board[0][1] = P.A;
      
      const danger = AI.evalDanger(board, 0, 0, P.B);
      expect(danger).toBe(0);
    });
  });

  describe('evalBlock', () => {
    it('should detect potential opponent replacements', () => {
      const board = createEmptyBoard();
      // Создаем ситуацию, где у противника 4 фишки вокруг нашей
      board[0][0] = P.A;
      board[0][1] = P.A;
      board[0][2] = P.A;
      board[1][0] = P.A;
      board[1][1] = P.B; // наша фишка под угрозой
      
      const blocking = AI.evalBlock(board, 1, 1, P.B);
      expect(blocking).toBeGreaterThan(0);
    });
  });

  describe('findMove', () => {
    it('should find best move when evaluating empty board', () => {
      const board = createEmptyBoard();
      // Добавляем несколько фишек для создания предпочтительной позиции
      board[4][4] = P.A;
      board[4][5] = P.A;
      
      const move = AI.findMove(board, P.B, O.PL);
      expect(move).toBeDefined();
      if (move) {
        expect(typeof move.x).toBe('number');
        expect(typeof move.y).toBe('number');
        expect(move.x).toBeGreaterThanOrEqual(0);
        expect(move.x).toBeLessThan(S);
        expect(move.y).toBeGreaterThanOrEqual(0);
        expect(move.y).toBeLessThan(S);
        expect(typeof move.s).toBe('number');
      }
    });

    it('should prefer defensive moves against potential replacements', () => {
      const board = createEmptyBoard();
      // Создаем ситуацию, где нужно защищаться от замены
      board[0][0] = P.A;
      board[0][1] = P.A;
      board[0][2] = P.A;
      board[1][0] = P.A;
      board[1][1] = P.N; // критическая позиция для защиты
      
      const move = AI.findMove(board, P.B, O.PL);
      expect(move).toBeDefined();
      if (move) {
        // Ожидаем, что AI выберет защитную позицию
        expect(move.x).toBe(1);
        expect(move.y).toBe(1);
        // Проверяем, что оценка этого хода высокая
        expect(move.s).toBeGreaterThan(50);
      }
    });
  });
});
