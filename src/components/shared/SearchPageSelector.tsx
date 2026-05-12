import React, { useState } from 'react';
import { Search, X, Check, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  title: string;
  data: string[];
  selectedValue?: string;
  loading?: boolean;
  error?: boolean;
  onSelect: (item: string) => void;
  onClose: () => void;
}

export const SearchPageSelector = ({ title, data, selectedValue, loading, error, onSelect, onClose }: Props) => {
  const [query, setQuery] = useState('');

  const filtered = data.filter(item => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full sm:max-w-xl sm:rounded-2xl flex flex-col sm:max-h-[85vh] h-full sm:h-auto overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 sm:py-4 border-b border-border shadow-sm">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-foreground-muted hover:text-foreground">
            <X size={22} />
          </button>
          <h2 className="text-lg font-bold flex-1 text-foreground">{title}</h2>
        </div>
        <div className="p-4 bg-gray-50 border-b border-border">
          <div className="relative">
            <input
              type="text"
              className="w-full py-3 px-4 pl-11 rounded-xl border border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm bg-white shadow-sm transition-all"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto w-full px-2 py-2 bg-white show-scrollbar">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Loader2 size={32} className="text-primary animate-spin mb-3" />
              <div className="text-foreground font-semibold">Loading...</div>
            </div>
          ) : error ? (
            <div className="p-12 text-center flex flex-col items-center">
              <AlertCircle size={32} className="text-error mb-3" />
              <div className="text-foreground font-semibold">Couldn't load</div>
              <div className="text-sm text-foreground-muted mt-1">Please check your connection and try again</div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="flex flex-col">
              {filtered.map(item => {
                const isSelected = item === selectedValue;
                return (
                  <button
                    key={item}
                    onClick={() => onSelect(item)}
                    className={`py-3.5 px-4 mb-1 rounded-xl text-left text-[15px] font-medium transition-colors flex items-center justify-between group ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-primary/5 hover:text-primary'}`}
                  >
                    {item}
                    {isSelected ? (
                      <Check size={18} className="text-primary" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <div className="text-foreground font-semibold">No results found</div>
              <div className="text-sm text-foreground-muted mt-1">Try a different search term</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
