import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
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
