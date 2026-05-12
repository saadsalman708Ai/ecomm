import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const SectionOrderControl = ({ isFirst, isLast, onMoveUp, onMoveDown }: Props) => {
  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      <button 
        onClick={onMoveUp} disabled={isFirst} 
        className="p-1 rounded text-foreground-muted hover:bg-gray-100 hover:text-foreground disabled:opacity-20 transition-colors"
      >
        <ArrowUp size={16} />
      </button>
      <button 
        onClick={onMoveDown} disabled={isLast} 
        className="p-1 rounded text-foreground-muted hover:bg-gray-100 hover:text-foreground disabled:opacity-20 transition-colors"
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );
};
