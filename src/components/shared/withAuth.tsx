'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/shared/Loader'; // Assuming you have a Loader component

interface WithAuthProps {
  // You can define any additional props your wrapped component might need
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P & WithAuthProps>) => {
  const AuthComponent: React.FC<P> = (props) => {
    const { user, loading, session } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/app/auth?mode=login'); // Redirect to login if not authenticated
      }
    }, [user, loading, router, session]);

    if (loading || !user) {
      // You can show a loading spinner or a blank page while checking auth
      return <Loader className="h-screen" />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  // Set a display name for the HOC for better debugging
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
