import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { COLLECTIONS } from '../../lib/firebase/collections';
import { useAuth } from '../../hooks/useAuth';

export const NotificationIcon = () => {
  const { isAdmin } = useAuth();
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const checkNewOrders = async () => {
      try {
        const lastCheckedAt = Number(localStorage.getItem('adminLastCheckedOrdersAt') || '0');
        const q = query(
          collection(db, COLLECTIONS.ORDERS),
          where('status', '==', 'waiting')
        );
        const snap = await getDocs(q);
        const newOrders = snap.docs.some(doc => {
          const data = doc.data();
          return data.createdAt > lastCheckedAt;
        });
        setHasNew(newOrders);
      } catch (error) {
        console.error("Error checking orders", error);
      }
    };
    checkNewOrders();
  }, [isAdmin]);

  return (
    <Link to="/dashboard/orders" className="relative p-2 flex items-center justify-center text-foreground hover:bg-gray-100 rounded-full transition-colors">
      <Bell size={24} />
      {hasNew && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white pointer-events-none shadow-sm"></span>
      )}
    </Link>
  );
};
