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

        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={clsx(
                'rounded-xl p-1 shadow-lg transition-all duration-300 ease-in-out',
                'flex flex-col relative overflow-hidden',
                'w-full h-full',
                'min-h-[200px] xs:min-h-[250px] sm:min-h-[280px] md:min-h-[300px]',
                'bg-gradient-to-b from-gray-100 to-gray-200'
              )}
            >
              <div className="relative bg-white/80 rounded-lg p-4 shadow-sm border border-white/20 backdrop-blur-2xl w-full h-full flex flex-col items-center justify-center overflow-hidden">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySkeletonHomeLoading;
