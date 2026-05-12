import React from 'react';
import { Plus, X } from 'lucide-react';

interface ProductOption {
  title: string;
  options: string[];
}

interface Props {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export const ProductOptionsInput = ({ options, onChange }: Props) => {
  const handleAddSection = () => {
    onChange([...options, { title: '', options: [''] }]);
  };

  const handleUpdateSectionTitle = (index: number, title: string) => {
    const newOptions = [...options];
    newOptions[index].title = title;
    onChange(newOptions);
  };

  const handleRemoveSection = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    onChange(newOptions);
  };

  const handleUpdateOption = (sectionIndex: number, optionIndex: number, value: string) => {
    const newOptions = [...options];
    newOptions[sectionIndex].options[optionIndex] = value;
    onChange(newOptions);
  };

  const handleAddOption = (sectionIndex: number) => {
    const newOptions = [...options];
    newOptions[sectionIndex].options.push('');
    onChange(newOptions);
  };

  const handleRemoveOption = (sectionIndex: number, optionIndex: number) => {
    const newOptions = [...options];
    newOptions[sectionIndex].options.splice(optionIndex, 1);
    onChange(newOptions);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newOptions = [...options];
    [newOptions[index-1], newOptions[index]] = [newOptions[index], newOptions[index-1]];
    onChange(newOptions);
  };

  const moveSectionDown = (index: number) => {
    if (index === options.length - 1) return;
    const newOptions = [...options];
    [newOptions[index+1], newOptions[index]] = [newOptions[index], newOptions[index+1]];
    onChange(newOptions);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-foreground-muted">Product Options (Optional, e.g. Size, Color)</label>
        <button 
          type="button" 
          onClick={handleAddSection}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80"
        >
          <Plus size={16} /> Add Section
        </button>
      </div>

      {options.map((section, sIndex) => (
        <div key={sIndex} className="p-4 border border-border rounded-xl bg-gray-50 flex flex-col gap-3 group">
          <div className="flex gap-2 items-start">
            <div className="flex flex-col ml-1 border-r border-border pr-3 my-1 shrink-0 gap-1 mr-1 mt-5">
               <button type="button" onClick={() => moveSectionUp(sIndex)} disabled={sIndex===0} className="text-gray-400 hover:text-primary disabled:opacity-30 p-1 flex items-center justify-center">▲</button>
               <button type="button" onClick={() => moveSectionDown(sIndex)} disabled={sIndex===options.length-1} className="text-gray-400 hover:text-primary disabled:opacity-30 p-1 flex items-center justify-center">▼</button>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-foreground-muted mb-1 ml-1 uppercase tracking-wider">Section Title</label>
              <input 
                type="text"
                placeholder="e.g. Size, Color, Version"
                value={section.title}
                onChange={(e) => handleUpdateSectionTitle(sIndex, e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border shadow-sm rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button 
              type="button"
              onClick={() => handleRemoveSection(sIndex)}
              className="mt-6 p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-2 pl-4 border-l-2 border-border/50">
            {section.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex gap-2">
                <input 
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleUpdateOption(sIndex, oIndex, e.target.value)}
                  className="w-full px-3 py-1.5 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                />
                {section.options.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveOption(sIndex, oIndex)}
                    className="p-1.5 text-foreground-muted hover:text-error transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              onClick={() => handleAddOption(sIndex)}
              className="text-xs font-semibold text-primary hover:underline text-left mt-1 w-max"
            >
              + Add Option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
