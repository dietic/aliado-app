import React from 'react'
import { Shield, Clock, MessageSquare, Star, ArrowRight, Send } from 'lucide-react'
import { Button } from '../ui/button'
import ThemedImage from '../shared/ThemedImage'
import { MotionDiv } from '../shared/DynamicMotion'

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}
function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-primary dark:text-indigo-300">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  )
}
export default function Benefits() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-primary dark:text-indigo-300 text-sm font-medium mb-4">
              Por qué elegir Aliado
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-title dark:text-slate-400">
              La plataforma más{' '}
              <span className="bg-gradient-to-r from-primary to-[#1a1a6c] bg-clip-text text-transparent dark:text-slate-100">
                inteligente
              </span>{' '}
              para encontrar profesionales
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Aliado utiliza inteligencia artificial avanzada para entender exactamente lo que
              necesitas y conectarte con los profesionales más adecuados para tu proyecto.
            </p>

            <div className="space-y-6">
              <FeatureItem
                icon={<Shield className="h-5 w-5" />}
                title="Profesionales verificados"
                description="Todos los profesionales pasan por un riguroso proceso de verificación."
              />
              <FeatureItem
                icon={<Clock className="h-5 w-5" />}
                title="Respuesta inmediata"
                description="Recibe propuestas en minutos, no en días."
              />
              <FeatureItem
                icon={<MessageSquare className="h-5 w-5" />}
                title="Comunicación directa"
                description="Conecta directamente con los profesionales vía WhatsApp."
              />
              <FeatureItem
                icon={<Star className="h-5 w-5" />}
                title="Calidad garantizada"
                description="Solo los mejores profesionales forman parte de nuestra red."
              />
            </div>

            <div className="mt-8">
              <Button className="rounded-full bg-gradient-to-r from-primary to-[#1a1a6c] hover:from-primary hover:to-[#3a3a9c] text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30">
                Descubrir más <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative z-10 bg-white dark:bg-slate-500 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-1">
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                    <ThemedImage
                      lightSrc="/whatsapp-background.png"
                      darkSrc="/whatsapp-background-dark.png"
                      alt="Whatsapp background"
                      width={300}
                      height={600}
                      className="h-full w-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10">
                      <div className="absolute top-0 left-0 right-0 bg-primary text-white p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">Aliado</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/70"></div>
                            <div className="w-2 h-2 rounded-full bg-white/70"></div>
                            <div className="w-2 h-2 rounded-full bg-white/70"></div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg mb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                            <div>
                              <p className="font-medium text-sm">Carlos Mendoza</p>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Plomero profesional con 10 años de experiencia. Especialista en
                            reparaciones de emergencia.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                            <div>
                              <p className="font-medium text-sm">María Sánchez</p>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            Fotógrafa especializada en eventos. Disponible para sesiones en estudio
                            y exteriores.
                          </p>
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
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1a1a6c] rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#3a3a9c] rounded-full blur-3xl opacity-20"></div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}
