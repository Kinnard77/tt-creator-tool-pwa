'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase, configurado } from '@/lib/supabase';

/** Rutas que se ven sin haber iniciado sesión. */
const PUBLICAS = ['/', '/login'];

/**
 * Guardia de sesión a nivel de aplicación: se monta una sola vez en el
 * layout y protege todas las rutas salvo las públicas.
 *
 * Si el dispositivo está sin conexión deja pasar a propósito: dentro de una
 * catedral no hay señal, y el trabajo de campo no puede depender de poder
 * validar la sesión contra el servidor.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [comprobando, setComprobando] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelado = false;

    const esPublica = PUBLICAS.includes(pathname);
    if (esPublica) {
      setComprobando(false);
      return;
    }

    if (!configurado) {
      router.replace('/login');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (cancelado) return;
      if (!data.session && navigator.onLine) {
        router.replace('/login');
      } else {
        setComprobando(false);
      }
    });

    return () => {
      cancelado = true;
    };
  }, [pathname, router]);

  if (comprobando) {
    return (
      <div className="min-h-screen bg-black text-slate-400 flex items-center justify-center">
        Cargando…
      </div>
    );
  }
  return <>{children}</>;
}
