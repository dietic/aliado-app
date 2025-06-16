'use client';

import { PageHeader } from '@/components/app/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import withAuth from '@/components/shared/withAuth';

function MainPageInternal() {
  const { user, provider } = useAuth();
  const userName = provider?.firstName || user?.email || 'Usuario';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${userName}`}
        description="Aquí puedes ver un resumen de tu actividad y gestionar tu cuenta."
      />
      {user?.email && <p>Conectado como: {user.email}</p>}
      {/* Displaying the raw access token is generally not done in production UI */}
    </div>
  );
}

// Wrap MainPageInternal with withAuth to protect it and handle loading/auth states.
export default withAuth(MainPageInternal);
