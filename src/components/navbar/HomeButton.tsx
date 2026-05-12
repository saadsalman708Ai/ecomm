import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const HomeButton = () => {
  return (
    <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-foreground">
      <Home size={24} />
    </Link>
  );
};
