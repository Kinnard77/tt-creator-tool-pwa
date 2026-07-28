'use client';

import { useState } from 'react';
import { supabase, configurado, explicarError } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async () => {
    setError('');
    setOcupado(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + '/hub' },
      });
      if (error) setError(error.message);
      else setEnviado(true);
    } catch (e) {
      setError(explicarError(e));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-5xl shadow-2xl shadow-violet-500/30 mb-6">
        ⏱️
      </div>

      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 tracking-wider mb-2">
        Time Travellers
      </h1>
      <p className="text-sm text-violet-400/60 italic font-mono mb-10">
        &quot;Walking is Writing&quot;
      </p>

      {!configurado ? (
        <div className="max-w-md text-center bg-red-950/40 border border-red-800 rounded-xl p-5">
          <p className="text-red-300 font-bold mb-2">Falta configuración</p>
          <p className="text-sm text-slate-300">
            No hay credenciales de Supabase. Crea el archivo{' '}
            <code className="text-violet-300">.env.local</code> copiando{' '}
            <code className="text-violet-300">.env.local.example</code>, pega la
            URL y la clave, y reinicia el servidor.
          </p>
        </div>
      ) : enviado ? (
        <div className="max-w-md text-center bg-violet-950/40 border border-violet-800 rounded-xl p-5">
          <p className="text-violet-200 font-bold mb-2">Enlace enviado</p>
          <p className="text-sm text-slate-300">
            Revisa tu correo y abre el enlace <strong>en este mismo
            dispositivo</strong>.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-3">
          <input
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && email && !ocupado) enviar();
            }}
          />
          <button
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={enviar}
            disabled={!email || ocupado}
          >
            {ocupado ? 'Enviando…' : 'Enviar enlace de acceso'}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
