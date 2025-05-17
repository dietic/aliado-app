import ThemedImage from '@/components/shared/ThemedImage'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-svh">
      <nav className="w-full absolute top-0 left-0 flex justify-between px-10 py-5">
        <div>
          <ThemedImage
            lightSrc="/logo-aliado.png"
            darkSrc="/logo-aliado-blanco.png"
            alt="Aliado logo"
            width={80}
            height={0}
            priority
          />
        </div>
        <ThemeToggle />
      </nav>
      {children}
    </div>
  )
}
