import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrderStatus } from '../../types/order';

interface Props {
  orderId: string;
  status: OrderStatus;
  userId: string;
  canceledBy?: 'user' | 'admin';
  onSuccess?: () => void;
}

export const CancelOrderButton = ({ orderId, status, canceledBy }: Props) => {
  const navigate = useNavigate();
  const isCancelable = status === 'waiting';

  if (!isCancelable && status === 'canceled') {
     const cancelText = canceledBy === 'user' ? 'You have canceled this order.' : 'Order was Canceled';
     return <span className="text-sm font-medium text-error flex items-center justify-center">{cancelText}</span>;
  }

  if (!isCancelable) {
     return (
       <button disabled className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-semibold capitalize cursor-not-allowed">
         {status}
       </button>
     );
  }

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/cancel-order/${orderId}`);
      }}
      className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors bg-red-50 text-error hover:bg-error hover:text-white border border-red-200"
    >
      Cancel Order
    </button>
  );
};
