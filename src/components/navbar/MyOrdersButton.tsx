import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import { useAuth } from '../../hooks/useAuth';

export const MyOrdersButton = () => {
  const { user } = useAuth();
  const [hasOrders, setHasOrders] = useState(false);
  const location = useLocation();

  const isOrderPage = location.pathname.startsWith('/my-orders') || location.pathname.startsWith('/ordered');

  useEffect(() => {
    if (!user) return;
    const checkOrders = async () => {
      try {
        const q = query(
          collection(db, COLLECTIONS.ORDERS),
          where('userId', '==', user.id),
          limit(1)
        );
        const snap = await getDocs(q);
        setHasOrders(!snap.empty);
      } catch (error) {
        console.error("Orders fetching check", error);
      }
    };
    checkOrders();
  }, [user]);

  if (!user || !hasOrders || isOrderPage) return null;

  return (
    <Link to="/my-orders" className="p-2 px-3 md:px-4 flex items-center gap-2 font-bold text-sm justify-center text-foreground hover:bg-gray-100 rounded-full transition-colors relative" title="My Orders">
      <span className="whitespace-nowrap">My Orders</span>
      <Package size={20} />
    </Link>
  );
};
