'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// PERSONAJES VICTORIANOS DEL LORE (para sugerencias)
const VICTORIAN_CHARACTERS = [
  { name: 'Charles Darwin', role: 'Científico', desc: 'Revolucionó la biología y la religión' },
  { name: 'Ada Lovelace', role: 'Programadora', desc: 'Primer algoritmo para máquina' },
  { name: 'Charles Dickens', role: 'Escritor', desc: 'Denunció la pobreza y desigualdad social' },
  { name: 'Oscar Wilde', role: 'Escritor', desc: 'Sátira y filosofía social' },
  { name: 'Reina Victoria', role: 'Monarca', desc: 'Era victoriana - контроль' },
  { name: 'Isambard K. Brunel', role: 'Ingeniero', desc: 'Puentes y barcos de vapor' },
  { name: 'Alexander G. Bell', role: 'Inventor', desc: 'El telégrafo - el Internet victoriano' },
  { name: 'Nikola Tesla', role: 'Inventor', desc: 'Corriente alterna y motor de inducción' },
  { name: 'Friedrich Nietzsche', role: 'Filósofo', desc: '"Dios ha muerto" - crisis de religión' },
  { name: 'Gustav Klimt', role: 'Artista', desc: 'Ruptura estética - lujo y ansiedad' },
  { name: 'Sigmund Freud', role: 'Psicoanalista', desc: 'Descubrimiento del inconsciente' },
  { name: 'Annie Besant', role: 'Activista', desc: 'Teosofía y derechos de la mujer' },
  { name: 'William Blake', role: 'Poeta', desc: 'Misticismo y visión artística' },
  { name: 'Familia Rothschild', role: 'Banca', desc: 'Poder financiero mundial' },
];

// ROLES EN EL JUEGO
const ROLES = [
  { id: 'mentor', label: '🎓 Mentor', desc: 'Guía al jugador (ej: Aenigma)' },
  { id: 'aliado', label: '🤝 Aliado', desc: 'Ayuda al jugador' },
  { id: 'heroe', label: '🦸 Héroe', desc: 'Personaje histórico que inspirar' },
  { id: 'guardian', label: '🛡️ Guardián', desc: 'Protege un secreto o lugar' },
  { id: 'mensajero', label: '📜 Mensajero', desc: 'Trae noticias o pistas' },
  { id: 'sombra', label: '🌑 Sombra', desc: 'Antagonista - la amenaza' },
  { id: 'embaucador', label: '🎭 Embaucador', desc: 'Engaña al jugador' },
  { id: 'travieso', label: '😏 Travieso', desc: 'Añade caos o humor' },
];

// AENIGMA - El Mentor por excelencia
const AENIGMA = {
  id: 'aenigma',
  nombre: 'Aenigma',
  rol: 'Mentor',
  descripcion: 'El Maestro Creador de Puzzles. Entidad extradiegética que guía al jugador a través de los enigmas. Aparece en la app como voz omnisciente.',
  era: 'Eterno',
  relevancia: 'CRÍTICO - Es el nexo entre el jugador y La Legión',
  img: '🔮'
};

interface Personaje {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
  era: string;
  relevancia: string;
  narrativa_id?: string;
  created_at: string;
}

export default function PersonajesPage() {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [narrativas, setNarrativas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [p, setP] = useState({ nombre: '', rol: 'aliado', descripcion: '', era: '', relevancia: '', narrativa_id: '' });

  useEffect(() => {
    async function fetch() {
      const [pers, narr] = await Promise.all([
        supabase.from('personajes').select('*').order('created_at', { ascending: false }),
        supabase.from('narrativas').select('id, title')
      ]);
      if (pers.data) setPersonajes(pers.data);
      if (narr.data) setNarrativas(narr.data);
      setLoading(false);
    }
    fetch();
  }, []);

  const create = async () => {
    if (!p.nombre) return;
    const { error } = await supabase.from('personajes').insert({
      nombre: p.nombre,
      rol: p.rol,
      descripcion: p.descripcion,
      era: p.era,
      relevancia: p.relevancia,
      narrativa_id: p.narrativa_id || null
    });
    if (!error) {
      setP({ nombre: '', rol: 'aliado', descripcion: '', era: '', relevancia: '', narrativa_id: '' });
      setShowForm(false);
      const { data } = await supabase.from('personajes').select('*').order('created_at', { ascending: false });
      if (data) setPersonajes(data);
    }
  };

  const selectVictorian = (c: typeof VICTORIAN_CHARACTERS[0]) => {
    setP({ ...p, nombre: c.name, rol: 'heroe', descripcion: c.desc, era: 'Victoriana (1837-1901)', relevancia: 'Personaje histórico del Lore' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <Link href="/hub" className="text-violet-400">← Hub</Link>
        <h1 className="font-bold">🎭 Personajes</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-rose-600 px-3 py-1 rounded text-sm">+ Nuevo</button>
      </header>

      {/* Aenigma - Siempre visible */}
      <div className="mb-6 bg-gradient-to-r from-amber-900/50 to-violet-900/50 border border-amber-500/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{AENIGMA.img}</span>
          <div>
            <h2 className="font-bold text-amber-400">{AENIGMA.nombre}</h2>
            <p className="text-xs text-amber-300">{AENIGMA.rol} • {AENIGMA.era}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-2">{AENIGMA.descripcion}</p>
        <p className="text-xs text-amber-400 mt-2">⚡ {AENIGMA.relevancia}</p>
      </div>

      {/* Roles del Viaje del Héroe */}
      <div className="mb-4 p-3 bg-slate-900 border border-rose-500/30 rounded-xl">
        <p className="text-xs text-rose-400 mb-2">🎭 ROLES EN EL JUEGO:</p>
        <div className="flex flex-wrap gap-1">
          {ROLES.map(r => (
            <span key={r.id} className="text-[10px] bg-slate-800 px-2 py-1 rounded">{r.label}</span>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-3">
          {/* Sugerencias de personajes victorianos */}
          <div>
            <label className="text-xs text-slate-500 block mb-2">📚 Personajes del Lore Victoriano:</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {VICTORIAN_CHARACTERS.slice(0, 6).map(c => (
                <button
                  key={c.name}
                  onClick={() => selectVictorian(c)}
                  className="text-[10px] bg-slate-700 px-2 py-1 rounded hover:bg-slate-600"
                >
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Rol */}
          <select
            value={p.rol}
            onChange={(e) => setP({...p, rol: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id}>{r.label} - {r.desc}</option>
            ))}
          </select>

          <input
            value={p.nombre}
            onChange={(e) => setP({...p, nombre: e.target.value})}
            placeholder="Nombre del personaje..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />
          
          <textarea
            value={p.descripcion}
            onChange={(e) => setP({...p, descripcion: e.target.value})}
            placeholder="Descripción..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 h-16"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              value={p.era}
              onChange={(e) => setP({...p, era: e.target.value})}
              placeholder="Era (ej: 1881)"
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            />
            <select
              value={p.narrativa_id}
              onChange={(e) => setP({...p, narrativa_id: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            >
              <option value="">Narrativa (opcional)</option>
              {narrativas.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
            </select>
          </div>

          <input
            value={p.relevancia}
            onChange={(e) => setP({...p, relevancia: e.target.value})}
            placeholder="Relevancia en la historia..."
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />

          <button onClick={create} className="w-full bg-rose-600 py-2 rounded font-bold">Crear Personaje</button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {personajes.map((pers) => {
            const rol = ROLES.find(r => r.id === pers.rol);
            return (
              <div key={pers.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{pers.nombre}</h3>
                  {rol && <span className="text-[10px] bg-rose-900 text-rose-300 px-2 py-0.5 rounded">{rol.label}</span>}
                </div>
                <p className="text-slate-500 text-sm">{pers.descripcion}</p>
                <div className="flex gap-3 text-xs text-slate-600 mt-2">
                  <span>⏰ {pers.era || 'Sin era'}</span>
                </div>
                {pers.relevancia && <p className="text-xs text-slate-500 mt-1">📌 {pers.relevancia}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}