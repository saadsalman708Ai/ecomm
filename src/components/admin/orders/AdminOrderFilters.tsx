import React from 'react';
import type { OrderStatus } from '../../../types/order';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeSort: string;
  onSortChange: (sort: string) => void;
}

const TABS = ['All', 'Waiting', 'Approved', 'Pending', 'Completed', 'Canceled'];
const SORTS = ['Latest', 'Oldest', 'Large', 'Smallest'];

export const AdminOrderFilters = ({ activeTab, onTabChange, activeSort, onSortChange }: Props) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar border-b border-border pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-2 px-1 whitespace-nowrap text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar">
         {SORTS.map(sort => (
           <button
             key={sort}
             onClick={() => onSortChange(sort)}
             className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
               activeSort === sort ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white border-border text-foreground-muted hover:bg-gray-50'
             }`}
           >
             {sort}
           </button>
         ))}
      </div>
    </div>
  );
};
