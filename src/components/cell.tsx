import { P } from '@/types';

type CellProps = {
  x: number;
  y: number;
  v: number;
  s: number;
  sel?: { x: number; y: number } | null;
  map: boolean;
  onClick: () => void;
};

export const Cell = ({ x, y, v, s, sel, map, onClick }: CellProps) => (
  <div
    className={`
      w-12 h-12 
      flex items-center justify-center 
      cursor-pointer
      relative
      rounded-sm
      font-medium
      ${v === P.N 
        ? 'bg-gray-50' 
        : v === P.A 
          ? 'bg-blue-500 text-white' 
          : 'bg-red-500 text-white'
      }
      ${sel?.x === x && sel?.y === y ? 'ring-2 ring-yellow-400' : ''}
      hover:opacity-90
      hover:scale-[1.02]
      active:scale-[0.98]
      text-xs
      transition-all duration-200 ease-in-out
      shadow-sm
    `}
    onClick={onClick}
    style={{
      backgroundColor: v === P.N && map 
        ? `hsla(${(1-s)*240},100%,50%,${0.1 + s*0.3})` 
        : undefined
    }}
  >
    {/* Отображаем номер игрока или значение heatmap */}
    {v !== P.N 
      ? (
        <span className="transform scale-110">
          {v === P.A ? '1' : '2'}
        </span>
      ) 
      : (
        map && (
          <span className="opacity-70">
            {s.toFixed(2)}
          </span>
        )
      )
    }
    
    {/* Добавляем едва заметный border для пустых ячеек */}
    {v === P.N && !map && (
      <div className="absolute inset-0 border border-gray-200 rounded-sm"></div>
    )}
  </div>
);