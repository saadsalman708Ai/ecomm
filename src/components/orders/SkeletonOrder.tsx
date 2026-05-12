import React from 'react';

export const SkeletonOrder = () => {
  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-sm relative animate-pulse">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <div className="h-2.5 w-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col items-end">
           <div className="h-2.5 w-16 bg-gray-200 rounded mb-2"></div>
           <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4 mt-6">
        <div>
           <div className="h-2.5 w-16 bg-gray-200 rounded mb-2"></div>
           <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col items-end">
           <div className="h-2.5 w-20 bg-gray-200 rounded mb-2"></div>
           <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t border-border flex justify-between items-center bg-gray-50/50 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
         <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
         </div>
      </div>
    </div>
  );
};
