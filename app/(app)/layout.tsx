import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppNavbar } from '@/components/app-navbar'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/components/protected-route'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppNavbar />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ProtectedRoute>
  )
}
