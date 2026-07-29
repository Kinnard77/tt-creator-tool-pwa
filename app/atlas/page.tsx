'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { leerLatitud, leerLongitud } from '@/lib/coords';

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  draft: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400' },
  alpha: { bg: 'bg-amber-900/30', border: 'border-amber-500/50', text: 'text-amber-400' },
  published: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/50', text: 'text-emerald-400' },
};

export default function AtlasPage() {
  const [labyrinthoi, setLabyrinthoi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabyrinthoi() {
      const { data } = await supabase
        .from('labyrinthos')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) setLabyrinthoi(data);
      setLoading(false);
    }
    fetchLabyrinthoi();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-400">Cargando Atlas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      {/* Header - Modern glass effect */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/hub" className="text-violet-400 hover:text-violet-300 transition-colors">
          ← Hub
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          UMBRA
        </h1>
        <div className="w-16"></div>
      </header>

      {/* Atlas - Labyrinthos List */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-violet-400 font-bold text-sm uppercase tracking-widest">The Atlas</h2>
          <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
            {labyrinthoi.length} sitios
          </span>
        </div>

        {labyrinthoi.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-2">No hay Labyrinthoi</p>
            <p className="text-slate-600 text-sm">Crea el primero para comenzar</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {labyrinthoi.map((labyrinthos) => {
              const status = statusColors[labyrinthos.status] || statusColors.draft;
              
              return (
                <Link 
                  key={labyrinthos.id} 
                  href={`/atlas/${labyrinthos.id}`}
                  className="group block bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-5 rounded-2xl hover:border-violet-500/50 hover:from-slate-800 hover:to-slate-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {labyrinthos.name}
                        </h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border ${status.bg} ${status.border} ${status.text} uppercase tracking-wider`}>
                          {labyrinthos.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{labyrinthos.city}, {labyrinthos.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-violet-400">{labyrinthos.umbral_count || 0}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">nodos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-700/50">
                    <Link 
                      href={`/walker/${labyrinthos.id}`}
                      className="flex-1 text-center py-2.5 bg-slate-700/30 rounded-xl text-sm text-slate-300 hover:bg-violet-600/20 hover:text-violet-300 transition-all"
                    >
                      🚶 Walker
                    </Link>
                    <Link 
                      href={`/sequencer/${labyrinthos.id}`}
                      className="flex-1 text-center py-2.5 bg-slate-700/30 rounded-xl text-sm text-slate-300 hover:bg-violet-600/20 hover:text-violet-300 transition-all"
                    >
                      🔗 Sequencer
                    </Link>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* New Site Button - Modern gradient */}
        <button 
          onClick={() => {
            const name = prompt('Nombre del Labyrinthos:');
            if (!name) return;
            const city = prompt('Ciudad:') || '';
            const country = prompt('Pais:') || '';
            
            // Se aceptan coma y punto decimal, y se valida el rango. Antes,
            // una entrada invalida se convertia en 0 sin avisar y el Labyrinthos
            // acababa en el Atlantico. Se puede dejar en blanco y ponerlas
            // luego desde la pantalla del Labyrinthos.
            let lat = 0, lng = 0;
            const latInput = prompt('Latitud (ej: 21.1583). Dejalo en blanco si aun no la sabes:');
            const lngInput = prompt('Longitud (ej: -100.9326):');

            if ((latInput && latInput.trim()) || (lngInput && lngInput.trim())) {
              const rLat = leerLatitud(latInput || '');
              const rLng = leerLongitud(lngInput || '');
              if (!rLat.ok || !rLng.ok) {
                const motivo = !rLat.ok
                  ? `Latitud: ${rLat.motivo}`
                  : `Longitud: ${(rLng as { motivo: string }).motivo}`;
                alert(
                  motivo +
                    '\n\nEl Labyrinthos se creara sin ubicacion. Podras ponerlo ' +
                    'despues con el boton Editar.'
                );
              } else {
                lat = rLat.valor;
                lng = rLng.valor;
              }
            }

            async function create() {
              const { data, error } = await supabase.from('labyrinthos').insert({
                name,
                city,
                country,
                coords: { lat, lng },
                status: 'draft',
                umbral_count: 0
              }).select().single();
              
              if (error) {
                alert('Error: ' + error.message);
              } else {
                window.location.href = '/atlas/' + data.id;
              }
            }
            create();
          }}
          className="w-full mt-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl text-white font-semibold hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40"
        >
          + Nuevo Sitio
        </button>
      </div>
    </div>
  );
}