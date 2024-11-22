import {  Card, Switch, Label } from '@/components/ui';
import { useReducer, useState, useMemo, useEffect } from 'react';
// import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { Cell } from '@/components/cell';
// import { PositionStats } from '@/components/PositionStats';
import { P, O, A, S, Position } from '@/types';
import { reducer, initialState } from '@/store/reducer';
import { AI } from '@/ai';
import { checkEnd } from '@/utils/board';
import { analyzePosition } from '@/utils/analysis';
import { replace } from '@/utils/board';
// import React from 'react';

export const Game = () => {
 const [st, dispatch] = useReducer(reducer, initialState);
 const [op, _setOp] = useState(O.PL);
 const [sel, _setSel] = useState<Position | null>(null);
 const [_alt, setAlt] = useState(false);
 const [_msg, setMsg] = useState('');
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
  <div className="flex flex-col items-center p-4">
    <Card className="w-[600px]"> {/* Фиксированная ширина карточки */}
      <div className="p-4 space-y-4"> {/* Общий контейнер с отступами */}
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">CTOR Game</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch 
                checked={ai} 
                onCheckedChange={setAi} 
                id="ai"
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="ai" className="text-sm">AI Player 2</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={map} 
                onCheckedChange={setMap} 
                id="map"
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="map" className="text-sm">Heatmap</Label>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm">
            <span>Player: {st.p === P.A ? '1' : '2'}</span>
            <span>Ops: {st.ops}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-2"/>
              <span className="text-sm">P1: {st.board.flat().filter(c => c === P.A).length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-2"/>
              <span className="text-sm">P2: {st.board.flat().filter(c => c === P.B).length}</span>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="grid grid-cols-10 gap-[2px] aspect-square">
            {st.board.map((r, x) => 
              r.map((c, y) => (
                <Cell 
                  key={`${x}-${y}`} 
                  x={x} 
                  y={y} 
                  v={c} 
                  s={scores[x][y]}
                  sel={sel}
                  map={map}
                  onClick={() => click(x, y)}
                />
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-4">
          {/* Player 1 Stats */}
          <div className="bg-white rounded-lg p-3 border border-blue-500 w-[45%]">
            <div className="font-bold mb-2">Player 1</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-600">Pieces:</span>
              <span>{stats.p1.pieces}</span>
              <span className="text-gray-600">Territory:</span>
              <span>{stats.p1.territory}%</span>
              <span className="text-gray-600">Influence:</span>
              <span>{stats.p1.influence}%</span>
              <span className="text-gray-600">Group Str:</span>
              <span>{stats.p1.groupsStrength}</span>
              <span className="text-gray-600 pt-2 border-t">Total:</span>
              <span className="font-bold text-blue-600 pt-2 border-t">{stats.p1.total}</span>
            </div>
          </div>

          <div className="h-auto w-px bg-gray-200" />

          {/* Player 2 Stats */}
          <div className="bg-white rounded-lg p-3 border border-red-500 w-[45%]">
            <div className="font-bold mb-2">Player 2</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-600">Pieces:</span>
              <span>{stats.p2.pieces}</span>
              <span className="text-gray-600">Territory:</span>
              <span>{stats.p2.territory}%</span>
              <span className="text-gray-600">Influence:</span>
              <span>{stats.p2.influence}%</span>
              <span className="text-gray-600">Group Str:</span>
              <span>{stats.p2.groupsStrength}</span>
              <span className="text-gray-600 pt-2 border-t">Total:</span>
              <span className="font-bold text-red-600 pt-2 border-t">{stats.p2.total}</span>
            </div>
          </div>
        </div>

        {/* Balance Bar */}
        <div className="bg-gray-100 rounded p-2 mt-2">
          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
      </div>
    </Card>
  </div>
);
};