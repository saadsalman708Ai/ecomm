import React from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileButton = ({ showTextOnLogout = false }: { showTextOnLogout?: boolean }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link to="/signup" className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-full hover:bg-gray-50 transition-colors text-[13px] font-medium text-foreground">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon size={12} className="text-gray-500" />
        </div>
        {showTextOnLogout ? "Sign Up" : "Guest User"}
      </Link>
    );
  }

  return (
    <Link to="/profile" className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors text-foreground">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <UserIcon size={16} />
      </div>
    </Link>
  );
};
