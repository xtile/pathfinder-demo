import { AlertDialog, Card, Switch, Label } from '@/components/ui';
import { useReducer, useState, useMemo, useEffect } from 'react';
import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { Cell } from '@/components/cell';
import { PositionStats } from '@/components/PositionStats';
import { P, O, A, S, Position } from '@/types';
import { reducer, initialState } from '@/store/reducer';
import { AI } from '@/ai';
import { checkEnd } from '@/utils/board';
import { analyzePosition } from '@/utils/analysis';
import { replace } from '@/utils/board';
import React from 'react';

export const Game = () => {
 const [st, dispatch] = useReducer(reducer, initialState);
 const [op, _setOp] = useState(O.PL);
 const [sel, _setSel] = useState<Position | null>(null);
 const [alt, setAlt] = useState(false);
 const [msg, setMsg] = useState('');
 const [map, setMap] = useState(true);
 const [ai, setAi] = useState(true);

 useEffect(() => {
   const aiTurn = async () => {
     if (!ai || st.p !== P.B || st.ops !== 2) return;
     
     let updBoard = st.board.map(r => [...r]);
     
     const m1 = AI.findMove(updBoard, P.B, O.PL);
     if (!m1) {
       dispatch({type: A.ET});
       return;
     }
     
     dispatch({type: A.PL, x: m1.x, y: m1.y, p: P.B});
     dispatch({type: A.RP});
     
     updBoard[m1.x][m1.y] = P.B;
     updBoard = replace(updBoard);
     
     await new Promise(r => setTimeout(r, 500));
     
     const m2 = AI.findMove(updBoard, P.B, O.PL);
     if (!m2) {
       dispatch({type: A.ET});
       return;
     }
     
     dispatch({type: A.PL, x: m2.x, y: m2.y, p: P.B});
     dispatch({type: A.RP});
     
     await new Promise(r => setTimeout(r, 300));
     dispatch({type: A.ET});
   };

   if (ai && st.p === P.B && st.ops === 2) {
     const timer = setTimeout(aiTurn, 500);
     return () => clearTimeout(timer);
   }
 }, [ai, st.p, st.ops]);

 const stats = useMemo(() => ({
   p1: analyzePosition(st.board, P.A),
   p2: analyzePosition(st.board, P.B)
 }), [st.board]);

 const click = (x: number, y: number) => {
   const end = checkEnd(st.board);
   if (end.over) {
     setMsg(`Game Over! Winner: ${end.winner}`);
     setAlt(true);
     return;
   }

   if (ai && st.p === P.B) return;
   if (st.ops <= 0) { 
     dispatch({type: A.ET}); 
     return; 
   }
   
   if (op === O.PL && st.board[x][y] === P.N) {
     dispatch({type: A.PL, x, y, p: st.p});
     dispatch({type: A.RP});
     if (st.ops <= 1) dispatch({type: A.ET});
   }
 };

 const scores = useMemo(() => {
   const ss = Array(S).fill(null).map(() => Array(S).fill(0));
   for (let x = 0; x < S; x++) {
     for (let y = 0; y < S; y++) {
       if (st.board[x][y] === P.N) {
         ss[x][y] = AI.eval(st.board, st.board, x, y, st.p);
       }
     }
   }
   const max = Math.max(...ss.flat());
   return max > 0 ? ss.map(r => r.map(v => v / max)) : ss;
 }, [st.board, st.p]);

 return (
  <div className="flex flex-col items-center p-4 gap-4">
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CTOR Game</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={ai} onCheckedChange={setAi} id="ai"/>
            <Label htmlFor="ai">AI Player 2</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={map} onCheckedChange={setMap} id="map"/>
            <Label htmlFor="map">Heatmap</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="mr-4">Player: {st.p === P.A ? '1' : '2'}</span>
          <span>Ops: {st.ops}</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"/>
            <span>P1: {st.board.flat().filter(c => c === P.A).length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"/>
            <span>P2: {st.board.flat().filter(c => c === P.B).length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 bg-gray-200 p-2">
        {Array.from({ length: 10 }, (_, x) => (
          <React.Fragment key={x}>
            {Array.from({ length: 10 }, (_, y) => (
              <Cell
                key={`${x}-${y}`}
                x={x}
                y={y}
                v={st.board[x][y]}
                s={scores[x][y]}
                sel={sel}
                map={map}
                onClick={() => click(x, y)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Position analysis */}
      <div className="mt-4 flex justify-around">
        <PositionStats player={1} stats={stats.p1} />
        <div className="w-px bg-gray-200 mx-4" />
        <PositionStats player={2} stats={stats.p2} />
      </div>

      {/* Position strength indicator */}
      <div className="mt-4 bg-gray-100 rounded-lg p-2">
        <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-red-500"
            style={{
              width: '100%',
              transform: `translateX(${(stats.p2.total - stats.p1.total) / 
                (stats.p1.total + stats.p2.total) * 50}%)`
            }}
          />
        </div>
      </div>
    </Card>

    <AlertDialog open={alt} onOpenChange={setAlt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Game Over</AlertDialogTitle>
          <AlertDialogDescription>{msg}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => window.location.reload()}>
            New Game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
};