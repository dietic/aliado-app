'use client'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-gradient-to-br from-[#000041]/10 to-[#1a1a6c]/10 dark:from-[#000041]/20 dark:to-[#1a1a6c]/20 pt-[84px]">
      <motion.h1
        className="text-5xl font-bold leading-16 font-title text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Política de Privacidad
      </motion.h1>
      <div className="max-w-[1200px] text-left mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
        <p className="mb-8">
          <strong>Última actualización:</strong> 9 de mayo de 2025
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Información que Recopilamos</h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            <strong>Información personal:</strong> nombre, número de teléfono, distrito, tipo de
            servicio solicitado.
          </li>
          <li>
            <strong>Información de uso:</strong> interacciones con la plataforma, historial de
            solicitudes, calificaciones y comentarios.
          </li>
          <li>
            <strong>Información técnica:</strong> datos del dispositivo, dirección IP, ubicación
            aproximada.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">2. Uso de la Información</h2>
        <p className="mb-2">Utilizamos la información recopilada para:</p>
        <ul className="list-disc list-inside mb-6">
          <li>Conectar a los usuarios con proveedores adecuados.</li>
          <li>Mejorar y personalizar nuestros servicios.</li>
          <li>Enviar notificaciones y actualizaciones relevantes.</li>
          <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">3. Compartir Información</h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            <strong>Proveedores de servicios:</strong> para facilitar la prestación del servicio
            solicitado.
          </li>
          <li>
            <strong>Autoridades legales:</strong> cuando sea requerido por ley o para proteger
            nuestros derechos.
          </li>
          <li>
            <strong>Terceros:</strong> con consentimiento explícito del usuario.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">4. Seguridad de la Información</h2>
        <p className="mb-6">
          Implementamos medidas de seguridad técnicas y organizativas para proteger la información
          personal contra accesos no autorizados, pérdida o destrucción.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Derechos del Usuario</h2>
        <p className="mb-2">Los usuarios tienen derecho a:</p>
        <ul className="list-disc list-inside mb-2">
          <li>Acceder, rectificar o eliminar su información personal.</li>
          <li>Oponerse al procesamiento de sus datos.</li>
          <li>Retirar su consentimiento en cualquier momento.</li>
        </ul>
        <p className="mb-6">
          Para ejercer estos derechos, contáctenos a través de nuestro correo o WhatsApp oficial.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Retención de Datos</h2>
        <p className="mb-6">
          Conservamos la información personal durante el tiempo necesario para cumplir con los fines
          descritos en esta política, a menos que la ley requiera o permita un período de retención
          más largo.
        </p>

        <h2 className="text-xl font-semibold mb-2">7. Cambios en la Política de Privacidad</h2>
        <p className="mb-6">
          Podemos actualizar esta política periódicamente. Notificaremos cualquier cambio
          significativo a través de nuestros canales oficiales.
        </p>
      </div>
    </div>
  )
}
