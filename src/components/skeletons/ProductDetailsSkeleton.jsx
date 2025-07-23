import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full py-4 md:py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Image Section */}
          <div className="space-y-4 border p-1 rounded-md border-gray-200">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[...Array(2)].map((_, index) => (
                <Skeleton key={index} className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4 md:space-y-6 relative col-span-1 md:col-span-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />

            <div className="space-y-2 text-sm">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="w-24 md:w-32 h-4 mr-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="px-4 py-2 h-8 w-16" />
              ))}
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              <Skeleton className="w-24 h-10" />
              <Skeleton className="flex-1 h-10" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 md:mt-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="w-28 h-10 rounded-md" />
            ))}
          </div>

          <div className="mt-1 border border-gray-200 rounded-md p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* Related Products Title */}
        <div className="mb-6 md:mb-8 mt-8 md:mt-12 flex flex-col items-center gap-3 md:gap-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Related Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
