import React from 'react';
import { SkeletonOrder } from './SkeletonOrder';

export const SkeletonOrderList = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonOrder key={index} />
      ))}
    </div>
  );
};
