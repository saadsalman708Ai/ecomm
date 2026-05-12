import React, { useState } from 'react';
import { BackButton } from './BackButton';
import { HomeButton } from './HomeButton';
import { ProfileButton } from './ProfileButton';
import { NotificationIcon } from './NotificationIcon';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AdminDashboardButton } from './AdminDashboardButton';

export const NavbarAdmin = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-50 flex items-center justify-between px-4 py-3 border-b border-border sticky top-0">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 -ml-1 text-foreground hover:bg-gray-100 rounded transition-colors mr-1"
          >
            <Menu size={24} />
          </button>
          <BackButton />
          <HomeButton />
        </div>
        <div className="flex items-center gap-4 md:gap-5">
          <AdminDashboardButton showText={false} />
          <NotificationIcon />
          <ProfileButton />
        </div>
      </nav>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
