import { Board, P, S, A } from '@/types';
import { GameState, GameAction, A, P } from '../types';
import { replace } from '../utils/board';

export const initialState: GameState = {
  board: Array(S).fill(null).map(() => Array(S).fill(P.N)) as Board,
  p: P.A,
  ops: 2
};

export const reducer = (s: GameState, a: GameAction): GameState => {
  switch(a.type) {
    case A.PL: return {
      ...s,
      board: s.board.map(r => [...r])
        .map((r, x) => x === a.x ? r.map((c, y) => y === a.y ? a.p : c) : r),
      ops: s.ops - 1
    };
    case A.MV: return {
      ...s,
      board: s.board.map(r => [...r])
        .map((r, x) => x === a.fx ? r.map((c, y) => y === a.fy ? P.N : c) :
                       x === a.tx ? r.map((c, y) => y === a.ty ? a.p : c) : r),
      ops: s.ops - 1
    };
    case A.RP: return { ...s, board: replace(s.board) };
    case A.ET: return { ...s, p: s.p === P.A ? P.B : P.A, ops: 2 };
    default: return s;
  }
};
