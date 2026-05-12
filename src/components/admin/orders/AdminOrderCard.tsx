import { message } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../../../types/order';
import { formatDate } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/formatPrice';
import { AdminOrderStatusSelect } from './AdminOrderStatusSelect';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { COLLECTIONS } from '../../../lib/firebase/collections';
import { Trash2 } from 'lucide-react';

interface Props {
  order: Order;
  onRefresh: () => void;
  onDelete?: (orderId: string) => void;
}

export const AdminOrderCard = React.memo(({ order, onRefresh, onDelete }: Props) => {
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return;
    try {
      const ref = doc(db, COLLECTIONS.ORDERS, order.id);
      await updateDoc(ref, { 
        status: newStatus, 
        updatedAt: Date.now(),
        ...(newStatus === 'canceled' ? { canceledBy: 'admin' } : {}),
        ...(newStatus === 'completed' ? { completedAt: Date.now() } : {})
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      message.error('Failed to update status');
    }
  };

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
      <Link to={`/dashboard/orders/${order.id}`} className="block">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <div className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase mb-1">
              Order
            </div>
            <div className="text-sm font-mono text-foreground font-semibold break-all">
              {order.id}
            </div>
          </div>
          <div className="text-right">
             <div className="text-[11px] text-foreground-muted mb-1">Placed on</div>
             <div className="text-xs font-medium text-foreground">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
             <div className="text-[11px] text-foreground-muted mb-1">Customer</div>
             <div className="text-sm font-medium text-foreground">{order.userInfo.fullName}</div>
          </div>
          <div className="text-right">
             <div className="text-[11px] text-foreground-muted mb-1">Total Amount</div>
             <div className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</div>
          </div>
        </div>
      </Link>
      
      <div className="pt-4 border-t border-border flex justify-between items-center bg-gray-50/50 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
         <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Status:</span>
            {order.status === 'canceled' && order.canceledBy === 'user' ? (
              <button disabled className="px-3 py-1.5 bg-red-50 text-error rounded-lg text-sm font-semibold cursor-not-allowed border border-red-100">
                User Canceled Order
              </button>
            ) : (
              <AdminOrderStatusSelect status={order.status} onChange={handleStatusChange} />
            )}
         </div>
         {(order.status === 'completed' || order.status === 'canceled') && onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
              className="text-error bg-red-50 p-2 rounded-lg hover:bg-error hover:text-white transition-colors"
              title="Delete Order"
            >
              <Trash2 size={18} />
            </button>
         )}
      </div>
    </div>
  );
});
