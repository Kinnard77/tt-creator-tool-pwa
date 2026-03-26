'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AENIGMA = {
  id: 'aenigma-maestro',
  name: 'Aenigma',
  role: 'Maestro Creador de Puzzles',
  description: 'El enigmatico arquitecto de los enigmas. Sus puzzles ocultan verdades que el tiempo ha olvidado. Nadie conoce su verdadero rostro, solo su presencia en cada desafío.',
  is_special: true
};

export default function PersonajesPage() {
  const [personajes, setPersonajes] = useState<any[]>([]);
  const [narrativas, setNarrativas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPersonaje, setNewPersonaje] = useState({ name: '', role: '', description: '', narrativa_id: '' });

  useEffect(() => {
    async function fetchData() {
      const { data: pers } = await supabase
        .from('personajes')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: narr } = await supabase
        .from('narrativas')
        .select('id, title');
      
      if (pers) setPersonajes(pers);
      if (narr) setNarrativas(narr);
      setLoading(false);
    }
    fetchData();
  }, []);

  const createPersonaje = async () => {
    if (!newPersonaje.name || !newPersonaje.narrativa_id) {
      alert('Nombre y narrativa son requeridos');
      return;
    }
    
    const { error } = await supabase
      .from('personajes')
      .insert({
        name: newPersonaje.name,
        role: newPersonaje.role,
        description: newPersonaje.description,
        narrativa_id: newPersonaje.narrativa_id
      });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setNewPersonaje({ name: '', role: '', description: '', narrativa_id: '' });
      setShowForm(false);
      const { data } = await supabase.from('personajes').select('*').order('created_at', { ascending: false });
      if (data) setPersonajes(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <p className="text-rose-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <Link href="/hub" className="text-violet-400 hover:underline">← Hub</Link>
        <h1 className="text-xl font-bold">🎭 Personajes</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-rose-600 px-3 py-1 rounded"
        >
          + Nuevo
        </button>
      </header>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6">
          <input
            type="text"
            value={newPersonaje.name}
            onChange={(e) => setNewPersonaje({...newPersonaje, name: e.target.value})}
            placeholder="Nombre del personaje..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-3"
          />
          <input
            type="text"
            value={newPersonaje.role}
            onChange={(e) => setNewPersonaje({...newPersonaje, role: e.target.value})}
            placeholder="Rol (protagonista, antagonista, guía...)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-3"
          />
          <select
            value={newPersonaje.narrativa_id}
            onChange={(e) => setNewPersonaje({...newPersonaje, narrativa_id: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-3"
          >
            <option value="">Selecciona narrativa...</option>
            {narrativas.map(n => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
          <textarea
            value={newPersonaje.description}
            onChange={(e) => setNewPersonaje({...newPersonaje, description: e.target.value})}
            placeholder="Descripción del personaje..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-3 h-24"
          />
          <button 
            onClick={createPersonaje}
            className="w-full bg-rose-600 py-2 rounded-lg font-bold"
          >
            Crear Personaje
          </button>
        </div>
      )}

      {/* AENIGMA - Siempre visible */}
      <div className="grid gap-4 max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-amber-900/30 to-purple-900/30 border-2 border-amber-500/50 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-bold">AENIGMA</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-2xl">🎭</div>
            <div>
              <h3 className="font-bold text-lg">{AENIGMA.name}</h3>
              <p className="text-xs text-amber-400">{AENIGMA.role}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm italic">"{AENIGMA.description}"</p>
        </div>
      </div>

      {/* Otros personajes */}
      {personajes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">No hay más personajes.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-2xl mx-auto">
          {personajes.map((p) => (
            <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center text-lg">🎭</div>
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-rose-400">{p.role || 'Sin rol'}</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm">{p.description || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}