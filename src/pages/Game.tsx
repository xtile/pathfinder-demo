import React, { useReducer, useState, useMemo, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cell } from '@/components/Cell';
import { P, O, A, Board } from '@/types';
import { reducer, initialState } from '@/store/reducer';
import { AI } from '@/ai';
import { checkEnd } from '@/utils/board';

import { PositionStats } from '@/components/PositionStats';
import { analyzePosition } from '@/utils/analysis';

export const Game = () => {
  const [st, dispatch] = useReducer(reducer, initialState);
  const [op, setOp] = useState(O.PL);
  const [sel, setSel] = useState(null);
  const [alt, setAlt] = useState(false);
  const [msg, setMsg] = useState('');
  const [map, setMap] = useState(true);
  const [ai, setAi] = useState(true);

  const stats = useMemo(() => ({
    p1: analyzePosition(st.board, P.A),
    p2: analyzePosition(st.board, P.B)
  }), [st.board]);  

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

  // click и scores handlers остаются такими же как были...

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <Card className="p-4">
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
        {/* UI остается так же... */}

        {/* Добавляем статистику под доской */}
        <div className="mt-4 flex justify-around">
          <PositionStats player={1} stats={stats.p1} />
          <div className="w-px bg-gray-200 mx-4" /> {/* разделитель */}
          <PositionStats player={2} stats={stats.p2} />
        </div>

        {/* Добавляем относительную силу позиции */}
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
        {/* AlertDialog остается так же... */}
      </AlertDialog>
    </div>
  );
};
