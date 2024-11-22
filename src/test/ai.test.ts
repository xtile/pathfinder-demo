import { describe, it, expect } from 'vitest';


describe('AI', () => {
  it('should evaluate danger correctly', () => {
    const board = Array(10).fill(null).map(() => Array(10).fill(P.N));
    board[0][0] = P.B;
    board[0][1] = P.A;
    board[1][0] = P.A;
    board[1][1] = P.A;
    
    const danger = AI.evalDanger(board, 0, 0, P.B);
    expect(danger).toBeGreaterThan(0);
  });
});
