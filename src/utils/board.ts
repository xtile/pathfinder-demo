import { Board, P, S } from '../types';

export const n = (c: number): number => {
  while (c < 0) c += S;
  return c % S;
};

export const checkEnd = (b: Board) => {
  const e = b.flat().filter(c => c === P.N).length;
  if (e === 0) {
    const a = b.flat().filter(c => c === P.A).length;
    const b2 = b.flat().filter(c => c === P.B).length;
    return { over: true, winner: a > b2 ? 'Player 1' : b2 > a ? 'Player 2' : 'Draw' };
  }
  return { over: false };
};

export const replace = (b: Board, max = 10): Board => {
  let r = b.map(r => [...r]);
  let chg = true;
  let i = 0;

  while (chg && i < max) {
    chg = false;
    for (let p of [P.A, P.B])
      for (let x = 0; x < S; x++)
        for (let y = 0; y < S; y++)
          if (r[x][y] === (p === P.A ? P.B : P.A)) {
            let c = 0;
            for (let dx = -1; dx <= 1; dx++)
              for (let dy = -1; dy <= 1; dy++)
                if (dx || dy)
                  if (r[n(x + dx)][n(y + dy)] === p)
                    c++;
            if (c >= 5) {
              r[x][y] = p;
              chg = true;
            }
          }
    i++;
  }
  return r;
};

export const createEmptyBoard = (): Board => 
  Array(S).fill(null).map(() => Array(S).fill(P.N));
