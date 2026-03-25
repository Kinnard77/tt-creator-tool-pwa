'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ARQUETIPOS DEL VIAJE DEL HÉROE (Campbell)
const HERO_JOURNEY_PHASES = [
  { id: 'mundo_ordinario', label: '🏠 Mundo Ordinario', desc: 'La vida normal del turista antes de la aventura' },
  { id: 'llamada', label: '📞 Llamada', desc: 'El misterioso virus aparece - La Legión hace contacto' },
  { id: 'rechazo', label: '❌ Rechazo', desc: 'El jugador duda - "¿Por qué yo?"' },
  { id: 'cruce_umbral', label: '🚪 Cruce del Umbral', desc: 'Aceptar la misión - cruzar al mundo oculto' },
  { id: 'pruebas', label: '🧪 Pruebas', desc: 'Desafíos en las catedrales - resolver enigmas' },
  { id: 'mentor', label: '🎓 El Mentor', desc: 'Aenigma aparece - guía y да подсказки' },
  { id: 'camara_oscura', label: '🌑 Cámara Oscura', desc: 'El momento oscuro - descubrir la verdad' },
  { id: 'recompensa', label: '🏆 Recompensa', desc: 'Obtener la Llave de Cronos' },
  { id: 'renacimiento', label: '✨ Renacimiento', desc: 'Transformación completa: Turista → Espía' },
];

// PERSONAJES VICTORIANOS DEL LORE
const VICTORIAN_CHARACTERS = [
  { id: 'darwin', name: 'Charles Darwin', role: 'Científico', desc: 'Revolucionó la biología y la religión' },
  { id: 'ada', name: 'Ada Lovelace', role: 'Programadora', desc: 'Primer algoritmo para máquina' },
  { id: 'dickens', name: 'Charles Dickens', role: 'Escritor', desc: 'Denunció la pobreza y desigualdad' },
  { id: 'brunel', name: 'Isambard K. Brunel', role: 'Ingeniero', desc: 'Puentes y barcos de vapor' },
  { id: 'tesla', name: 'Nikola Tesla', role: 'Inventor', desc: 'Corriente alterna, motor de inducción' },
  { id: 'nietzsche', name: 'Friedrich Nietzsche', role: 'Filósofo', desc: '"Dios ha muerto" - crisis de religión' },
  { id: 'klimt', name: 'Gustav Klimt', role: 'Artista', desc: 'Ruptura estética - lujo y ansiedad' },
  { id: 'freud', name: 'Sigmund Freud', role: 'Psicoanalista', desc: 'Descubrimiento del inconsciente' },
];

// SUGERENCIAS EXISTENTES
const SUGGESTIONS = [
  { title: 'El Misterio de Notre Dame', synopsis: 'Los secretos ocultos en la catedral parisina', ubicacion: 'Notre Dame, París', epoca: '1163-1345', fase: 'pruebas' },
  { title: 'La Catedral de Valencia', synopsis: 'El gótico mediterráneo y sus misterios', ubicacion: 'Catedral de Valencia', epoca: '1262-1482', fase: 'pruebas' },
  { title: 'Dolores Hidalgo: El Grito', synopsis: 'Donde comenzó la independencia de México', ubicacion: 'Parroquía de Dolores Hidalgo', epoca: '1810', fase: 'pruebas' },
  { title: 'La Llamada del Virus', synopsis: 'El misterioso virus aparece - La Legión hace contacto', ubicacion: 'Mundo Ordinario', epoca: '2024', fase: 'llamada' },
  { title: 'El Rechazo Inicial', synopsis: '"¿Por qué yo?" - el jugador duda', ubicacion: 'Mundo Ordinario', epoca: '2024', fase: 'rechazo' },
  { title: 'Cruce al Mundo Oculto', synopsis: 'Aceptar la misión - cruzar al mundo de La Legión', ubicacion: 'Umbral', epoca: '1881', fase: 'cruce_umbral' },
  { title: 'El Mentor: Aenigma', synopsis: 'Aenigma aparece para guiar al jugador', ubicacion: 'Espacio Meta', epoca: 'Eterno', fase: 'mentor' },
  { title: 'La Cámara Oscura', synopsis: 'Descubrir que todo fue una trampa', ubicacion: 'Secreto', epoca: '1881', fase: 'camara_oscura' },
  { title: 'La Llave de Cronos', synopsis: 'Obtener la recompensa final', ubicacion: 'Tesoro', epoca: '1881', fase: 'recompensa' },
  { title: 'Renacimiento del Espía', synopsis: 'Transformación: Turista → Espía', ubicacion: 'Final', epoca: '2024', fase: 'renacimiento' },
];

interface Narrativa {
  id: string;
  title: string;
  description: string;
  content: { ubicacion?: string; epoca?: string; fase?: string };
  created_at: string;
}

export default function NarrativasPage() {
  const [narrativas, setNarrativas] = useState<Narrativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [n, setN] = useState({ title: '', synopsis: '', ubicacion: '', epoca: '', fase: 'pruebas' });
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

  const selectSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setN({ title: s.title, synopsis: s.synopsis, ubicacion: s.ubicacion, epoca: s.epoca, fase: s.fase });
  };

  const create = async () => {
    if (!n.title) return;
    const { error } = await supabase.from('narrativas').insert({
      title: n.title,
      description: n.synopsis,
      type: 'mixed',
      content: { ubicacion: n.ubicacion, epoca: n.epoca, fase: n.fase }
    });
    if (!error) {
      setN({ title: '', synopsis: '', ubicacion: '', epoca: '', fase: 'pruebas' });
      setShowForm(false);
      setUseSuggestion(true);
      const { data } = await supabase.from('narrativas').select('*').order('created_at', { ascending: false });
      if (data) setNarrativas(data);
    }
  };

  const getFaseInfo = (fase: string) => HERO_JOURNEY_PHASES.find(f => f.id === fase);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <Link href="/hub" className="text-violet-400">← Hub</Link>
        <h1 className="font-bold">📖 Narrativas</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-600 px-3 py-1 rounded text-sm">
          + Nueva
        </button>
      </header>

      {/* Leyenda del Viaje del Héroe */}
      <div className="mb-4 p-3 bg-slate-900 border border-violet-500/30 rounded-xl">
        <p className="text-xs text-violet-400 mb-2">🕰️ ARCO DEL VIAJE DEL HÉROE:</p>
        <div className="flex flex-wrap gap-1">
          {HERO_JOURNEY_PHASES.map(f => (
            <span key={f.id} className="text-[10px] bg-slate-800 px-2 py-1 rounded">{f.label}</span>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-3">
          {/* Dropdown de sugerencias */}
          {useSuggestion && (
            <div>
              <label className="text-xs text-slate-500 block mb-2">📚 Basado en el Lore + Viaje del Héroe:</label>
              <select
                onChange={(e) => {
                  const s = SUGGESTIONS[parseInt(e.target.value)];
                  if (s) selectSuggestion(s);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Seleccioná una sugerencia...</option>
                <optgroup label="Fases del Viaje del Héroe">
                  {HERO_JOURNEY_PHASES.map((f, i) => (
                    <option key={f.id} value={i}>{f.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Narrativas del Lore">
                  {SUGGESTIONS.map((s, i) => (
                    <option key={s.title} value={i + 10}>{s.title}</option>
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

          {/* Fase del Viaje del Héroe */}
          <div>
            <label className="text-xs text-slate-500 block mb-1">Fase del Viaje:</label>
            <select
              value={n.fase}
              onChange={(e) => setN({...n, fase: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
            >
              {HERO_JOURNEY_PHASES.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

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

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : narrativas.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay narrativas. Creá una desde las sugerencias.</p>
      ) : (
        <div className="space-y-3">
          {narrativas.map((narr) => {
            const fase = getFaseInfo(narr.content?.fase || 'pruebas');
            return (
              <Link key={narr.id} href={`/narrativas/${narr.id}`} className="block bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-violet-500/50">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{narr.title}</h3>
                  {fase && <span className="text-[10px] bg-violet-900 text-violet-300 px-2 py-0.5 rounded">{fase.label}</span>}
                </div>
                <p className="text-slate-500 text-sm mb-2">{narr.description || 'Sin synopsis'}</p>
                <div className="flex gap-3 text-xs text-slate-600">
                  <span>📍 {narr.content?.ubicacion || 'Sin ubicación'}</span>
                  <span>⏰ {narr.content?.epoca || 'Sin época'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}