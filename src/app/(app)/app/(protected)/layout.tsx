import { Header } from '@/components/app/Header'
import { Sidebar } from '@/components/app/Sidenav'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-svh">
      <Header />
      <Sidebar />
      <div className="pt-10 pl-32 pr-[70px]">{children}</div>
    </div>
  )
}
