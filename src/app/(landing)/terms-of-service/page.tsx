import { MotionH1 } from '@/components/shared/DynamicMotion'

export default function TermsOfService() {
  return (
    <div className="w-full bg-gradient-to-br from-[#000041]/10 to-[#1a1a6c]/10 dark:from-[#000041]/20 dark:to-[#1a1a6c]/20 pt-[84px]">
      <MotionH1
        className="text-5xl font-bold leading-16 font-title text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Términos y Servicios
      </MotionH1>
      <div className="max-w-[1200px] text-left mx-auto py-12">
        <h4 className="text-xl font-semibold mb-2">1. Aceptación de los Términos</h4>
        <p className="mb-6">
          Al utilizar <em>Aliado</em>, ya sea a través de WhatsApp, SMS o cualquier otro canal,
          usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguna
          parte de estos términos, por favor, absténgase de utilizar nuestros servicios.
        </p>

        <h4 className="text-xl font-semibold mb-2">2. Descripción del Servicio</h4>
        <p className="mb-6">
          <em>Aliado</em> es una plataforma que conecta a usuarios con proveedores de servicios
          locales (plomeros, electricistas, carpinteros, etc.) en Lima, Perú, mediante canales de
          mensajería como WhatsApp y SMS. No somos responsables de la calidad, puntualidad o
          legalidad de los servicios prestados por los proveedores.
        </p>

        <h4 className="text-xl font-semibold mb-2">3. Registro y Uso</h4>
        <p className="mb-6">
          Para utilizar <em>Aliado</em>, los usuarios deben proporcionar información veraz y
          actualizada. Nos reservamos el derecho de suspender o cancelar cuentas que proporcionen
          información falsa o que violen estos términos.
        </p>

        <h4 className="text-xl font-semibold mb-2">4. Responsabilidades del Usuario</h4>
        <ul className="mb-6 list-disc list-inside">
          <li>Proporcionar información precisa y completa.</li>
          <li>No utilizar la plataforma para fines ilegales o no autorizados.</li>
          <li>Respetar a los proveedores y otros usuarios.</li>
        </ul>

        <h4 className="text-xl font-semibold mb-2">5. Responsabilidades de los Proveedores</h4>
        <ul className="mb-6 list-disc list-inside">
          <li>Cumplir con las leyes y regulaciones locales.</li>
          <li>Proporcionar servicios de calidad y en el tiempo acordado.</li>
          <li>Mantener la confidencialidad de la información del usuario.</li>
        </ul>

        <h4 className="text-xl font-semibold mb-2">6. Limitación de Responsabilidad</h4>
        <p className="mb-6">
          <em>Aliado</em> no se hace responsable de daños directos, indirectos, incidentales o
          consecuentes que resulten del uso o la imposibilidad de uso de nuestros servicios.
        </p>

        <h4 className="text-xl font-semibold mb-2">7. Modificaciones</h4>
        <p className="mb-6">
          Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
          Las modificaciones entrarán en vigor una vez publicadas en nuestro sitio web o notificadas
          a través de nuestros canales oficiales.
        </p>

        <h4 className="text-xl font-semibold mb-2">8. Ley Aplicable</h4>
        <p className="mb-6">
          Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del
          Perú.
        </p>
      </div>
    </div>
  )
}
