import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);

const SkeletonDealOfTheDay = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Skeleton */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Grid of Product Skeleton Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-2 bg-white shadow-sm border border-gray-100"
            >
              <div className="relative">
                <Skeleton className="w-full h-40 rounded-md mb-2" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDealOfTheDay;