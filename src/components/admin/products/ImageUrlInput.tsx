import React from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export const ImageUrlInput = ({ urls, onChange }: Props) => {
  const handleAdd = () => onChange([...urls, '']);
  
  const handleUpdate = (index: number, val: string) => {
    const newUrls = [...urls];
    newUrls[index] = val;
    onChange(newUrls);
  };
  
  const handleRemove = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newUrls = [...urls];
    [newUrls[index-1], newUrls[index]] = [newUrls[index], newUrls[index-1]];
    onChange(newUrls);
  };

  const moveDown = (index: number) => {
    if (index === urls.length - 1) return;
    const newUrls = [...urls];
    [newUrls[index+1], newUrls[index]] = [newUrls[index], newUrls[index+1]];
    onChange(newUrls);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-foreground-muted">Product Images (URLs)</label>
      {urls.map((url, i) => (
         <div key={i} className="flex items-center gap-2">
            <input 
              type="text" value={url} onChange={e => handleUpdate(i, e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://..."
            />
            <div className="flex flex-col ml-1 border-l border-border pl-1 my-1 shrink-0 gap-1">
               <button type="button" onClick={() => moveUp(i)} disabled={i===0} className="text-gray-400 hover:text-primary disabled:opacity-30 p-1 flex items-center justify-center">▲</button>
               <button type="button" onClick={() => moveDown(i)} disabled={i===urls.length-1} className="text-gray-400 hover:text-primary disabled:opacity-30 p-1 flex items-center justify-center">▼</button>
            </div>
            <button type="button" onClick={() => handleRemove(i)} className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
               <X size={18} />
            </button>
         </div>
      ))}
      <button type="button" onClick={handleAdd} className="flex items-center justify-center gap-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 py-2 rounded-lg transition-colors mt-2">
        <Plus size={16} /> Add Image Link
      </button>
    </div>
  );
};
