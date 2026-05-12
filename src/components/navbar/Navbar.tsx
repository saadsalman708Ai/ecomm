import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavbarHome } from './NavbarHome';
import { NavbarSmall } from './NavbarSmall';
import { NavbarSearch } from './NavbarSearch';
import { NavbarBack } from './NavbarBack';
import { NavbarAdmin } from './NavbarAdmin';

export const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;
  
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdminRoute = pathname.startsWith('/dashboard');

  if (isAdminRoute) {
    return <NavbarAdmin />;
  }

  if (pathname === '/') {
    return isSmallScreen ? <NavbarSmall /> : <NavbarHome />;
  }

  if (pathname.startsWith('/search')) {
    return <NavbarSearch />;
  }

  // Hide nav for login/signup because they have distinct back buttons on the page level per prompt
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const backNavRoutes = ['/product', '/cart', '/proceed', '/my-orders', '/ordered', '/profile', '/contact', '/cancel-order'];
  const isBackNav = backNavRoutes.some(route => pathname.startsWith(route));

  if (isBackNav) {
    return <NavbarBack />;
  }

  return isSmallScreen ? <NavbarSmall hideSearchAndCategories /> : <NavbarHome hideSearchAndCategories />;
};
