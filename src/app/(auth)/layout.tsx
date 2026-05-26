import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* We can add a logo here */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">NextGen IT</h1>
          <p className="text-muted-foreground mt-2">Institute Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
