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
    </div>
  );
}