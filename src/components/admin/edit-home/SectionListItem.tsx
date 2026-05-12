import React from 'react';
import type { HomeSectionConfig } from '../../../types/homeSection';
import { Edit, Image as ImageIcon, LayoutTemplate, Trash2 } from 'lucide-react';
import { SectionOrderControl } from './SectionOrderControl';

interface Props {
  section: HomeSectionConfig;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const SectionListItem = ({ section, isFirst, isLast, onMoveUp, onMoveDown, onDelete, onEdit }: Props) => {
  const Icon = section.type === 'hero' ? LayoutTemplate : ImageIcon;
  const isDynamic = section.type === 'dynamic';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white border border-border p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <SectionOrderControl isFirst={isFirst} isLast={isLast} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
          <Icon size={20} className="sm:hidden" />
          <Icon size={24} className="hidden sm:block" />
        </div>

        <div className="flex-1 min-w-0 sm:hidden">
          <h4 className="text-sm font-bold text-foreground break-words leading-tight">{section.title}</h4>
          <div className="flex flex-wrap gap-1.5 items-center mt-1">
             <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider bg-gray-100 text-gray-600">
               {section.type}
             </span>
             {isDynamic && section.category && (
               <span className="text-[10px] font-medium text-foreground-muted break-all shadow-sm border border-border bg-gray-50 px-2 py-0.5 rounded-full">
                 Cat: {section.category}
               </span>
             )}
          </div>
        </div>
      </div>
      
      <div className="hidden sm:block flex-1 min-w-0">
        <h4 className="text-base font-bold text-foreground break-words">{section.title}</h4>
        <div className="flex flex-wrap gap-2 items-center mt-1">
           <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-gray-100 text-gray-600">
             {section.type}
           </span>
           {isDynamic && section.category && (
             <span className="text-xs font-medium text-foreground-muted break-all shadow-sm border border-border bg-gray-50 px-2.5 py-0.5 rounded-full">
               Cat: {section.category}
             </span>
           )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto sm:border-l border-border pt-3 sm:pt-0 sm:pl-4 border-t sm:border-transparent mt-1 sm:mt-0 shrink-0 justify-end">
         <button onClick={onEdit} className="flex-1 sm:flex-none flex justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Section"><Edit size={18} className="sm:w-5 sm:h-5" /></button>
         <button onClick={onDelete} className="flex-1 sm:flex-none flex justify-center p-2 text-error hover:bg-red-50 rounded-lg transition-colors" title="Delete Section"><Trash2 size={18} className="sm:w-5 sm:h-5" /></button>
      </div>
    </div>
  );
};
