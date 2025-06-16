'use client';

import type React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Users, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemedImage from '@/components/shared/ThemedImage';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, active, isCollapsed, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all dark:text-red-500 ${
        active
          ? 'bg-gradient-to-r from-primary to-[#1a1a6c] text-white'
          : 'text-slate-600 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <div className={`${isCollapsed ? 'w-5 h-5' : ''} dark:text-slate-200`}>{icon}</div>
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap dark:text-slate-200">{label}</span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const { signOut } = useAuth();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  const navItems = [
    { href: '/app/admin/users', icon: <Users className="h-5 w-5" />, label: 'Usuarios' },
    // { href: '/admin/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    // { href: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" />, label: 'Analíticas' },
    // { href: '/admin/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Mensajes' },
    // { href: '/admin/notifications', icon: <Bell className="h-5 w-5" />, label: 'Notificaciones' },
    // { href: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Configuración' },
  ];

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsCollapsed(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = async () => {
    console.log('Signing out...');

    await signOut();
  };

  const SidebarContent = () => (
    <>
      <div className={`px-3 py-4 flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
        <div
          className={`flex items-center mb-10 w-full px-3 py-2 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
        >
          {!isCollapsed ? (
            <Link href="/" className="flex items-center">
              <ThemedImage
                lightSrc="/logo-aliado.png"
                darkSrc="/logo-aliado-blanco.png"
                alt="Aliado logo"
                width={80}
                height={0}
                priority
              />
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center justify-center">
              <span className="text-2xl font-bold font-title text-slate-primary dark:text-slate-200">
                <ThemedImage
                  lightSrc="/isotipo.png"
                  darkSrc="/isotipo-blanco.png"
                  alt="Whatsapp background"
                  width={20}
                  height={0}
                  className="w-5"
                  priority
                ></ThemedImage>
              </span>
            </Link>
          )}
        </div>
        <div className={`space-y-1 ${isCollapsed ? 'w-full items-center' : 'w-full'}`}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
              isCollapsed={isCollapsed}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      </div>
      <div className={`mt-auto px-3 py-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-200"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 " />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:border-red-200 dark:hover:text-primary"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar Sesión
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <ScrollArea className="h-full py-6">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-30 transition-all duration-300 ease-in-out "
        style={{ width: isCollapsed ? '70px' : '240px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col flex-grow border-r border-slate-200 bg-white overflow-y-auto dark:bg-slate-800 dark:border-r-slate-700">
          <ScrollArea className="flex-1 flex flex-col min-h-0">
            <SidebarContent />
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
