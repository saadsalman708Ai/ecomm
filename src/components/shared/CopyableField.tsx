import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  label: string;
  value: string;
}

export const CopyableField = ({ label, value }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!value) return null;

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{label}</span>
      <div 
        className="group flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={handleCopy}
      >
        <span className="text-sm font-medium text-foreground break-all">{value}</span>
        <div className="shrink-0 ml-2">
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Copy size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};
