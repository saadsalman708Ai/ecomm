import React, { useState } from 'react';
import { SearchPageSelector } from '../shared/SearchPageSelector';
import { ChevronDown } from 'lucide-react';

export const AreaDropdown = ({ cityValue, value, onChange }: { cityValue: string, value: string, onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [areasData, setAreasData] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const disabled = !cityValue;

  const handleOpen = async () => {
    setOpen(true);
    if (!areasData && !loading) {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("https://raw.githubusercontent.com/saadsalman708/all-cities-and-areas-in-pakistan-aka-data/refs/heads/main/cna/areas.json");
        if (!res.ok) throw new Error('Failed to load areas');
        const data = await res.json();
        setAreasData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const currentAreas = (cityValue && areasData && areasData[cityValue]) ? areasData[cityValue] : [];

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-foreground-muted mb-1 flex justify-between">
          <span>Area / Sector</span>
          {!value && <span className="text-error text-xs">required</span>}
        </label>
        <button 
          type="button" 
          onClick={handleOpen}
          disabled={disabled}
          className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg text-left text-sm md:text-base flex justify-between items-center ${
            disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
          }`}
        >
          {value || <span className={disabled ? "text-gray-400" : "text-foreground-muted"}>Select your area</span>}
          <ChevronDown size={18} className="text-gray-400" />
        </button>
        <p className="text-xs text-foreground-muted mt-1.5 leading-snug">
          Please select the correct area. If you pick outside of your area, delivery will cost extra.
        </p>
      </div>

      {open && !disabled && (
        <SearchPageSelector 
          title="Select Area" 
          data={currentAreas} 
          loading={loading}
          error={error}
          selectedValue={value}
          onSelect={(a) => { onChange(a); setOpen(false); }} 
          onClose={() => setOpen(false)} 
        />
      )}
    </>
  );
};
