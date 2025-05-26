import Benefits from '@/components/landing/Benefits'
import Cta from '@/components/landing/Cta'
import Faq from '@/components/landing/faq/Faq.server'
import Hero from '@/components/landing/hero/Hero.server'
import Process from '@/components/landing/Process'

export default function Landing() {
  return (
    <>
      <Hero />
      <Process />
      <Benefits />
      <Faq />
      <Cta />
    </>
  )
}
