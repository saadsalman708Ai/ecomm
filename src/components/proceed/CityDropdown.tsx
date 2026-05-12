import React, { useState } from 'react';
import { SearchPageSelector } from '../shared/SearchPageSelector';
import { ChevronDown } from 'lucide-react';

export const CityDropdown = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (cities.length === 0 && !loading) {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("https://raw.githubusercontent.com/saadsalman708/all-cities-and-areas-in-pakistan-aka-data/refs/heads/main/cna/city.json");
        if (!res.ok) throw new Error('Failed to load cities');
        const data = await res.json();
        setCities(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-1 flex justify-between">
          <span>City</span>
          {!value && <span className="text-error text-xs">required</span>}
        </label>
        <button 
          type="button" 
          onClick={handleOpen}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-left bg-white text-sm md:text-base flex justify-between items-center text-foreground"
        >
          {value || <span className="text-foreground-muted">Select your city</span>}
          <ChevronDown size={18} className="text-gray-400" />
        </button>
      </div>

      {open && (
        <SearchPageSelector 
          title="Select City" 
          data={cities} 
          loading={loading}
          error={error}
          selectedValue={value}
          onSelect={(c) => { onChange(c); setOpen(false); }} 
          onClose={() => setOpen(false)} 
        />
      )}
    </>
  );
};
