import React from 'react';
import { BackButton } from './BackButton';
import { SearchInput } from './SearchInput';
import { ProfileButton } from './ProfileButton';
import { CartIcon } from './CartIcon';
import { HomeButton } from './HomeButton';
import { AdminDashboardButton } from './AdminDashboardButton';

export const NavbarSearch = () => {
  return (
    <nav className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-50 flex flex-col md:flex-row md:items-center px-4 py-3 border-b border-border sticky top-0 w-full">
      <div className="flex items-center justify-between md:w-auto w-full mb-3 md:mb-0 md:mr-4">
         <div className="flex items-center gap-1">
           <BackButton />
           <HomeButton />
         </div>
         <div className="flex md:hidden items-center gap-2 -mr-1">
           <AdminDashboardButton showText={false} />
           <ProfileButton showTextOnLogout={true} />
           <CartIcon />
         </div>
      </div>
      <div className="flex-1 flex justify-center w-full md:px-0 px-2 lg:px-8">
        <SearchInput fullWidth={true} />
      </div>
      <div className="hidden md:flex items-center gap-4 md:gap-5 ml-4">
        <AdminDashboardButton showText={false} />
        <ProfileButton showTextOnLogout={true} />
        <CartIcon />
      </div>
    </nav>
  );
};
