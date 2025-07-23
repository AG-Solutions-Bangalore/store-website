import React from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const SkeletonBox = ({ className }) => (
  <div className={clsx("animate-pulse bg-gray-200 rounded", className)} />
);

const SkeletonFilterSection = ({ title, count = 4 }) => (
  <div className="bg-white rounded-md border border-gray-200 p-6 space-y-3">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ChevronDown className="w-5 h-5 text-gray-500" />
    </div>
    <hr className="mb-2 text-gray-200" />
    {[...Array(count)].map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <SkeletonBox className="w-4 h-4" />
        <SkeletonBox className="h-4 w-24" />
      </div>
    ))}
  </div>
);

const SkeletonProductCard = () => (
  <div className="bg-white border border-gray-200 rounded-md p-4 animate-pulse">
    <SkeletonBox className="h-48 w-full mb-4" />
    <SkeletonBox className="h-4 w-3/4 mb-2" />
    <SkeletonBox className="h-4 w-1/2 mb-2" />
    <SkeletonBox className="h-4 w-1/3" />
  </div>
);

const SkeletonProductAllLoading = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-80 space-y-6 hidden lg:block">
            <SkeletonFilterSection title="Category" />
            <SkeletonFilterSection title="Weight" />
            <SkeletonFilterSection title="Price" count={2} />
          </div>

          {/* Right Main Content */}
          <div className="flex-1">
            {/* Top Filters & Controls */}
            <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <SkeletonBox className="h-8 w-48" />
                <div className="flex items-center space-x-2">
                  <SkeletonBox className="h-8 w-8" />
                  <SkeletonBox className="h-8 w-48" />
                  <SkeletonBox className="h-8 w-36" />
                  <SkeletonBox className="h-8 w-32" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-center space-x-2">
              <SkeletonBox className="h-9 w-9 rounded-md" />
              {[...Array(3)].map((_, i) => (
                <SkeletonBox key={i} className="h-9 w-9 rounded-md" />
              ))}
              <SkeletonBox className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductAllLoading;
