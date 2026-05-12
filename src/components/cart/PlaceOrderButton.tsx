import React from 'react';
import { useNavigate } from 'react-router-dom';
import NProgress from 'nprogress';

export const PlaceOrderButton = ({ disabled }: { disabled: boolean }) => {
  const navigate = useNavigate();

  return (
    <button
      disabled={disabled}
      onClick={() => {
        NProgress.start();
        navigate('/proceed');
      }}
      className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-base transition-all h-[52px] ${
        disabled
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm'
      }`}
    >
      Proceed to Checkout
    </button>
  );
};
