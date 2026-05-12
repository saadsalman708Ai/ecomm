import React from 'react';
import type { OrderStatus } from '../../../types/order';

interface Props {
  status: OrderStatus;
  onChange: (newStatus: OrderStatus) => void;
  disabled?: boolean;
}

const statusOptions: { value: OrderStatus, label: string }[] = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'waiting': return 'bg-yellow-50 text-yellow-700 border-orange-400';
    case 'approved': return 'bg-blue-50 text-blue-700 border-blue-400';
    case 'pending': return 'bg-purple-50 text-purple-700 border-purple-400';
    case 'completed': return 'bg-green-50 text-green-700 border-green-400';
    case 'canceled': return 'bg-red-50 text-red-600 border-red-500';
    default: return 'bg-gray-50 text-gray-700 border-gray-400';
  }
};

export const AdminOrderStatusSelect = ({ status, onChange, disabled }: Props) => {
  const colorClass = getStatusColor(status);
  return (
    <select 
      value={status}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      disabled={disabled}
      className={`text-sm font-semibold rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer ${colorClass} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {statusOptions.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-white text-gray-800">{opt.label}</option>
      ))}
    </select>
  );
};

