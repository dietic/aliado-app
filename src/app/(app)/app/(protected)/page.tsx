'use client';

import { PageHeader } from '@/components/app/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/components/shared/withAuth'; // Import the withAuth HOC

// This is the internal component that assumes authentication is handled.
function MainPageInternal() {
  const { user } = useAuth(); // withAuth ensures user is available

  // Determine the user's name for a personalized welcome
  // Fallback chain: user_metadata.first_name -> user.email -> 'Usuario'
  const userName = user?.user_metadata?.first_name || user?.email || 'Usuario';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${userName}`}
        description="Aquí puedes ver un resumen de tu actividad y gestionar tu cuenta."
      />
      {/* Display user email or other relevant info if desired */}
      {user?.email && <p>Conectado como: {user.email}</p>}
      {/* Displaying the raw access token is generally not done in production UI */}
    </div>
  );
}

// Wrap MainPageInternal with withAuth to protect it and handle loading/auth states.
export default withAuth(MainPageInternal);
