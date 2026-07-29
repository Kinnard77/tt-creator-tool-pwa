'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, explicarError } from '@/lib/supabase';
import { leerLatitud, leerLongitud, esNulaIsla } from '@/lib/coords';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-slate-800 flex items-center justify-center"><p className="text-slate-500">Cargando mapa...</p></div>
});

export default function AtlasPage() {
  const params = useParams();
  const id = params.id as string;
  const [cathedral, setCathedral] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  // El texto crudo de los campos, para no destruir lo que se esta escribiendo.
  const [latTexto, setLatTexto] = useState('');
  const [lngTexto, setLngTexto] = useState('');
  const [errorCoords, setErrorCoords] = useState('');

  useEffect(() => {
    async function fetchCathedral() {
      const { data } = await supabase
        .from('cathedrals')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setCathedral(data);
        const c = data.coords || { lat: 0, lng: 0 };
        setCoords(c);
        setName(data.name || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        // Si estan en la Isla Nula (0,0) dejamos los campos vacios para que
        // se vea que no hay ubicacion, en vez de mostrar un 0 enganoso.
        const nula = esNulaIsla(c.lat, c.lng);
        setLatTexto(nula ? '' : String(c.lat));
        setLngTexto(nula ? '' : String(c.lng));
      }
    }
    fetchCathedral();
  }, [id]);

  const handleSave = async () => {
    setErrorCoords('');

    // Validamos antes de tocar la base de datos: mas vale avisar que guardar
    // una catedral en medio del Atlantico.
    const rLat = leerLatitud(latTexto);
    const rLng = leerLongitud(lngTexto);

    if (!rLat.ok || !rLng.ok) {
      const ambosVacios =
        !rLat.ok && rLat.vacio && !rLng.ok && rLng.vacio;
      if (!ambosVacios) {
        const fallo = !rLat.ok ? rLat : rLng;
        setErrorCoords(
          !rLat.ok && !rLat.vacio
            ? `Latitud: ${rLat.motivo}`
            : !rLng.ok && !rLng.vacio
              ? `Longitud: ${rLng.motivo}`
              : 'Faltan la latitud o la longitud. Rellena las dos, o deja las dos vacías.'
        );
        void fallo;
        return;
      }
    }

    const nuevas =
      rLat.ok && rLng.ok ? { lat: rLat.valor, lng: rLng.valor } : { lat: 0, lng: 0 };

    setSaving(true);
    const { error } = await supabase
      .from('cathedrals')
      .update({
        name,
        city,
        country,
        coords: nuevas
      })
      .eq('id', id);

    if (error) {
      alert('Error: ' + explicarError(error));
    } else {
      setCoords(nuevas);
      setCathedral({ ...cathedral, name, city, country, coords: nuevas });
      alert('✓ Catedral actualizada');
      setEditing(false);
    }
    setSaving(false);
  };

  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const c = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoords(c);
          // Los campos de texto son la fuente de verdad al guardar, asi que
          // hay que mantenerlos sincronizados con lo que da el GPS.
          setLatTexto(String(c.lat));
          setLngTexto(String(c.lng));
          setErrorCoords('');
        },
        () => alert('No se pudo obtener GPS'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('GPS no disponible');
    }
  };

  const updateCoords = (deltaLat: number, deltaLng: number) => {
    setCoords(prev => ({
      lat: prev.lat + deltaLat,
      lng: prev.lng + deltaLng
    }));
  };

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
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div>
          <Link href="/atlas" className="text-violet-400 hover:underline text-sm">← Atlas</Link>
          <h1 className="text-xl font-bold mt-2">{cathedral.name}</h1>
          <p className="text-slate-500 text-sm">{cathedral.city}, {cathedral.country}</p>
          <p className="text-violet-400 text-xs mt-1">🟢 {cathedral.umbral_count || 0} umbrales</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs bg-slate-700 px-3 py-2 rounded"
        >
          {editing ? '✕ Cancelar' : '✏️ Editar'}
        </button>
      </header>

      {/* Edición de catedral */}
      {editing && (
        <div className="p-4 space-y-4">
          {/* Datos básicos */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-2 uppercase">Datos de la catedral</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-2"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ciudad"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-2"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="País"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Coordenadas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase">📍 Ubicación</p>
              <button
                onClick={requestGPS}
                className="text-xs bg-blue-700 px-2 py-1 rounded"
              >
                📡 GPS
              </button>
            </div>

            {/* Mapa */}
            <div className="h-48 rounded-lg overflow-hidden mb-3">
              <MapComponent 
                center={coords.lat !== 0 || coords.lng !== 0 ? coords : { lat: 40.0, lng: -3.0 }} 
                umbrales={[]} 
                height="100%"
              />
            </div>

            {/* Coordenadas manuales.
                Son campos de texto a proposito: <input type="number"> rechaza
                la coma decimal y devuelve cadena vacia, que antes se guardaba
                como 0 y mandaba la catedral al Atlantico. */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                inputMode="decimal"
                value={latTexto}
                onChange={(e) => setLatTexto(e.target.value)}
                placeholder="Latitud (ej: 21.1583)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono"
              />
              <input
                type="text"
                inputMode="decimal"
                value={lngTexto}
                onChange={(e) => setLngTexto(e.target.value)}
                placeholder="Longitud (ej: -100.9326)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Admite grados decimales (21.1583 o 21,1583) y también el formato
              de Google Maps (20°54&apos;49.4&quot;N). Puedes pegarlo tal cual.
            </p>
            {errorCoords && (
              <p className="text-amber-400 text-xs mt-2">{errorCoords}</p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold disabled:opacity-50"
          >
            {saving ? 'Guardando...' : '✓ GUARDAR CAMBIOS'}
          </button>
        </div>
      )}

      {/* siempre visible: botones de Walker y Sequencer */}
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