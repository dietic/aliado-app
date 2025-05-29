'use client';

import { useState, useEffect, useMemo, lazy } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/signup/SignupForm';
import { MotionDiv } from '@/components/shared/DynamicMotion';

export default function Auth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');

  const [prefillPhone, setPrefillPhone] = useState<string | undefined>(undefined);
  const [signupFormKey, setSignupFormKey] = useState(0);

  const activeTab = useMemo(() => {
    return mode === 'signup' ? 'signup' : 'login';
  }, [mode]);

  const handlePhoneExists = (phone: string) => {
    setPrefillPhone(phone);
    router.replace('/app/auth?mode=login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#1a1a6c] rounded-full blur-3xl opacity-5"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#3a3a9c] rounded-full blur-3xl opacity-5"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Bienvenido a Aliado
                </h1>
                <p className="text-slate-500">Inicia sesión o crea una cuenta para continuar</p>
              </div>

              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={(val) => {
                  router.replace(`/app/auth?mode=${val}`);
                  if (val === 'signup') {
                    setSignupFormKey((prev) => prev + 1);
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8 w-full">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 cursor-pointer"
                  >
                    Iniciar sesión
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100 cursor-pointer"
                  >
                    Crear cuenta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm prefillPhone={prefillPhone} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm key={signupFormKey} onPhoneExists={handlePhoneExists} />
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-slate-500">
                {activeTab === 'login' ? (
                  <p>
                    ¿No tienes una cuenta?{' '}
                    <button
                      onClick={() => {
                        setSignupFormKey((prev) => prev + 1);
                        router.replace('/app/auth?mode=signup');
                      }}
                      className="text-primary font-medium hover:underline dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      Regístrate
                    </button>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      onClick={() => {
                        router.replace('/app/auth?mode=login');
                      }}
                      className="text-primary font-medium hover:underline dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      Inicia sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </MotionDiv>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Aliado. Todos los derechos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
