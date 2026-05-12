import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboardButton = ({ showText = false }: { showText?: boolean }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <Link 
      to="/dashboard" 
      className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 text-primary rounded-full hover:bg-primary/10 transition-colors text-[13px] font-bold"
      title="Admin Dashboard"
    >
      <LayoutDashboard size={14} />
      {showText && <span className="hidden sm:inline">Dashboard</span>}
    </Link>
  );
};
