import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="glow-card p-8 animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="h-3 w-32 bg-white/5 rounded-full" />
      <div className="h-5 w-5 bg-white/5 rounded-lg" />
    </div>
    <div className="flex items-end justify-between">
      <div className="space-y-3">
        <div className="h-10 w-20 bg-white/5 rounded-xl" />
        <div className="h-3 w-12 bg-white/5 rounded-full" />
      </div>
      <div className="h-12 w-24 bg-white/5 rounded-lg" />
    </div>
  </div>
);

const SkeletonDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 premium-card bg-white/5 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-3 w-40 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="h-12 w-80 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Filter Area Skeleton */}
      <div className="premium-card p-8 space-y-8 animate-pulse">
        <div className="flex gap-6">
          <div className="flex-1 h-14 bg-white/5 rounded-xl" />
          <div className="w-48 h-14 bg-white/5 rounded-xl" />
          <div className="w-28 h-14 bg-white/5 rounded-xl" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-white/5 rounded-full ml-1" />
              <div className="h-12 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="premium-card min-h-[400px] flex flex-col items-center justify-center p-12">
        <div className="w-20 h-20 bg-white/5 rounded-3xl animate-pulse mb-6" />
        <div className="h-6 w-48 bg-white/5 rounded-xl animate-pulse mb-3" />
        <div className="h-3 w-64 bg-white/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonDashboard;
