'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const statusColors: Record<string, string> = {
  draft: 'border-slate-600 text-slate-400',
  alpha: 'border-amber-600 text-amber-400',
  published: 'border-emerald-600 text-emerald-400',
};

export default function AtlasPage() {
  const [cathedrals, setCathedrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCathedrals() {
      const { data } = await supabase
        .from('cathedrals')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) setCathedrals(data);
      setLoading(false);
    }
    fetchCathedrals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <p className="text-violet-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/hub" className="text-violet-400 hover:underline">← Hub</Link>
        <h1 className="text-xl font-bold">🌑 UMBRA</h1>
        <div className="w-16"></div>
      </header>

      {/* Atlas - Cathedral List */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-violet-400 font-bold text-sm uppercase tracking-widest">📍 The Atlas</h2>
          <span className="text-xs text-slate-600">{cathedrals.length} sitios</span>
        </div>

        {cathedrals.length === 0 ? (
          <p className="text-slate-500 text-center">No hay catedrales.</p>
        ) : (
          <div className="grid gap-4">
            {cathedrals.map((cathedral) => (
              <Link 
                key={cathedral.id} 
                href={`/walker/${cathedral.id}`}
                className="group block bg-slate-900/50 border border-slate-800 p-5 rounded-xl hover:border-violet-500/50 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300">
                        {cathedral.name}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusColors[cathedral.status] || statusColors.draft}`}>
                        {cathedral.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">{cathedral.city}, {cathedral.country}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-violet-400 font-mono text-lg">{cathedral.umbral_count || 0}</span>
                    <p className="text-[10px] text-slate-600 uppercase">umbrales</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <Link 
                    href={`/walker/${cathedral.id}`}
                    className="flex-1 text-center py-2 bg-slate-800/50 rounded-lg text-sm text-slate-400 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                  >
                    🚶 Walker
                  </Link>
                  <Link 
                    href={`/sequencer/${cathedral.id}`}
                    className="flex-1 text-center py-2 bg-slate-800/50 rounded-lg text-sm text-slate-400 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                  >
                    🔗 Sequencer
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* New Site Button */}
        <button 
          onClick={() => {
            const name = prompt('Nombre de la catedral:');
            if (!name) return;
            const city = prompt('Ciudad:') || '';
            const country = prompt('País:') || '';
            
            async function create() {
              const { error } = await supabase.from('cathedrals').insert({
                name,
                city,
                country,
                coords: { lat: 0, lng: 0 },
                status: 'draft',
                umbral_count: 0
              });
              if (error) alert('Error: ' + error.message);
              else window.location.reload();
            }
            create();
          }}
          className="w-full mt-6 py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-violet-500/50 hover:text-violet-400 transition-all"
        >
          + Nuevo Sitio
        </button>
      </div>
    </div>
  );
}