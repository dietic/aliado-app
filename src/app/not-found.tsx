'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col dark:from-slate-900 dark:to-slate-800">
      <header className="py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#000041] to-[#1a1a6c] bg-clip-text text-transparent dark:text-white">
              Aliado
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden text-center dark:bg-slate-700"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1a1a6c] rounded-full blur-3xl opacity-5"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#3a3a9c] rounded-full blur-3xl opacity-5"></div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-8 relative"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full flex items-center justify-center mx-auto dark:bg-slate-400">
                  <Search className="w-16 h-16 md:w-20 md:h-20 text-[#000041] dark:text-slate-200" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-200"
              >
                Página no encontrada
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-slate-600 mb-8 max-w-xl mx-auto dark:text-slate-400"
              >
                Lo sentimos, la página que estás buscando no existe o ha sido movida a otra
                ubicación.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#000041] to-[#1a1a6c] hover:from-[#000041] hover:to-[#3a3a9c] text-white"
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-[#000041] text-[#000041] hover:bg-indigo-50 dark:hover:bg-slate-300"
                >
                  <Link href="/contact">Contactar soporte</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-12 pt-8 border-t border-slate-100"
              >
                <p className="text-slate-500 dark:text-slate-400">
                  ¿Necesitas ayuda? Escríbenos a{' '}
                  <a
                    href="mailto:soporte@aliado.com"
                    className="text-[#000041] hover:underline dark:text-slate-200"
                  >
                    soporte@aliado.com
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Aliado. Todos los derechos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
