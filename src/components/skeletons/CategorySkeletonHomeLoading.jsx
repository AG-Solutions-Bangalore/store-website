import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);

const CategorySkeletonHomeLoading = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-4 bg-gradient-to-br from-gray-100 to-gray-200 shadow-md flex flex-col items-center justify-center text-center"
            >
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySkeletonHomeLoading;

