'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Sugerencias basadas en Fulcanelli + cathedrals + experiencias creadas
const SUGGESTIONS = [
  // De las catedrales que ya existen
  { title: 'El Misterio de Notre Dame', synopsis: 'Los secretos ocultos en la catedral parisina', ubicacion: 'Notre Dame, París', epoca: '1163-1345' },
  { title: 'La Catedral de Valencia', synopsis: 'El gótico mediterráneo y sus misterios', ubicacion: 'Catedral de Valencia', epoca: '1262-1482' },
  { title: 'La Catedral de Sevilla', synopsis: 'La mayor catedral gótica del mundo', ubicacion: 'Catedral de Sevilla', epoca: '1401-1506' },
  { title: 'Dolores Hidalgo: El Grito', synopsis: 'Donde comenzó la independencia de México', ubicacion: 'Parroquía de Dolores Hidalgo', epoca: '1810' },
  
  // Temas de Fulcanelli
  { title: 'El Lenguaje de las Piedras', synopsis: 'Los mensajes ocultos en la arquitectura sagrada', ubicacion: 'Catedral genérica', epoca: 'Varía' },
  { title: 'Los Rosetones: Ojos del Cielo', synopsis: 'El simbolismo de las ventanas circulares', ubicacion: 'Catedral genérica', epoca: 'Varía' },
  { title: 'La Alquimia en las Catedrales', synopsis: 'Los elementos alquímicos en la arquitectura', ubicacion: 'Catedral genérica', epoca: 'Varía' },
  { title: 'El Taller de los Arquitectos', synopsis: 'Los constructores medievales y sus secretos', ubicacion: 'Catedral genérica', epoca: '1100-1400' },
  
  // Experiencias que creamos
  { title: 'La Llamada - Dolores Hidalgo', synopsis: 'El inicio del recorrido en la parroquia', ubicacion: 'Parroquía de Dolores Hidalgo', epoca: '1810' },
  { title: 'La Campana', synopsis: 'El momento que cambió la historia', ubicacion: 'Parroquía de Dolores Hidalgo', epoca: '1810' },
  { title: 'Los Nombres Olvidados', synopsis: 'Los héroes que la historia silenció', ubicacion: 'Capilla lateral', epoca: '1810' },
  { title: 'El Pasaje Secreto', synopsis: 'Un corredor que no aparece en los mapas', ubicacion: 'Pasillo lateral', epoca: 'Siglos XVIII-XIX' },
  { title: 'La Cifra Oculta', synopsis: 'Matemáticas escondidas en el templo', ubicacion: 'Altar mayor', epoca: 'Varía' },
  { title: 'El Susurro', synopsis: 'Secretos en el confesionario', ubicacion: 'Confesionario', epoca: 'Varía' },
  { title: 'La Salida', synopsis: 'El cierre del ciclo iniciático', ubicacion: 'Puerta lateral', epoca: 'Varía' },
];

interface Narrativa {
  id: string;
  title: string;
  description: string;
  content: { ubicacion?: string; epoca?: string };
  created_at: string;
}

export default function NarrativasPage() {
  const [narrativas, setNarrativas] = useState<Narrativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [n, setN] = useState({ title: '', synopsis: '', ubicacion: '', epoca: '' });
  const [useSuggestion, setUseSuggestion] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('narrativas')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setNarrativas(data);
      setLoading(false);
    }
    fetch();
  }, []);

  // Cuando selecciona una sugerencia, autocompleta
  const selectSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setN({ title: s.title, synopsis: s.synopsis, ubicacion: s.ubicacion, epoca: s.epoca });
  };

  const create = async () => {
    if (!n.title) return;
    const { error } = await supabase.from('narrativas').insert({
      title: n.title,
      description: n.synopsis,
      type: 'mixed',
      content: { ubicacion: n.ubicacion, epoca: n.epoca }
    });
    if (!error) {
      setN({ title: '', synopsis: '', ubicacion: '', epoca: '' });
      setShowForm(false);
      setUseSuggestion(true);
      const { data } = await supabase.from('narrativas').select('*').order('created_at', { ascending: false });
      if (data) setNarrativas(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <Link href="/hub" className="text-violet-400">← Hub</Link>
        <h1 className="font-bold">📖 Narrativas</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 px-3 py-1 rounded text-sm">
          + Nueva
        </button>
      </header>

      {/* 📋 WORKFLOW GUIDE */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 mb-4">
        <p className="text-xs text-amber-400 font-bold mb-2">📋 ORDEN RECOMENDADO:</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-violet-400">1️⃣ Narrativas</span>
          <span>→</span>
          <Link href="/puzzles" className="text-emerald-400 hover:underline">2️⃣ Puzzles</Link>
          <span>→</span>
          <Link href="/atlas" className="text-violet-400 hover:underline">3️⃣ Nodos (UMBRA)</Link>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">💡 Las narrativas son el punto de partida. Crea una historia primero.</p>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-3">
          {/* Dropdown de sugerencias */}
          {useSuggestion && (
            <div>
              <label className="text-xs text-slate-500 block mb-2">📚 Basado en Fulcanelli + experiencias:</label>
              <select
                onChange={(e) => {
                  const s = SUGGESTIONS[parseInt(e.target.value)];
                  if (s) selectSuggestion(s);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Seleccioná una sugerencia...</option>
                <optgroup label="Catedrales">
                  {SUGGESTIONS.slice(0, 4).map((s, i) => (
                    <option key={i} value={i}>{s.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Temas de Fulcanelli">
                  {SUGGESTIONS.slice(4, 8).map((s, i) => (
                    <option key={i + 4} value={i + 4}>{s.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Experiencias UMBRA">
                  {SUGGESTIONS.slice(8).map((s, i) => (
                    <option key={i + 8} value={i + 8}>{s.title}</option>
                  ))}
                </optgroup>
              </select>
              <button 
                onClick={() => setUseSuggestion(false)} 
                className="text-xs text-slate-500 mt-2 underline"
              >
                O crear una nueva desde cero
              </button>
            </div>
          )}

          {!useSuggestion && (
            <button 
              onClick={() => setUseSuggestion(true)} 
              className="text-xs text-slate-500 underline mb-2"
            >
              ← Volver a las sugerencias
            </button>
          )}

          <input
            value={n.title}
            onChange={(e) => setN({...n, title: e.target.value})}
            placeholder="Título de la narrativa..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />
          <textarea
            value={n.synopsis}
            onChange={(e) => setN({...n, synopsis: e.target.value})}
            placeholder="Synopsis / Resumen..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 h-20"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={n.ubicacion}
              onChange={(e) => setN({...n, ubicacion: e.target.value})}
              placeholder="Ubicación"
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            />
            <input
              value={n.epoca}
              onChange={(e) => setN({...n, epoca: e.target.value})}
              placeholder="Época"
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            />
          </div>
          <button onClick={create} className="w-full bg-violet-600 py-2 rounded font-bold">Crear</button>
        </div>
      )}

      {narrativas.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay narrativas. Creá una desde las sugerencias.</p>
      ) : (
        <div className="space-y-3">
          {narrativas.map((narr) => (
            <Link key={narr.id} href={`/narrativas/${narr.id}`} className="block bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-violet-500/50">
              <h3 className="font-bold text-lg">{narr.title}</h3>
              <p className="text-slate-500 text-sm mb-2">{narr.description || 'Sin synopsis'}</p>
              <div className="flex gap-3 text-xs text-slate-600">
                <span>📍 {narr.content?.ubicacion || 'Sin ubicación'}</span>
                <span>⏰ {narr.content?.epoca || 'Sin época'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}