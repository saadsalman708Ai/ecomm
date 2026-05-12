import React from 'react';
import type { OrderStatus } from '../../types/order';

interface Props {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string, classes: string }> = {
  waiting: { label: 'Waiting', classes: 'bg-yellow-50 text-yellow-700 border-orange-400 border-2' },
  approved: { label: 'Approved', classes: 'bg-blue-50 text-blue-700 border-blue-400' },
  pending: { label: 'Pending', classes: 'bg-purple-50 text-purple-700 border-purple-400' },
  completed: { label: 'Completed', classes: 'bg-green-50 text-green-700 border-green-400' },
  canceled: { label: 'Canceled', classes: 'bg-red-50 text-red-600 border-red-500 border' }
};

export const OrderStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${config.classes} shadow-sm uppercase tracking-wide inline-block leading-tight`}>
      {config.label}
    </span>
  );
};
