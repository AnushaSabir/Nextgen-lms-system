import React from 'react'

export default function AdminLoading() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-[#001A3B] rounded-lg w-1/4"></div>
        <div className="h-4 bg-[#001229] rounded-lg w-1/3"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-[#001A3B]/40 rounded-3xl p-6 h-96 border border-[#002855]"></div>
    </div>
  )
}
