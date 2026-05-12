import React from 'react';
import { useLocation } from 'react-router-dom';
import { BackButton } from './BackButton';
import { HomeButton } from './HomeButton';
import { ProfileButton } from './ProfileButton';
import { CartIcon } from './CartIcon';
import { MyOrdersButton } from './MyOrdersButton';
import { AdminDashboardButton } from './AdminDashboardButton';

export const NavbarBack = () => {
  const { pathname } = useLocation();

  const hideCart = pathname.startsWith('/proceed') || pathname.startsWith('/cart');
  const isProfilePage = pathname.startsWith('/profile');
  const isCartPage = pathname.startsWith('/cart');

  return (
    <nav className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] z-50 flex items-center justify-between px-4 py-3 border-b border-border sticky top-0">
      <div className="flex items-center gap-1">
        <BackButton />
        <HomeButton />
      </div>
      <div className="flex items-center gap-2 md:gap-5">
        <AdminDashboardButton showText={false} />
        {(isProfilePage || isCartPage) && <MyOrdersButton />}
        {!isProfilePage && <ProfileButton showTextOnLogout={true} />}
        {!hideCart && <CartIcon />}
      </div>
    </nav>
  );
};
