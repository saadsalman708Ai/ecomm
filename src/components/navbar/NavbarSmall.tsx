import React, { useState } from 'react';
import { Logo } from './Logo';
import { ProfileButton } from './ProfileButton';
import { CartIcon } from './CartIcon';
import { SearchInput } from './SearchInput';
import { CategoryBar } from './CategoryBar';
import { AdminDashboardButton } from './AdminDashboardButton';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export const NavbarSmall = ({ hideSearchAndCategories }: { hideSearchAndCategories?: boolean }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { scrollDir, isAtTop } = useScrollDirection();

  return (
    <>
      <nav className={`bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-50 flex flex-col w-full sticky top-0 transition-transform duration-300 ${scrollDir === 'down' && !isAtTop ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 -ml-1 text-foreground hover:bg-gray-100 rounded transition-colors"
            >
              <Menu size={24} />
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <AdminDashboardButton showText={false} />
            <ProfileButton showTextOnLogout={false} />
            <CartIcon />
          </div>
        </div>
        {!hideSearchAndCategories && (
          <>
            <div className="px-4 py-3 border-b border-border">
              <SearchInput fullWidth={true} />
            </div>
            <CategoryBar />
          </>
        )}
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
