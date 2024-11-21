import { describe, it, expect } from 'vitest';
import { AI } from '@/ai';
import { P } from '@/types';

describe('AI', () => {
  it('evaluates danger correctly', () => {
    const board = Array(10).fill(null).map(() => Array(10).fill(P.N));
    board[0][0] = P.B;
    board[0][1] = P.A;
    board[1][0] = P.A;
    board[1][1] = P.A;
    
    expect(AI.evalDanger(board, 0, 0, P.B)).toBeGreaterThan(0);
  });
});
