import React from 'react';
import { SCORE_OPTIONS } from '../../types';

interface ScoreSelectorProps {
  value: number;
  onChange: (score: number) => void;
}

const ScoreSelector: React.FC<ScoreSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">بارم:</label>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-white min-w-[90px]"
      >
        {SCORE_OPTIONS.map(s => (
          <option key={s} value={s}>{s} نمره</option>
        ))}
      </select>
    </div>
  );
};

export default ScoreSelector;
