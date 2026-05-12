import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase/config';
import { COLLECTIONS } from '../../../../../lib/firebase/collections';
import type { Order, OrderStatus } from '../../../../../types/order';
import { OrderItemRow } from '../../../../../components/orders/OrderItemRow';
import { AdminOrderStatusSelect } from '../../../../../components/admin/orders/AdminOrderStatusSelect';
import { SkeletonCard } from '../../../../../components/shared/SkeletonCard';
import { ErrorState } from '../../../../../components/shared/ErrorState';
import { CopyableField } from '../../../../../components/shared/CopyableField';
import { formatDate } from '../../../../../utils/dateUtils';
import { formatPrice } from '../../../../../utils/formatPrice';
import { Trash2 } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
      if (snap.exists()) {
        const data = snap.data() as Order;
        setOrder({ id: snap.id, ...data });
        setAdminNote(data.adminNote || '');
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || newStatus === order.status) return;
    try {
      const ref = doc(db, COLLECTIONS.ORDERS, order.id);
      const batch = writeBatch(db);

      if (newStatus === 'canceled' && order.status !== 'canceled') {
        for (const item of order.items) {
          const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
          batch.update(productRef, { 
             quantity: increment(item.quantity),
             inOrder: increment(-item.quantity)
          });
        }
      } else if (newStatus === 'completed' && order.status !== 'completed') {
        for (const item of order.items) {
          const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
          batch.update(productRef, { 
             soldCount: increment(item.quantity),
             inOrder: increment(-item.quantity)
          });
        }
      }

      batch.update(ref, { 
        status: newStatus, 
        updatedAt: Date.now(),
        ...(newStatus === 'canceled' ? { canceledBy: 'admin' } : {}),
        ...(newStatus === 'completed' ? { completedAt: Date.now() } : {})
      });
      await batch.commit();

      fetchOrder();
    } catch (err) {
      console.error(err);
      message.error('Failed to update status');
    }
  };

  const handleSaveNote = async () => {
    if (!order) return;
    setSavingNote(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.ORDERS, order.id), {
        adminNote: adminNote.trim(),
        updatedAt: Date.now()
      });
      fetchOrder();
    } catch (err) {
      console.error(err);
      message.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
     return <div className="p-4 md:p-8 max-w-3xl mx-auto"><SkeletonCard /></div>;
  }

  if (error || !order) {
     return <div className="p-4 md:p-8 max-w-3xl mx-auto"><ErrorState title="Unavailable" message={error} /></div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col flex-1 gap-6">
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <div className="text-xs font-bold text-foreground-muted tracking-wider uppercase mb-1">Order ID</div>
           <div className="text-base font-mono text-foreground font-semibold break-all">{order.id}</div>
           <div className="text-sm text-foreground-muted mt-2">{formatDate(order.createdAt)}</div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 bg-gray-50 border border-border p-3 rounded-xl">
          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Change Status:</span>
          {order.status === 'canceled' && order.canceledBy === 'user' ? (
            <button disabled className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold cursor-not-allowed border border-red-500">
              User Canceled Order
            </button>
          ) : (
            <AdminOrderStatusSelect status={order.status} onChange={handleStatusChange} />
          )}
        </div>
      </div>

      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
         <h3 className="text-lg font-bold text-foreground mb-4">Customer & Delivery Information</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CopyableField label="Full Name" value={order.userInfo.fullName} />
            <CopyableField label="Phone Number" value={order.userInfo.phone} />
            {order.userInfo.altPhone && <CopyableField label="Second Phone Number" value={order.userInfo.altPhone} />}
            <CopyableField label="City" value={order.userInfo.city} />
            <CopyableField label="Area / Sector" value={order.userInfo.area} />
            {order.userInfo.famousPlace && <CopyableField label="Famous Place Nearby" value={order.userInfo.famousPlace} />}
         </div>
         <div className="mt-4">
            <CopyableField label="Detailed Address" value={order.userInfo.address} />
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
               <span>Total amount paid</span>
               <span className="text-xl text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
         </div>
      </div>

      {(order.status === 'completed' || order.status === 'canceled') && (
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
          <div>
            <h3 className="text-lg font-bold text-error flex items-center gap-2"><Trash2 size={20} /> Delete Order</h3>
            <p className="text-sm text-foreground-muted mt-1">This action cannot be undone. Completely removes the order from the database.</p>
          </div>
          <button 
            onClick={() => navigate(`/dashboard/orders/${order.id}/delete`)}
            className="px-6 py-2.5 font-bold text-error bg-red-50 hover:bg-error hover:text-white border border-error/20 rounded-xl transition-colors whitespace-nowrap"
          >
            Delete Permanently...
          </button>
        </div>
      )}

      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm mt-6">
         <h3 className="text-lg font-bold text-error mb-4">Admin Note (Hidden from users)</h3>
         <textarea 
            rows={3} 
            value={adminNote} 
            onChange={e => setAdminNote(e.target.value)} 
            className="w-full px-4 py-3 border border-orange-200 bg-orange-50/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-3" 
            placeholder="Internal tracking note..." 
         />
         <div className="flex justify-end">
            <button 
               onClick={handleSaveNote} 
               disabled={savingNote || adminNote.trim() === (order.adminNote || '')}
               className="px-6 py-2.5 font-bold text-white bg-primary disabled:opacity-50 hover:opacity-90 rounded-xl transition-opacity"
            >
               {savingNote ? 'Saving...' : 'Save Note'}
            </button>
         </div>
      </div>
    </div>
  );
}
