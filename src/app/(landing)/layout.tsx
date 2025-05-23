import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import WhatsAppFloatingButton from '@/components/shared/WhatsAppFloatingButton'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
