import React from 'react';
import { useMyOrders } from '../../../hooks/useMyOrders';
import { OrderCard } from '../../../components/orders/OrderCard';
import { SkeletonOrderList } from '../../../components/orders/SkeletonOrderList';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrdersPage() {
  const { orders, loading, error, refetch } = useMyOrders();

  if (loading) {
     return <div className="p-4 md:p-8"><SkeletonOrderList count={4} /></div>;
  }

  if (error) {
     return <div className="p-4 md:p-8 text-error">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-1">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>
      
      <div className="text-sm border border-border/80 bg-slate-100 rounded-xl p-4 md:p-5 w-full mb-6">
        Once order is approved, you cannot cancel it. Want to cancel or need help? <Link to="/contact" className="text-blue-500 hover:underline">Message us here</Link>.
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={refetch} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No orders yet" 
          description="You haven't placed any orders."
          action={
            <Link to="/" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity">
               Start Shopping
            </Link>
          }
        />
      )}
    </div>
  );
}
