'use client'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FaqItemProps {
  question: string
  answer: string
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-semibold text-lg">{question}</h3>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronRight className="h-5 w-5 rotate-90" />
        </div>
      </button>
      <div
        className={`mt-2 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 dark:text-slate-300 pb-2">{answer}</p>
      </div>
    </div>
  )
}
export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-32 ">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Preguntas{' '}
            <span className="bg-gradient-to-r from-primary to-[#1a1a6c] bg-clip-text text-transparent">
              frecuentes
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-slate-600 dark:text-slate-300"
          >
            Encuentra respuestas a las preguntas más comunes sobre Aliado.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <FaqItem
            question="¿Qué es Aliado?"
            answer="Aliado es una plataforma impulsada por IA que conecta a usuarios con profesionales verificados en Lima. A través de WhatsApp, puedes solicitar servicios y recibir propuestas de profesionales calificados en minutos."
          />
          <FaqItem
            question="¿Cómo funciona Aliado?"
            answer="Es simple: describes lo que necesitas, recibes propuestas de profesionales verificados y eliges al que mejor se adapte a tus necesidades. Luego, te conectas directamente con ellos a través de WhatsApp."
          />
          <FaqItem
            question="¿Es seguro usar Aliado?"
            answer="Absolutamente. Todos los profesionales en nuestra plataforma pasan por un riguroso proceso de verificación. Además, puedes ver reseñas y calificaciones de otros usuarios antes de elegir."
          />
          <FaqItem
            question="¿Cuánto cuesta usar Aliado?"
            answer="El uso básico de Aliado es completamente gratuito para los usuarios. Los profesionales pagan una pequeña comisión por los servicios contratados a través de la plataforma."
          />
          <FaqItem
            question="¿Qué tipos de servicios puedo encontrar en Aliado?"
            answer="Aliado ofrece una amplia gama de servicios, desde plomería, electricidad y carpintería hasta fotografía, diseño gráfico, repostería y muchos más. Si necesitas un servicio profesional, probablemente lo encontrarás en Aliado."
          />
        </div>
      </div>
    </section>
  )
}
