'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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

const DEFAULT_LAT = 21.1583;
const DEFAULT_LNG = -100.9326;

export default function WalkerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cathedralId = params.id as string;
  const selectedUmbralId = searchParams.get('umbral');
  
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [isLocationLocked, setIsLocationLocked] = useState(false);
  const [recentUmbrales, setRecentUmbrales] = useState<Umbral[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cathedral, setCathedral] = useState<any>(null);
  const [showFloorPlanInput, setShowFloorPlanInput] = useState(false);
  const [floorPlanUrl, setFloorPlanUrl] = useState('');

  // Fetch cathedral and umbrales
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
        if (cath.coords) {
          setLocation(cath.coords);
        }
        if (cath.floor_plan_url) {
          setFloorPlanUrl(cath.floor_plan_url);
        }
      }

      // Fetch umbrales
      const { data } = await supabase
        .from('umbrales')
        .select('*')
        .eq('cathedral_id', cathedralId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        const mappedUmbrales = data.map((u: any) => ({
          id: u.id,
          position: u.position,
          type: u.type,
          pacing_value: u.pacing_value
        }));
        setRecentUmbrales(mappedUmbrales);
        
        // Si hay un nodo seleccionado, centrar el mapa en él
        if (selectedUmbralId) {
          const selected = data.find((u: any) => u.id === selectedUmbralId);
          if (selected && selected.position) {
            setLocation(selected.position);
          }
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [cathedralId, selectedUmbralId]);

  // Get GPS only if user explicitly asks (button) - not automatic
  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          alert('No se pudo obtener GPS');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('GPS no disponible en este dispositivo');
    }
  };

  const handleDropUmbral = async () => {
    setSaving(true);

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    const newUmbral = {
      cathedral_id: cathedralId,
      position: { lat: location.lat, lng: location.lng },
      trigger_config: { type: 'geo_radius', radius: 5 },
      experience_config: { type: 'text', content: '' },
      pacing_value: 5,
      type: 'umbra',
      requires: []
    };

    const { data, error } = await supabase
      .from('umbrales')
      .insert(newUmbral)
      .select()
      .single();

    if (error) {
      alert('Error al guardar: ' + error.message);
      setSaving(false);
      return;
    }

    if (data) {
      setRecentUmbrales(prev => [{
        id: data.id,
        position: data.position,
        type: data.type,
        pacing_value: data.pacing_value
      }, ...prev.slice(0, 9)]);
    }

    setSaving(false);
    
    alert(`✓ UMBRAL CREADO\n\n📍 ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  };

  // Ajustar posición solo si NO está fijada
  const adjustLocation = (deltaLat: number, deltaLng: number) => {
    if (isLocationLocked) return; // No permitir si está fijada
    setLocation(prev => ({
      lat: prev.lat + deltaLat,
      lng: prev.lng + deltaLng
    }));
  };

  // Fijar la ubicación de la catedral (una vez fijada, no se puede mover)
  const toggleLock = () => {
    if (!isLocationLocked) {
      // Fijar - guardar las coords actuales en la catedral
      setIsLocationLocked(true);
      // Guardar en la DB
      supabase
        .from('cathedrals')
        .update({ coords: location })
        .eq('id', cathedralId)
        .then(({ error }) => {
          if (error) {
            alert('Error al guardar: ' + error.message);
          } else {
            // No mostrar alert, solo dejar fijada la ubicación
          }
        });
    } else {
      // Desfijar (solo si está desbloqueado el desarrollo)
      setIsLocationLocked(false);
    }
  };

  const saveFloorPlanUrl = async () => {
    if (!floorPlanUrl) return;
    
    const { error } = await supabase
      .from('cathedrals')
      .update({ floor_plan_url: floorPlanUrl })
      .eq('id', cathedralId);
    
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('✓ Plano guardado');
      setShowFloorPlanInput(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between shrink-0">
        <Link href="javascript:history.back()" className="text-violet-400 hover:underline text-sm">← Atlas</Link>
        <h1 className="text-violet-400 font-bold text-sm">🚶 The Walker</h1>
        <div className="flex gap-2">
          <button 
            onClick={requestGPS}
            className="text-xs bg-blue-700 px-2 py-1 rounded"
            title="Obtener GPS actual"
          >
            📡
          </button>
          <button 
            onClick={toggleLock}
            className={`text-xs px-2 py-1 rounded ${isLocationLocked ? 'bg-emerald-600' : 'bg-amber-600'}`}
            title={isLocationLocked ? "Ubicación fijada" : "Fijar ubicación"}
          >
            {isLocationLocked ? '🔒' : '🔓'}
          </button>
        </div>
      </header>

      {/* Floor Plan Button */}
      <div className="px-3 py-1 bg-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">📐 Plano de planta</span>
        <button 
          onClick={() => setShowFloorPlanInput(!showFloorPlanInput)}
          className="text-xs text-violet-400"
        >
          {floorPlanUrl ? '✓ Configurado' : '+ Agregar'}
        </button>
      </div>

      {/* Floor Plan URL Input */}
      {showFloorPlanInput && (
        <div className="px-3 py-2 bg-slate-800 border-b border-slate-700">
          <input
            type="text"
            value={floorPlanUrl}
            onChange={(e) => setFloorPlanUrl(e.target.value)}
            placeholder="URL de la imagen del plano..."
            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs mb-2"
          />
          <div className="flex gap-2">
            <button 
              onClick={saveFloorPlanUrl}
              className="bg-violet-600 px-3 py-1 rounded text-xs"
            >
              Guardar URL
            </button>
            <button 
              onClick={() => setFloorPlanUrl('')}
              className="bg-slate-700 px-3 py-1 rounded text-xs"
            >
              Borrar
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Sube la imagen a un hosting y pega la URL aquí
          </p>
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 relative m-2 rounded-xl overflow-hidden border border-slate-800 min-h-[250px]">
        <MapComponent 
          center={location} 
          umbrales={recentUmbrales}
          floorPlanUrl={floorPlanUrl}
        />
        
        {/* Precision controls - compact overlay */}
        <div className="absolute bottom-2 right-2 z-[1000] bg-slate-900/90 p-2 rounded-lg flex flex-col gap-1 w-20">
          <button 
            onClick={() => {
              if (isLocationLocked) return; // No permitir si está fijada
              const lat = prompt('Latitud (ej: 43.7696):');
              const lng = prompt('Longitud (ej: 11.2558):');
              if (lat && lng) {
                const latVal = parseFloat(lat);
                const lngVal = parseFloat(lng);
                if (!isNaN(latVal) && !isNaN(lngVal)) {
                  setIsLocationLocked(true);
                  setLocation({ lat: latVal, lng: lngVal });
                }
              }
            }}
            className="bg-violet-600 px-2 py-1 rounded text-[9px] text-white font-bold"
          >
            📍 SET
          </button>
          
          {/* Current coords display */}
          <div className="text-[8px] text-slate-400 text-center leading-tight">
            {location.lat.toFixed(4)}<br/>{location.lng.toFixed(4)}
          </div>
          
          {/* Fine controls - 1m (compact D-pad) */}
          <div className="grid grid-cols-3 gap-0.5">
            <div></div>
            <button onClick={() => adjustLocation(0.00001, 0)} className="bg-slate-700 px-1 py-0.5 rounded text-[10px]">▲</button>
            <div></div>
            <button onClick={() => adjustLocation(0, -0.00001)} className="bg-slate-700 px-1 py-0.5 rounded text-[10px]">◄</button>
            <div></div>
            <button onClick={() => adjustLocation(0, 0.00001)} className="bg-slate-700 px-1 py-0.5 rounded text-[10px]">►</button>
            <div></div>
            <button onClick={() => adjustLocation(-0.00001, 0)} className="bg-slate-700 px-1 py-0.5 rounded text-[10px]">▼</button>
            <div></div>
          </div>
        </div>
      </div>

      {/* Coordinates Bar */}
      <div className="px-4 py-2 bg-slate-900 border-y border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <p className={`text-xs font-mono ${isLocationLocked ? 'text-emerald-400' : 'text-slate-500'}`}>
            📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            {isLocationLocked && <span className="ml-2">✓ Fijada</span>}
          </p>
          {selectedUmbralId && (
            <Link
              href={`/composer/${selectedUmbralId}`}
              className="text-xs bg-violet-600 px-2 py-1 rounded"
            >
              ✏️ Editar
            </Link>
          )}
        </div>
      </div>

      {/* DROP Button */}
      <div className="p-3 shrink-0">
        <button 
          onClick={handleDropUmbral}
          disabled={saving}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg tracking-widest shadow-lg transition-all ${
            saving ? 'bg-slate-700 cursor-wait' : 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-600/30 hover:from-violet-500 hover:to-purple-500'
          }`}
        >
          {saving ? 'Guardando...' : '+ DROP UMBRAL'}
        </button>
      </div>

      {/* Recent Umbrales */}
      <div className="px-4 pb-3 overflow-y-auto max-h-[20vh] shrink-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Últimos nodos</p>
        {loading ? (
          <p className="text-slate-600">Cargando...</p>
        ) : recentUmbrales.length === 0 ? (
          <p className="text-slate-600 text-sm">No hay umbrales. ¡Creá el primero!</p>
        ) : (
          <div className="space-y-1">
            {recentUmbrales.map((u, i) => (
              <Link
                key={u.id}
                href={`/walker/${cathedralId}?umbral=${u.id}`}
                className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                <div className={`w-2 h-2 rounded-full ${u.type === 'umbra' ? 'bg-violet-500' : 'bg-amber-500'}`}></div>
                <span className="flex-1 text-xs">Umbral {recentUmbrales.length - i}</span>
                <span className="text-xs text-slate-500">{u.position.lat.toFixed(4)}, {u.position.lng.toFixed(4)}</span>
                <span className="text-violet-400">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}