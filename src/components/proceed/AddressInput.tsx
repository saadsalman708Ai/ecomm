import React, { useRef, useEffect } from 'react';

export const AddressInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight > 0 ? `${scrollHeight}px` : 'auto';
    }
  }, [value]);

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-foreground-muted mb-1 flex justify-between">
        <span>Detailed Address</span>
        {(!value || value.trim().length === 0) && <span className="text-error text-xs">required</span>}
      </label>
      <textarea 
        ref={textareaRef}
        required value={value} onChange={e => onChange(e.target.value)} rows={3}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-white resize-none overflow-hidden"
        placeholder="House no, Street no, Phase, Block, etc."
        style={{ minHeight: '80px' }}
      />
    </div>
  );
};

