import Link from 'next/link'
import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { MotionDiv } from './DynamicMotion'

export default function WhatsAppFloatingButton() {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href="https://wa.me/51999999999?text=Hola%20Prexi,%20me%20gustaría%20obtener%20más%20información"
        target="_blank"
        className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
        aria-label="Contáctanos por WhatsApp"
      >
        <SiWhatsapp className="w-8 h-8 text-white" size={8} />
      </Link>
    </MotionDiv>
  )
}
