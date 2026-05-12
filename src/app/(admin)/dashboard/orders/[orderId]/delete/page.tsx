import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../../../lib/firebase/collections';
import type { Order } from '../../../../../../types/order';
import { OrderStatusBadge } from '../../../../../../components/orders/OrderStatusBadge';
import { SkeletonCard } from '../../../../../../components/shared/SkeletonCard';
import { formatDate } from '../../../../../../utils/dateUtils';
import { useAuth } from '../../../../../../hooks/useAuth';

export default function AdminDeleteOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
        if (snap.exists()) {
          const data = snap.data() as Order;
          if (data.status === 'completed' || data.status === 'canceled') {
            setOrder({ id: snap.id, ...data });
          } else {
            setError('Only completed or canceled orders can be deleted.');
          }
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, isAdmin, navigate]);

  const handleDelete = async () => {
    if (!order || deleting) return;
    
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.ORDERS, order.id));
      navigate('/dashboard/orders', { replace: true });
    } catch (err) {
      console.error(err);
      message.error('Failed to delete order. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] flex-1">
      {loading ? (
        <div className="w-full max-w-[400px]"><SkeletonCard /></div>
      ) : (
        error ? (
          <div className="text-error bg-white p-6 rounded-xl shadow-sm border border-border">{error}</div>
        ) : order ? (
          <div className="bg-white border border-border p-8 rounded-3xl shadow-sm text-center max-w-[400px] w-full">
            <h1 className="text-2xl font-bold text-foreground mb-2">Delete Order?</h1>
            <p className="text-foreground-muted mb-6">Are you sure you want to permanently delete this order?</p>
            
            <div className="flex flex-col gap-4 text-left border border-border p-5 rounded-2xl bg-gray-50 mb-8">
              <div>
                <div className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Order ID</div>
                <div className="text-sm font-mono text-foreground font-semibold break-all">{order.id}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1">Date</div>
                  <div className="text-sm font-medium text-foreground">{formatDate(order.createdAt)}</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-foreground-muted uppercase tracking-wider mb-2">Status</div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="bg-red-50 text-error p-4 rounded-xl text-sm font-medium mb-8 border border-red-100">
              This action cannot be undone. Completely removes the order from the database.
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-4 bg-red-50 text-error border border-error/20 rounded-xl font-bold hover:bg-error hover:text-white transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
              <button 
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                className="w-full py-4 bg-white text-foreground border border-border rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                No, Keep Order
              </button>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
