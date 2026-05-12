import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { useAuth } from '../../../hooks/useAuth';
import type { Order } from '../../../types/order';
import { OrderStatusBadge } from '../../../components/orders/OrderStatusBadge';
import { CancelOrderButton } from '../../../components/orders/CancelOrderButton';
import { OrderItemRow } from '../../../components/orders/OrderItemRow';
import { SkeletonCard } from '../../../components/shared/SkeletonCard';
import { ErrorState } from '../../../components/shared/ErrorState';
import { formatDate } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/formatPrice';

export default function OrderedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!id || !user) return;
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Order;
        if (data.userId !== user.id) {
           setError('Unauthorized');
        } else {
           setOrder({ id: snap.id, ...data });
        }
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Error fetching order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, user]);

  if (loading) {
     return <div className="p-4 md:p-8 max-w-3xl mx-auto"><SkeletonCard /></div>;
  }

  if (error || !order) {
     return <div className="p-4 md:p-8 max-w-3xl mx-auto"><ErrorState title="Order unavailable" message={error} /></div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col flex-1 gap-6">
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <div className="text-xs font-bold text-foreground-muted tracking-wider uppercase mb-1">Order ID</div>
           <div className="text-base font-mono text-foreground font-semibold break-all">{order.id}</div>
           <div className="text-sm text-foreground-muted mt-2">{formatDate(order.createdAt)}</div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3">
          <OrderStatusBadge status={order.status} />
          {((order.status === 'waiting' || order.status === 'canceled') && order.userId === user?.id) && (
             <CancelOrderButton orderId={order.id} status={order.status} userId={order.userId} canceledBy={order.canceledBy} onSuccess={fetchOrder} />
          )}
        </div>
      </div>

      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
         <h3 className="text-lg font-bold text-foreground mb-4">Delivery Information</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
               <div className="text-xs text-foreground-muted mb-1">Name</div>
               <div className="text-sm font-medium text-foreground">{order.userInfo.fullName}</div>
            </div>
            <div>
               <div className="text-xs text-foreground-muted mb-1">Phone</div>
               <div className="text-sm font-medium text-foreground">{order.userInfo.phone} {order.userInfo.altPhone && ` / ${order.userInfo.altPhone}`}</div>
            </div>
            <div className="sm:col-span-2">
               <div className="text-xs text-foreground-muted mb-1">Address</div>
               <div className="text-sm font-medium text-foreground">
                 {order.userInfo.address}, {order.userInfo.area}, {order.userInfo.city}
                 {order.userInfo.famousPlace && <><br/>Near: {order.userInfo.famousPlace}</>}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
         <h3 className="text-lg font-bold text-foreground mb-4">Items ({order.items.length})</h3>
         <div className="flex flex-col gap-3">
            {order.items.map(item => (
               <OrderItemRow key={item.productId} item={item} />
            ))}
         </div>
         
         <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2 w-full sm:w-1/2 ml-auto">
            <div className="flex justify-between text-sm text-foreground-muted">
               <span>Subtotal</span>
               <span className="font-medium text-foreground">{formatPrice(order.totalAmount - order.deliveryCharges)}</span>
            </div>
            <div className="flex justify-between text-sm text-foreground-muted">
               <span>Delivery</span>
               <span className="font-medium text-foreground">{formatPrice(order.deliveryCharges)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-foreground mt-2 pt-2 border-t border-border">
               <span>Total</span>
               <span>{formatPrice(order.totalAmount)}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
