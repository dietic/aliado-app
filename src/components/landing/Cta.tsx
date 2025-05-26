import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { MotionDiv, MotionH2, MotionP } from '../shared/DynamicMotion'

export default function Cta() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#000041] to-[#1a1a6c] text-white relative overflow-hidden">
      <div className="absolute inset-0  bg-cover bg-center opacity-10"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Comienza a usar Aliado hoy mismo
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-white/80 mb-8"
          >
            Únete a miles de usuarios que ya encontraron a los mejores profesionales para sus
            necesidades.
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="rounded-full border border-white bg-gradient-to-r from-primary to-[#1a1a6c] text-white shadow-lg px-8 py-6 text-lg"
            >
              Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-lg font-medium border-primary text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              Saber más
            </Button>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}
