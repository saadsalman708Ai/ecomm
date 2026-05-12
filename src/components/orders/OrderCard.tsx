import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { CancelOrderButton } from './CancelOrderButton';
import { formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatPrice';

export const OrderCard = React.memo(({ order, onStatusChange }: { order: Order, onStatusChange: () => void }) => {
  return (
    <Link to={`/ordered/${order.id}`} className="block bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <div className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase mb-1">
            Order
          </div>
          <div className="text-sm font-mono text-foreground font-semibold break-all">
            {order.id}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex justify-between items-end mt-6">
        <div>
           <div className="text-[11px] text-foreground-muted mb-1">Placed on</div>
           <div className="text-sm font-medium text-foreground">{formatDate(order.createdAt)}</div>
        </div>
        <div className="text-right">
           <div className="text-[11px] text-foreground-muted mb-1">Total Amount</div>
           <div className="text-lg font-bold text-foreground">{formatPrice(order.totalAmount)}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex justify-end">
        {/* We use stopPropagation so clicking cancel doesn't navigate to detail page */}
        <div onClick={e => e.preventDefault()}>
          <CancelOrderButton orderId={order.id} status={order.status} userId={order.userId} canceledBy={order.canceledBy} onSuccess={onStatusChange} />
        </div>
      </div>
    </Link>
  );
});
