import { createClient } from '@supabase/supabase-js';

// Las credenciales viven en .env.local (que git ignora), NO en el código.
// Copia .env.local.example a .env.local y rellena los dos valores desde
// Supabase Dashboard -> Settings -> API.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const configurado = Boolean(supabaseUrl && supabaseAnonKey);

if (!configurado && typeof window !== 'undefined') {
  console.error(
    '[UMBRA] Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Crea el archivo .env.local y reinicia el servidor de desarrollo.'
  );
}

// Si no hay configuración usamos valores inertes para que la app cargue y
// pueda mostrar un aviso claro, en vez de reventar al importar.
export const supabase = createClient(
  supabaseUrl || 'https://sin-configurar.supabase.co',
  supabaseAnonKey || 'sin-configurar'
);

/** Traduce los fallos de red a un mensaje que explique qué pasa de verdad.
 *  "Failed to fetch" casi siempre significa que el proyecto de Supabase está
 *  pausado o eliminado, no que haya un error en los datos que metiste. */
export function explicarError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    if (!configurado) {
      return 'No hay credenciales de Supabase. Revisa tu archivo .env.local.';
    }
    return (
      'No se pudo contactar con Supabase. Lo más probable es que el proyecto ' +
      'esté pausado o eliminado: entra en supabase.com y compruébalo. ' +
      'También puede ser que no tengas conexión a internet.'
    );
  }
  return msg;
}
