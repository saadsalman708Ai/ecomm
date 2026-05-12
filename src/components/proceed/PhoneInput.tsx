import React from 'react';

export const PhoneInput = ({ label, required, value, onChange }: { label: string, required?: boolean, value: string, onChange: (v: string) => void }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground-muted mb-1 flex justify-between">
        <span>{label} {!required && <span className="opacity-50">(Optional)</span>}</span>
        {required && (!value || value.length < 11) && <span className="text-error text-xs">required</span>}
      </label>
      <input 
        type="tel" required={required} value={value} onChange={e => {
          const val = e.target.value;
          let cleanVal = val.replace(/[^\d+]/g, '');
          if (cleanVal.includes('+')) {
            const hasLeadingPlus = cleanVal.startsWith('+');
            cleanVal = cleanVal.replace(/\+/g, '');
            if (hasLeadingPlus) {
              cleanVal = '+' + cleanVal;
            }
          }
          onChange(cleanVal);
        }}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-white"
        placeholder={required ? "03XXXXXXXXX" : label}
      />
    </div>
  );
};
