import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../lib/firebase/collections';
import { useAuth } from '../../../../hooks/useAuth';
import type { Order } from '../../../../types/order';
import { formatDate } from '../../../../utils/dateUtils';
import { OrderStatusBadge } from '../../../../components/orders/OrderStatusBadge';
import { OrderSuspenseLoader } from '../../../../components/shared/OrderSuspenseLoader';

export default function CancelOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !user) return;
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
        if (snap.exists()) {
          const data = snap.data() as Order;
          if (data.userId !== user.id) {
            setError('Unauthorized');
          } else if (data.status !== 'waiting') {
            setError('Only waiting orders can be canceled.');
          } else {
            setOrder({ id: snap.id, ...data });
          }
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  const handleCancel = async () => {
    if (!order || canceling) return;
    setCanceling(true);
    try {
      const batch = writeBatch(db);
      const ref = doc(db, COLLECTIONS.ORDERS, order.id);
      
      batch.update(ref, { 
        status: 'canceled',
        canceledBy: 'user',
        updatedAt: Date.now() 
      });

      for (const item of order.items) {
        const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
        batch.update(productRef, { 
           quantity: increment(item.quantity),
           inOrder: increment(-item.quantity)
        });
      }

      await batch.commit();

      navigate('/my-orders', { replace: true });
    } catch (err) {
      console.error(err);
      message.error('Failed to cancel order. Please ensure you are connected and the order is still waiting.');
      setCanceling(false);
    }
  };

  if (loading) return (
    <div className="w-full flex-1 flex flex-col bg-gray-50 min-h-screen">
      <OrderSuspenseLoader />
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col bg-gray-50 min-h-screen">
      
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {error ? (
          <div className="text-error bg-white p-6 rounded-xl shadow-sm border border-border">{error}</div>
        ) : order ? (
          <div className="bg-white border border-border p-8 rounded-3xl shadow-sm text-center max-w-[400px] w-full">
            <h1 className="text-2xl font-bold text-foreground mb-6">Cancel Order</h1>
            
            <div className="flex flex-col gap-4 text-left border border-border p-5 rounded-2xl bg-gray-50 mb-8">
              <div>
                <div className="text-[11px] font-bold text-foreground-muted tracking-wider uppercase mb-1">Order ID</div>
                <div className="text-sm font-mono text-foreground font-semibold break-all">{order.id}</div>
              </div>
              
              <div>
                <div className="text-[11px] font-bold text-foreground-muted tracking-wider uppercase mb-1">Placed on</div>
                <div className="text-sm font-medium text-foreground">{formatDate(order.createdAt)}</div>
              </div>
              
              <div>
                <div className="text-[11px] font-bold text-foreground-muted tracking-wider uppercase mb-2">Current Status</div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <p className="text-sm text-foreground font-bold mb-4">Are you sure?</p>
            <p className="text-xs text-foreground-muted mb-6 px-4">
              This action cannot be undone. Once canceled, you will need to create a new order to purchase these items.
            </p>
            
            <button 
              onClick={handleCancel}
              disabled={canceling}
              className="w-full py-4 bg-red-50 text-error border border-error/20 rounded-xl font-bold hover:bg-error hover:text-white transition-colors disabled:opacity-50"
            >
              {canceling ? 'Canceling...' : 'Yes, Cancel my Order'}
            </button>
            <button 
              onClick={() => navigate('/my-orders')}
              disabled={canceling}
              className="w-full mt-3 py-3 text-foreground-muted font-bold hover:text-foreground transition-colors disabled:opacity-50"
            >
              Keep Order
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
