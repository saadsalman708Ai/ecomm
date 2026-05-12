import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (type: 'dynamic' | 'image' | 'hero' | 'multi-image') => void;
}

export const AddSectionButton = ({ onAdd }: Props) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative mt-8">
      {!showOptions ? (
        <button 
          onClick={() => setShowOptions(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold hover:bg-primary/5 hover:border-primary/50 transition-colors"
        >
          <Plus size={24} />
          Add New Home Section
        </button>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-200 pr-12 relative">
           <button onClick={() => { onAdd('dynamic'); setShowOptions(false); }} className="py-3 px-4 bg-white border border-border hover:border-primary shadow-sm rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
             Dynamic Feed
           </button>
           <button onClick={() => { onAdd('image'); setShowOptions(false); }} className="py-3 px-4 bg-white border border-border hover:border-primary shadow-sm rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
             Image Banner
           </button>
           <button onClick={() => { onAdd('multi-image'); setShowOptions(false); }} className="py-3 px-4 bg-white border border-border hover:border-primary shadow-sm rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
             Linked Grid
           </button>
           <button onClick={() => { onAdd('hero'); setShowOptions(false); }} className="py-3 px-4 bg-white border border-border hover:border-primary shadow-sm rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
             Hero Block
           </button>
           <button onClick={() => setShowOptions(false)} className="absolute right-0 top-0 bottom-0 w-10 flex justify-center items-center font-bold text-foreground-muted hover:bg-gray-100 rounded-xl transition-colors">
             X
           </button>
        </div>
      )}
    </div>
  );
};
