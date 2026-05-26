import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-[#001A3B] rounded-lg w-1/4"></div>
        <div className="h-4 bg-[#001229] rounded-lg w-1/3"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#001A3B]/40 rounded-3xl p-6 h-32 border border-[#002855]"></div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#001A3B]/40 rounded-3xl p-6 h-64 border border-[#002855]"></div>
          <div className="bg-[#001A3B]/40 rounded-3xl p-6 h-64 border border-[#002855]"></div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#001A3B]/40 rounded-3xl p-6 h-96 border border-[#002855]"></div>
        </div>
      </div>
    </div>
  )
}
