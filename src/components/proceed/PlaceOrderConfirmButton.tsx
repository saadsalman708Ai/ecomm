import React from 'react';

export const PlaceOrderConfirmButton = ({ loading, disabled }: { loading: boolean, disabled: boolean }) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-sm ${
        disabled || loading
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-primary text-white hover:opacity-90 active:scale-[0.98]'
      }`}
    >
      {loading ? 'Processing Order...' : 'Confirm Order'}
    </button>
  );
};
