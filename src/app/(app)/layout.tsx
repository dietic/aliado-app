import { Sidebar } from '@/components/shared/Sidenav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-svh">
      <Sidebar />
      {children}
    </div>
  )
}
