import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../lib/firebase/collections';
import type { Order } from '../../../../types/order';
import { AdminOrderFilters } from '../../../../components/admin/orders/AdminOrderFilters';
import { AdminOrderCard } from '../../../../components/admin/orders/AdminOrderCard';
import { SkeletonOrderList } from '../../../../components/orders/SkeletonOrderList';
import { EmptyState } from '../../../../components/shared/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [activeSort, setActiveSort] = useState('Latest');
  const navigate = useNavigate();
  const [pageSize] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20);
  const [displayCount, setDisplayCount] = useState(pageSize);

  const { ref, inView } = useInView({
    rootMargin: '100% 40% 100% 40%',
  });

  useEffect(() => {
    if (inView && !loading) {
      setDisplayCount(prev => prev + pageSize);
    }
  }, [inView, loading]);

  const fetchOrders = () => {
    setLoading(true);
    const q = query(collection(db, COLLECTIONS.ORDERS));
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsub = fetchOrders();
    return () => unsub();
  }, []);

  const handleDelete = (orderId: string) => {
    navigate(`/dashboard/orders/${orderId}/delete`);
  };

  const handleTabChange = (t: string) => { setActiveTab(t); setDisplayCount(pageSize); };
  const handleSortChange = (s: string) => { setActiveSort(s); setDisplayCount(pageSize); };

  const displayedOrders = useMemo(() => {
    let filtered = [...orders];
    if (activeTab !== 'All') {
      filtered = filtered.filter(o => o.status === activeTab.toLowerCase());
    }

    if (activeSort === 'Latest') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (activeSort === 'Oldest') {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (activeSort === 'Large') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (activeSort === 'Smallest') {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    }
    return filtered;
  }, [orders, activeTab, activeSort]);

  const paginatedOrders = displayedOrders.slice(0, displayCount);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Orders</h1>
      
      <AdminOrderFilters 
        activeTab={activeTab} onTabChange={handleTabChange}
        activeSort={activeSort} onSortChange={handleSortChange}
      />

      {loading ? (
        <SkeletonOrderList count={4} />
      ) : paginatedOrders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {paginatedOrders.map(order => (
              <AdminOrderCard key={order.id} order={order} onRefresh={fetchOrders} onDelete={handleDelete} />
            ))}
          </div>
          {displayCount < displayedOrders.length && (
             <div ref={ref} className="h-20 flex justify-center items-center mt-4 text-foreground-muted">
               Loading more...
             </div>
           )}
        </>
      ) : (
        <EmptyState title="No orders found" description={`There are no orders matching "${activeTab}".`} />
      )}
    </div>
  );
}


