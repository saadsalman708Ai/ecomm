import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { COLLECTIONS } from '../lib/firebase/collections';
import { useAuth } from './useAuth';
import type { Order } from '../types/order';

export const useMyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
      setError('');
    }, (err: any) => {
      console.error(err);
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // refetch is no longer strictly needed with onSnapshot, but keep it for compatibility
  const refetch = () => {};

  return { orders, loading, error, refetch };
};
