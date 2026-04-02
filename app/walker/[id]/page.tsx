'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-full bg-slate-900 flex items-center justify-center"><p className="text-slate-500">Cargando...</p></div>
});

interface Umbral {
  id: string;
  position: { lat: number; lng: number };
  type: 'umbra' | 'sigilum';
  pacing_value: number;
  ciclo: number;
  nodeNumber: number;
}

const DEFAULT_LAT = 21.1583;
const DEFAULT_LNG = -100.9326;

export default function WalkerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cathedralId = params.id as string;
  
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [isLocationLocked, setIsLocationLocked] = useState(false);
  const [recentUmbrales, setRecentUmbrales] = useState<Umbral[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [floorPlanUrl, setFloorPlanUrl] = useState('');
  const [showFloorPlanInput, setShowFloorPlanInput] = useState(false);
  const [selectedCiclo, setSelectedCiclo] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: cath } = await supabase.from('cathedrals').select('*').eq('id', cathedralId).single();
      
      if (cath) {
        if (cath.coords && (cath.coords.lat !== 0 || cath.coords.lng !== 0)) {
          setLocation(cath.coords);
          setIsLocationLocked(true);
        } else if (cath.coords) {
          setLocation(cath.coords);
        }
        if (cath.floor_plan_url) setFloorPlanUrl(cath.floor_plan_url);
      }

      const { data } = await supabase.from('umbrales').select('*').eq('cathedral_id', cathedralId).order('created_at', { ascending: false }).limit(10);
      
      if (data) {
        const sorted = [...data].sort((a, b) => (a.node_number || 0) - (b.node_number || 0));
        setRecentUmbrales(sorted.map((u: any) => ({
          id: u.id,
          position: u.position,
          type: u.type as 'umbra' | 'sigilum',
          pacing_value: u.pacing_value,
          ciclo: u.experience_config?.ciclo || 1,
          nodeNumber: u.node_number || 1
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, [cathedralId]);

  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => alert('GPS no disponible'),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleDropUmbral = async () => {
    setSaving(true);
    if (navigator.vibrate) navigator.vibrate(100);

    const { count } = await supabase.from('umbrales').select('*', { count: 'exact', head: true }).eq('cathedral_id', cathedralId);
    const nextNodeNumber = (count || 0) + 1;

    const { data, error } = await supabase.from('umbrales').insert({
      cathedral_id: cathedralId,
      position: { lat: location.lat, lng: location.lng },
      trigger_config: { type: 'geo_radius', radius: 5 },
      experience_config: { type: 'text', content: '', ciclo: selectedCiclo },
      pacing_value: 5,
      type: 'umbra',
      requires: [],
      node_number: nextNodeNumber
    }).select().single();

    if (!error && data) {
      setRecentUmbrales(prev => [{ id: data.id, position: data.position, type: data.type, pacing_value: data.pacing_value, ciclo: selectedCiclo, nodeNumber: nextNodeNumber }, ...prev.slice(0, 9)]);
    }
    setSaving(false);
    alert('Nodo creado');
  };

  const adjustLocation = (dLat: number, dLng: number) => {
    if (isLocationLocked) return;
    setLocation(prev => ({ lat: prev.lat + dLat, lng: prev.lng + dLng }));
  };

  const toggleLock = () => {
    if (!isLocationLocked) {
      setIsLocationLocked(true);
      supabase.from('cathedrals').update({ coords: location }).eq('id', cathedralId);
    } else {
      setIsLocationLocked(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between">
        <Link href={'/atlas/' + cathedralId} className="text-violet-400 text-sm">← Volver</Link>
        <h1 className="text-violet-400 font-bold text-sm">The Walker</h1>
        <div className="flex gap-2">
          <button onClick={requestGPS} className="text-xs bg-blue-700 px-2 py-1 rounded">GPS</button>
          <button onClick={toggleLock} className={`text-xs px-2 py-1 rounded ${isLocationLocked ? 'bg-emerald-600' : 'bg-amber-600'}`}>
            {isLocationLocked ? '🔒' : '🔓'}
          </button>
        </div>
      </header>

      <div className="flex-1 relative">
        <MapComponent center={location} umbrales={recentUmbrales} floorPlanUrl={floorPlanUrl} />
      </div>
      </div>

      <div className="px-4 py-2 bg-slate-900">
        <p className={`text-xs font-mono ${isLocationLocked ? 'text-emerald-400' : 'text-slate-500'}`}>
          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      </div>

      <div className="px-3 py-2 bg-slate-800 flex gap-2">
        {[1,2,3,4,5].map(c => (
          <button key={c} onClick={() => setSelectedCiclo(c)} className={`flex-1 py-2 rounded text-xs font-bold ${selectedCiclo === c ? (c===1?'bg-violet-600':c===2?'bg-blue-600':c===3?'bg-green-600':c===4?'bg-orange-600':'bg-red-600') : 'bg-slate-700'}`}>Ciclo {c}</button>
        ))}
      </div>

      <div className="p-3">
        <button onClick={handleDropUmbral} disabled={saving} className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold">
          {saving ? 'Guardando...' : '+ DROP UMBRAL PUZZLE'}
        </button>
      </div>

      <div className="px-4 pb-4 overflow-y-auto max-h-[20vh]">
        <p className="text-xs text-slate-500 mb-2">Ultimos nodos</p>
        {loading ? <p className="text-slate-600">Cargando...</p> : recentUmbrales.length === 0 ? <p className="text-slate-600">No hay nodos</p> : (
          <div className="space-y-1">
            {recentUmbrales.map((u, i) => {
              const colorClass = u.ciclo === 1 ? 'bg-violet-500' : u.ciclo === 2 ? 'bg-blue-500' : u.ciclo === 3 ? 'bg-green-500' : u.ciclo === 4 ? 'bg-orange-500' : 'bg-red-500';
              return (
                <button key={u.id} type="button" onClick={() => { setSelectedNodeId(u.id); setLocation(u.position); }} className="w-full flex items-center gap-2 p-2 rounded-lg text-left bg-slate-900 hover:bg-slate-800">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                  <span className="text-xs text-slate-300">Umbral {u.nodeNumber}</span>
                  <span className="text-xs text-slate-500">🌀{u.ciclo}</span>
                  <span className="text-[10px] text-slate-600">{u.position.lat.toFixed(5)}, {u.position.lng.toFixed(5)}</span>
                  <Link href={'/composer/' + u.id} className="text-xs bg-slate-700 px-2 py-1 rounded ml-auto">Editar</Link>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}