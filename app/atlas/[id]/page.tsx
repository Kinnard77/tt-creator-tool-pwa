'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    async function fetchCathedral() {
      const { data } = await supabase
        .from('cathedrals')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setCathedral(data);
        setCoords(data.coords || { lat: 0, lng: 0 });
        setName(data.name || '');
        setCity(data.city || '');
        setCountry(data.country || '');
      }
    }
    fetchCathedral();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('cathedrals')
      .update({
        name,
        city,
        country,
        coords
      })
      .eq('id', id);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('✓ Catedral actualizada');
      setEditing(false);
    }
    setSaving(false);
  };

  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
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
          <Link href="/" className="text-violet-400 hover:underline text-sm">← Atlas</Link>
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

            <div className="text-center mb-3">
              <p className="font-mono text-sm">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
            </div>

            {/* Controles de precisión */}
            <div className="grid grid-cols-3 gap-1 w-24 mx-auto mb-2">
              <div></div>
              <button onClick={() => updateCoords(0.00001, 0)} className="bg-slate-700 px-2 py-1 rounded text-xs">▲</button>
              <div></div>
              <button onClick={() => updateCoords(0, -0.00001)} className="bg-slate-700 px-2 py-1 rounded text-xs">◄</button>
              <button onClick={() => updateCoords(0, 0.00001)} className="bg-slate-700 px-2 py-1 rounded text-xs">►</button>
              <div></div>
              <button onClick={() => updateCoords(-0.00001, 0)} className="bg-slate-700 px-2 py-1 rounded text-xs">▼</button>
              <div></div>
            </div>
            <p className="text-[10px] text-slate-500 text-center">+1m</p>

            {/* Coordenadas manuales */}
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                step="0.000001"
                value={coords.lat}
                onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) || 0 })}
                placeholder="Latitud"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                step="0.000001"
                value={coords.lng}
                onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) || 0 })}
                placeholder="Longitud"
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
            </div>
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

      {!editing && (
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
      )}
    </div>
  );
}