import React from 'react';

export const NameInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground-muted mb-1 flex justify-between">
        <span>Full Name</span>
        {(!value || value.trim().length === 0) && <span className="text-error text-xs">required</span>}
      </label>
      <input 
        type="text" required value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-white"
        placeholder="Enter your full name"
      />
    </div>
  );
};
