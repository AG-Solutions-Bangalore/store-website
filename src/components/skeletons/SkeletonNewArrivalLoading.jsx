import clsx from "clsx";
import React from "react";
const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse bg-gray-200 rounded', className)} />
);
const SkeletonNewArrivalLoading = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-72 bg-gray-200 rounded-md mt-2 animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-gray-200 rounded-full animate-pulse w-20 h-8"
              ></div>
            ))}
          </div>
        </div>

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

export default SkeletonNewArrivalLoading;