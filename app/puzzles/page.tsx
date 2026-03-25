'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const PUZZLE_TYPES = [
  { id: 'texto', label: '📝 Texto', desc: 'Responder una pregunta' },
  { id: 'codigo', label: '🔢 Código', desc: 'Descifrar números' },
  { id: 'simbolo', label: '🔯 Símbolo', desc: 'Identificar símbolos' },
  { id: 'secuencia', label: '🔢 Secuencia', desc: 'Ordenar elementos' },
  { id: 'busqueda', label: '🔍 Búsqueda', desc: 'Encontrar en el entorno' },
  { id: 'ubicacion', label: '📍 Ubicación', desc: 'Ir a un lugar' },
];

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [narrativas, setNarrativas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [p, setP] = useState({
    title: '', description: '', tipo: 'texto', 
    respuesta: '', pista: '', narrativa_id: ''
  });

  useEffect(() => {
    async function fetch() {
      const [puz, narr] = await Promise.all([
        supabase.from('puzzles').select('*').order('created_at', { ascending: false }),
        supabase.from('narrativas').select('id, title')
      ]);
      if (puz.data) setPuzzles(puz.data);
      if (narr.data) setNarrativas(narr.data);
      setLoading(false);
    }
    fetch();
  }, []);

  const create = async () => {
    if (!p.title || !p.narrativa_id) return;
    const { error } = await supabase.from('puzzles').insert({
      title: p.title,
      description: p.description,
      tipo: p.tipo,
      respuesta_correcta: p.respuesta,
      pista: p.pista,
      narrativa_id: p.narrativa_id
    });
    if (!error) {
      setP({ title: '', description: '', tipo: 'texto', respuesta: '', pista: '', narrativa_id: '' });
      setShowForm(false);
      const { data } = await supabase.from('puzzles').select('*').order('created_at', { ascending: false });
      if (data) setPuzzles(data);
    }
  };

  const getTipoInfo = (tipo: string) => PUZZLE_TYPES.find(t => t.id === tipo) || PUZZLE_TYPES[0];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <Link href="/hub" className="text-violet-400">← Hub</Link>
        <h1 className="font-bold">🧩 Puzzles</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 px-3 py-1 rounded text-sm">+ Nuevo</button>
      </header>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-3">
          {/* Primero: Seleccionar narrativa */}
          <select
            value={p.narrativa_id}
            onChange={(e) => setP({...p, narrativa_id: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="">Selecciona narrativa...</option>
            {narrativas.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
          </select>

          {/* Segundo: Título del puzzle */}
          <input
            value={p.title}
            onChange={(e) => setP({...p, title: e.target.value})}
            placeholder="Título del puzzle..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />

          <div className="grid grid-cols-3 gap-2">
            {PUZZLE_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setP({...p, tipo: t.id})}
                className={`p-2 rounded text-center ${p.tipo === t.id ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className="text-lg">{t.label}</div>
                <div className="text-[10px] text-slate-400">{t.desc}</div>
              </button>
            ))}
          </div>

          <textarea
            value={p.description}
            onChange={(e) => setP({...p, description: e.target.value})}
            placeholder="Enunciado / Descripción del puzzle..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 h-20"
          />

          <input
            value={p.respuesta}
            onChange={(e) => setP({...p, respuesta: e.target.value})}
            placeholder="Respuesta correcta..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />

          <input
            value={p.pista}
            onChange={(e) => setP({...p, pista: e.target.value})}
            placeholder="Pista (opcional)..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />

          <button onClick={create} className="w-full bg-emerald-600 py-2 rounded font-bold">Crear Puzzle</button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : puzzles.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay puzzles. Creá una narrativa primero.</p>
      ) : (
        <div className="space-y-3">
          {puzzles.map((puz) => {
            const tipo = getTipoInfo(puz.tipo);
            return (
              <div key={puz.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{puz.title}</h3>
                  <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-1 rounded">{tipo.label}</span>
                </div>
                <p className="text-slate-500 text-sm mb-2">{puz.description || 'Sin descripción'}</p>
                {puz.pista && <p className="text-amber-400 text-xs">💡 {puz.pista}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}