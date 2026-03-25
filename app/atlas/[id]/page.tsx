'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

const cathedrals: Record<string, { name: string; city: string; country: string; coords: { lat: number; lng: number } }> = {
  'notre_dame_paris': { name: 'Notre Dame', city: 'Paris', country: 'France', coords: { lat: 48.8530, lng: 2.3499 } },
  'valencia_catedral': { name: 'Catedral de Valencia', city: 'Valencia', country: 'Spain', coords: { lat: 39.4699, lng: -0.3763 } },
  'seville_catedral': { name: 'Catedral de Sevilla', city: 'Seville', country: 'Spain', coords: { lat: 37.3869, lng: -5.9928 } },
  'dolores_hidalgo': { name: 'Parroquía de Dolores Hidalgo', city: 'Dolores Hidalgo, Guanajuato', country: 'México', coords: { lat: 21.1583, lng: -100.9326 } },
};

export default function AtlasPage() {
  const params = useParams();
  const id = params.id as string;
  const [cathedral, setCathedral] = useState<any>(null);

  useEffect(() => {
    async function fetchCathedral() {
      const { data } = await supabase
        .from('cathedrals')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setCathedral(data);
    }
    fetchCathedral();
  }, [id]);

  if (!cathedral) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Link href="/" className="text-violet-400">← Volver</Link>
        <h1 className="text-xl mt-4">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <Link href="/" className="text-violet-400 hover:underline text-sm">← Atlas</Link>
        <h1 className="text-xl font-bold mt-2">{cathedral.name}</h1>
        <p className="text-slate-500 text-sm">{cathedral.city}, {cathedral.country}</p>
        <p className="text-violet-400 text-xs mt-1">🟢 {cathedral.umbral_count || 0} umbrales</p>
      </header>

      <div className="p-4 space-y-4">
        <Link 
          href={`/walker/${id}`}
          className="block bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500/50 transition-all"
        >
          <div className="text-4xl mb-3">🚶</div>
          <h2 className="text-lg font-bold">The Walker</h2>
          <p className="text-slate-500 text-sm mt-1">Caminar y Dropumbrales en tiempo real</p>
        </Link>

        <Link 
          href={`/sequencer/${id}`}
          className="block bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500/50 transition-all"
        >
          <div className="text-4xl mb-3">🔗</div>
          <h2 className="text-lg font-bold">The Sequencer</h2>
          <p className="text-slate-500 text-sm mt-1">Vista de grafo y conexiones</p>
        </Link>
      </div>
    </div>
  );
}