'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-slate-900 flex items-center justify-center">
      <p className="text-slate-500">Cargando mapa...</p>
    </div>
  )
});

interface Umbral {
  id: string;
  position: { lat: number; lng: number };
  type: 'umbra' | 'sigilum';
  pacing_value: number;
}

export default function SequencerPage() {
  const params = useParams();
  const cathedralId = params.id as string;
  
  const [allUmbrales, setAllUmbrales] = useState<Umbral[]>([]);
  const [cathedral, setCathedral] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 21.1583, lng: -100.9326 });

  useEffect(() => {
    async function fetchData() {
      // Fetch cathedral
      const { data: cath } = await supabase
        .from('cathedrals')
        .select('*')
        .eq('id', cathedralId)
        .single();
      
      if (cath) {
        setCathedral(cath);
        if (cath.coords) setMapCenter(cath.coords);
      }

      // Fetch all umbrales
      const { data: umbs } = await supabase
        .from('umbrales')
        .select('*')
        .eq('cathedral_id', cathedralId)
        .order('created_at', { ascending: true });

      if (umbs) {
        setAllUmbrales(umbs.map((u: any) => ({
          id: u.id,
          position: u.position,
          type: u.type,
          pacing_value: u.pacing_value
        })));
        
        // Auto-center on first umbral if exists
        if (umbs.length > 0 && umbs[0].position) {
          setMapCenter(umbs[0].position);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, [cathedralId]);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white p-8 flex items-center justify-center">
        <p className="text-violet-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between shrink-0">
        <Link href="/atlas" className="text-violet-400 hover:underline text-sm">← Atlas</Link>
        <h1 className="text-violet-400 font-bold text-sm">🔗 The Sequencer</h1>
        <span className="text-xs text-slate-500">{allUmbrales.length} nodos</span>
      </header>

      {/* Map - full height, just shows umbrales */}
      <div className="flex-1 relative m-2 rounded-xl overflow-hidden border border-slate-800 min-h-[200px]">
        <MapComponent 
          center={mapCenter}
          umbrales={allUmbrales}
          showUserLocation={false}
        />
      </div>

      {/* Umbrales List */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 max-h-[35vh] overflow-y-auto shrink-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          Grafo de nodos ({allUmbrales.length})
        </p>
        
        {allUmbrales.length === 0 ? (
          <p className="text-slate-600 text-center py-2 text-sm">
            No hay umbrales. Andá a The Walker para crear algunos.
          </p>
        ) : (
          <div className="grid gap-1">
            {allUmbrales.map((u, i) => (
              <button
                key={u.id}
                onClick={() => setMapCenter(u.position)}
                className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 text-left"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  u.type === 'umbra' ? 'bg-violet-900 border border-violet-500' : 'bg-amber-900 border border-amber-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-xs">{u.type === 'umbra' ? '🌑' : '🔯'} #{i + 1}</span>
                  <span className="text-[10px] text-slate-500 ml-2">P{u.pacing_value}</span>
                </div>
                <span className="text-[10px] text-slate-600">
                  {u.position.lat.toFixed(4)}, {u.position.lng.toFixed(4)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 FLUJO DEL VIAJE DEL HÉROE */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 shrink-0">
        <details className="group">
          <summary className="cursor-pointer text-xs text-violet-400 uppercase tracking-wider flex items-center justify-between">
            <span>🎯 Viaje del Héroe</span>
            <span className="group-open:rotate-90 transition-transform">▶</span>
          </summary>
          
          <div className="mt-3 space-y-2 text-xs">
            {/* Pruebas - Nodos físicos */}
            <div className="bg-slate-800 p-2 rounded border-l-2 border-violet-500">
              <p className="font-bold text-violet-400">🧪 PRUEBAS (Nodos físicos)</p>
              <p className="text-slate-400">{allUmbrales.length} nodos creados</p>
              <p className="text-slate-500 mt-1">
                El jugador resuelve puzzles en ubicaciones reales de la catedral.
                Al completar todos → activa la Cámara Oscura.
              </p>
            </div>

            {/* Cámara Oscura - Dinámica */}
            <div className="bg-slate-800 p-2 rounded border-l-2 border-red-500">
              <p className="font-bold text-red-400">🌑 CÁMARA OSCURA (Dinámica)</p>
              <p className="text-slate-400">Experiencia sin ubicación física</p>
              <p className="text-slate-500 mt-1">
                Se activa automáticamente después de completar las pruebas.
                Prueba difícil de carácter interior. "Muerte del yo".
              </p>
            </div>

            {/* Recompensa */}
            <div className="bg-slate-800 p-2 rounded border-l-2 border-amber-500">
              <p className="font-bold text-amber-400">🏆 RECOMPENSA</p>
              <p className="text-slate-400">Cena real en restaurante local</p>
              <p className="text-slate-500 mt-1">
                Otorgada después de superar la Cámara Oscura.
                La verdadera recompensa en el mundo real.
              </p>
            </div>

            {/* Renacimiento */}
            <div className="bg-slate-800 p-2 rounded border-l-2 border-emerald-500">
              <p className="font-bold text-emerald-400">✨ RENACIMIENTO</p>
              <p className="text-slate-400">Transformación final</p>
              <p className="text-slate-500 mt-1">
                El jugador deja de ser "Nadie" → se convierte en Espía.
                Nueva percepción de lo sagrado y sublime.
              </p>
            </div>
          </div>

          {/* Progreso visual */}
          <div className="mt-3 pt-2 border-t border-slate-700">
            <p className="text-[10px] text-slate-500 mb-2">PROGRESO DEL JUGADOR:</p>
            <div className="flex gap-1">
              <div className="flex-1 h-2 bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: allUmbrales.length > 0 ? '30%' : '0%' }}></div>
              </div>
              <div className="flex-1 h-2 bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: allUmbrales.length >= 4 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex-1 h-2 bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: allUmbrales.length >= 4 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex-1 h-2 bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: allUmbrales.length >= 4 ? '100%' : '0%' }}></div>
              </div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-600 mt-1">
              <span>Pruebas</span>
              <span>Cámara</span>
              <span>Premio</span>
              <span>Éxtasis</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}