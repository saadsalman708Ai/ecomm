import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden h-full">
      <div className="w-full relative pt-[100%] bg-gray-50 flex-none border-b border-border">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="image-loader scale-50 opacity-50"></div>
          </div>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="flex gap-2 items-baseline mt-1">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
