import React from 'react';

interface Props {
  data: { number: string; enabled: boolean };
  onChange: (data: { number: string; enabled: boolean }) => void;
}

export const WhatsAppEdit = ({ data, onChange }: Props) => {
  return (
    <div className="p-4 border border-border rounded-xl bg-gray-50 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">WhatsApp Configuration</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={data.enabled} onChange={e => onChange({ ...data, enabled: e.target.checked })} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
        </label>
      </div>
      {data.enabled && (
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">WhatsApp Number</label>
          <input 
             type="text" value={data.number} onChange={e => onChange({ ...data, number: e.target.value })}
             className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
             placeholder="e.g. +1234567890"
          />
        </div>
      )}
    </div>
  );
};
