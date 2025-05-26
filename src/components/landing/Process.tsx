import { ArrowRight, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { MotionDiv, MotionH2, MotionP } from '../shared/DynamicMotion'

interface StepCardProps {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}

function StepCard({ number, title, description, icon, delay }: StepCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 "
    >
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-primary dark:bg-indigo-900/30 dark:text-indigo-300 mb-6">
        {icon}
      </div>
      <div className="text-sm font-medium text-primary mb-2 font-title dark:text-slate-100">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </MotionDiv>
  )
}

export default function Process() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white dark:bg-transparent">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6 font-title dark:text-slate-400"
          >
            Encuentra profesionales en{' '}
            <span className="bg-gradient-to-r from-primary to-[#1a1a6c] bg-clip-text text-transparent dark:text-slate-100">
              3 simples pasos
            </span>
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-slate-600 dark:text-slate-300"
          >
            Aliado utiliza inteligencia artificial para conectarte con los mejores profesionales de
            manera rápida y eficiente.
          </MotionP>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StepCard
            number="01"
            title="Describe tu necesidad"
            description="Simplemente dile a Aliado qué servicio necesitas y proporciona algunos detalles básicos."
            icon={<MessageSquare className="h-6 w-6" />}
            delay={0}
          />
          <StepCard
            number="02"
            title="Recibe propuestas"
            description="En minutos, recibirás propuestas de profesionales verificados con disponibilidad y precios."
            icon={<Clock className="h-6 w-6" />}
            delay={0.2}
          />
          <StepCard
            number="03"
            title="Elige y conecta"
            description="Selecciona el profesional que mejor se adapte a tus necesidades y conéctate directamente por WhatsApp."
            icon={<CheckCircle className="h-6 w-6" />}
            delay={0.4}
          />
        </div>

        <div className="mt-16 text-center">
          <Button className="rounded-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30 px-8 py-6 text-lg">
            Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
