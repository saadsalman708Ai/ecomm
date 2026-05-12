import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchInputProps {
  fullWidth?: boolean;
}

export const SearchInput = ({ fullWidth = false }: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${fullWidth ? '' : 'max-w-[500px]'}`}>
      <input
        type="text"
        className="w-full py-2.5 px-4 pr-10 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white text-foreground placeholder:text-foreground-muted shadow-sm transition-shadow hover:border-gray-300"
        placeholder="Search products, categories, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
        <Search size={18} />
      </button>
    </form>
  );
};
