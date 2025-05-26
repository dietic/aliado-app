'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MotionDiv } from '../shared/DynamicMotion'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/shared/ThemeToggle'
import ThemedImage from '@/components/shared/ThemedImage'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <ThemedImage
              lightSrc="/logo-aliado.png"
              darkSrc="/logo-aliado-blanco.png"
              alt="Aliado logo"
              width={80}
              height={0}
              priority
            />
          </MotionDiv>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Servicios
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className=" border-primary text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <Link href="/app/auth?mode=login">Iniciar sesión</Link>
          </Button>
          <Button className=" bg-gradient-to-r from-primary to-[#1a1a6c] text-white">
            <Link href="/app/auth?mode=signup">Registrarse</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-slate-900 dark:text-white"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {mobileMenuOpen && (
        <MotionDiv
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-[#1a1a6c] bg-clip-text text-transparent">
              Aliado
            </span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-6">
            <Link
              href="#how-it-works"
              className="text-lg font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#services"
              className="text-lg font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="#faq"
              className="text-lg font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-4 mt-4">
              <Button variant="outline" className="rounded-full border-primary text-primary">
                <Link href="/app/auth?mode=login">Iniciar sesión</Link>
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-primary to-[#1a1a6c] text-white">
                <Link href="/app/auth?mode=signup">Registrarse</Link>
              </Button>
            </div>
          </div>
        </MotionDiv>
      )}
    </header>
  )
}
