import { type PositionStrength } from '@/utils/analysis';

type PositionStatsProps = {
  player: number;
  stats: PositionStrength;
};



export const PositionStats = ({ player, stats }: PositionStatsProps) => {
  const color = player === 1 ? 'blue' : 'red';
  
  return (
    <div className={`flex flex-col p-4 rounded-lg border border-${color}-500`}>
      <div className="text-lg font-bold mb-2">Player {player}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-gray-600">Pieces:</span>
        <span className="font-medium">{stats.pieces}</span>
        
        <span className="text-gray-600">Territory:</span>
        <span className="font-medium">{stats.territory}%</span>
        
        <span className="text-gray-600">Influence:</span>
        <span className="font-medium">{stats.influence}%</span>
        
        <span className="text-gray-600">Groups:</span>
        <span className="font-medium">{stats.groupsStrength}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <span className="text-gray-600">Total:</span>
        <span className={`ml-2 font-bold text-${color}-600`}>
          {stats.total}
        </span>
      </div>
    </div>
  );
};
