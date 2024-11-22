import { S } from '@/constants';


export { S };  
export const P = { N: 0, A: 1, B: 2 } as const;
export const O = { PL: 'place', MV: 'move' } as const;
export const A = { PL: 'PLACE', MV: 'MOVE', RP: 'REPLACE', ET: 'END' } as const;

export type Board = number[][];
export type Position = { x: number; y: number };
export type Move = Position & { s: number };

export type GameState = {
  board: Board;
  p: number;
  ops: number;
};

export type GameAction = {
  type: keyof typeof A;
  x?: number;
  y?: number;
  p?: number;
  fx?: number;
  fy?: number;
  tx?: number;
  ty?: number;
};
