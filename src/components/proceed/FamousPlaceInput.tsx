import React from 'react';

export const FamousPlaceInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-foreground-muted mb-1">Famous Place Nearby (Optional)</label>
      <input 
        type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-white"
        placeholder="e.g. Near KFC, Behind City School..."
      />
    </div>
  );
};
