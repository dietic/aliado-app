'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock, MessageSquare, Search, Send } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-[#000041]/10 to-[#1a1a6c]/10 dark:from-[#000041]/20 dark:to-[#1a1a6c]/20 pt-[84px]">
      <div className=" max-w-[1300px] mx-auto flex pt-16 pb-24 flex-col md:flex-row ">
        <div className="flex-1 p-5">
          <motion.h6
            className="px-6 py-1 bg-indigo-100 rounded-full font-semibold text-sm text-primary shadow-xs inline-block mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            La forma más inteligente de encontrar profesionales
          </motion.h6>
          <motion.h1
            className="text-5xl font-bold leading-16 font-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Conectamos con los <br />
            <span className="text-primary text-5xl">mejores profesionales</span>
            <br /> en segundos
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Aliado utiliza IA para conectarte con los profesionales más calificados en Lima. Desde
            plomeros hasta fotógrafos, encuentra el servicio que necesitas en minutos, no en días.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="¿Qué servicio necesitas?"
                className="pl-10 pr-4 py-6 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30 py-6"
            >
              Buscar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <div className="flex-1 relative">
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative z-10 mx-auto">
              <motion.div
                className="relative overflow-hidden rounded-[40px] border-8 border-primary bg-white shadow-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src="/whatsapp-background.png"
                  alt="Aliado App Interface"
                  width={300}
                  height={300}
                  className="h-[400px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20 flex flex-col">
                  <div className="mt-auto p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">AI</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            Hola! Soy Aliado. ¿Qué servicio estás buscando hoy?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary rounded-2xl p-4 mb-4 ml-auto max-w-[80%] shadow-lg">
                      <p className="text-sm text-white">
                        Necesito un plomero para arreglar una fuga en mi baño
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">AI</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            ¡Perfecto! Estoy buscando los mejores plomeros cerca de ti...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-10">
                      <div className="rounded-full border border-white bg-white dark:border-slate-700 px-4 py-2 text-slate-500 dark:text-slate-400 text-sm">
                        <span>Escribe tu mensaje...</span>
                        <span className="ml-px animate-caret-blink">|</span>
                      </div>
                      <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#1a1a6c] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#3a3a9c] rounded-full blur-3xl opacity-20"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -60 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-20 -left-4 md:-left-16 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg z-20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium">Profesionales verificados</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">100% confiable</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute top-2/5 -right-2 md:-right-14 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg z-20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium">Respuesta rápida</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">En minutos</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-44 -left-20 md:-left-10 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg z-20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium">Chat directo</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Vía WhatsApp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
