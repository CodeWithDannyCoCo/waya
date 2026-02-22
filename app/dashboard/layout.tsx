import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar - Fixed and non-scrollable */}
        <div className="flex-shrink-0 w-64 bg-white shadow-lg overflow-hidden">
          <Sidebar />
        </div>

        {/* Main content area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
