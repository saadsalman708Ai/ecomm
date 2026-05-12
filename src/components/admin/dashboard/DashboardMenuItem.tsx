import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export const DashboardMenuItem = ({ icon, label, to }: Props) => {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between p-4 bg-white border-b border-border hover:bg-gray-50 transition-colors last:border-b-0"
    >
      <div className="flex items-center gap-4">
        <div className="text-primary bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
        <span className="font-semibold text-foreground text-sm md:text-base">{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </Link>
  );
};
