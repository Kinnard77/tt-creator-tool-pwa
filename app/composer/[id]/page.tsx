'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type LayerType = 'umbra' | 'sigilum' | 'escenario';

const triggerOptions = [2, 5, 10, 15, 20, 30, 50];
const pacingLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function ComposerPage() {
  const params = useParams();
  const umbralId = params.id as string;

  // Trigger config
  const [triggerRadius, setTriggerRadius] = useState(5);
  const [requiresOrientation, setRequiresOrientation] = useState(false);

  // UMBRA layer
  const [umbraType, setUmbraType] = useState<'text' | 'audio' | 'haptic' | 'silence'>('text');
  const [umbraContent, setUmbraContent] = useState('');
  const [umbraPacing, setUmbraPacing] = useState(5);

  // SIGILUM layer  
  const [sigilumActive, setSigilumActive] = useState(false);
  const [sigilumPuzzle, setSigilumPuzzle] = useState('');
  const [sigilumAnswer, setSigilumAnswer] = useState('');
  const [sigilumHint, setSigilumHint] = useState('');

  // ESCENARIO layer
  const [escenarioActive, setEscenarioActive] = useState(false);
  const [escenarioTitle, setEscenarioTitle] = useState('');
  const [escenarioYear, setEscenarioYear] = useState('');
  const [escenarioDescription, setEscenarioDescription] = useState('');
  const [escenarioMediaType, setEscenarioMediaType] = useState<'text' | 'audio'>('text');
  const [escenarioMediaUrl, setEscenarioMediaUrl] = useState('');

  const [loading, setLoading] = useState(true);

  // Load existing umbral data
  useEffect(() => {
    async function fetchUmbral() {
      const { data } = await supabase
        .from('umbrales')
        .select('*')
        .eq('id', umbralId)
        .single();
      
      if (data) {
        setTriggerRadius(data.trigger_config?.radius || 5);
        if (data.experience_config) {
          const exp = data.experience_config;
          // Load umbra layer
          if (exp.umbra) {
            setUmbraType(exp.umbra.type || 'text');
            setUmbraContent(exp.umbra.content || '');
            setUmbraPacing(exp.umbra.pacing || 5);
          }
          // Load sigilum layer
          if (exp.sigilum) {
            setSigilumActive(true);
            setSigilumPuzzle(exp.sigilum.puzzle || '');
            setSigilumAnswer(exp.sigilum.answer || '');
            setSigilumHint(exp.sigilum.hint || '');
          }
          // Load escenario layer
          if (exp.escenario) {
            setEscenarioActive(true);
            setEscenarioTitle(exp.escenario.title || '');
            setEscenarioYear(exp.escenario.year || '');
            setEscenarioDescription(exp.escenario.description || '');
            setEscenarioMediaType(exp.escenario.mediaType || 'text');
            setEscenarioMediaUrl(exp.escenario.mediaUrl || '');
          }
        }
      }
      setLoading(false);
    }
    fetchUmbral();
  }, [umbralId]);

  const handleSave = async () => {
    const experience_config = {
      umbra: {
        type: umbraType,
        content: umbraContent,
        pacing: umbraPacing
      },
      sigilum: sigilumActive ? {
        puzzle: sigilumPuzzle,
        answer: sigilumAnswer,
        hint: sigilumHint
      } : null,
      escenario: escenarioActive ? {
        title: escenarioTitle,
        year: escenarioYear,
        description: escenarioDescription,
        mediaType: escenarioMediaType,
        mediaUrl: escenarioMediaUrl
      } : null
    };

    const { error } = await supabase
      .from('umbrales')
      .update({
        trigger_config: { type: 'geo_radius', radius: triggerRadius, orientation: requiresOrientation },
        experience_config
      })
      .eq('id', umbralId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('✓ UMBRAL ACTUALIZADO');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <p className="text-violet-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between sticky top-0 z-20">
        <Link href="javascript:history.back()" className="text-violet-400 hover:underline text-sm">← Volver</Link>
        <h1 className="text-violet-400 font-bold text-sm">✨ Composer</h1>
        <button onClick={handleSave} className="text-xs bg-violet-600 px-3 py-1 rounded">Guardar</button>
      </header>

      <div className="p-4 space-y-4">
        {/* 📷 Foto */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-2">📷 Foto de referencia</p>
          <div className="h-24 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm">
            Tocar para agregar
          </div>
        </div>

        {/* ⚡ Trigger */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-violet-400 font-bold text-xs uppercase mb-3">⚡ Trigger</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {triggerOptions.map(val => (
              <button
                key={val}
                onClick={() => setTriggerRadius(val)}
                className={`px-3 py-1 rounded text-xs ${triggerRadius === val ? 'bg-violet-600' : 'bg-slate-700'}`}
              >
                {val}m
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input 
              type="checkbox" 
              checked={requiresOrientation}
              onChange={(e) => setRequiresOrientation(e.target.checked)}
              className="accent-violet-500"
            />
            Requiere orientación específica
          </label>
        </div>

        {/* 🎬 ESCENARIO (Capa histórica/dramática) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-cyan-400 font-bold text-xs uppercase">🎬 Escenario</h2>
            <label className="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                checked={escenarioActive}
                onChange={(e) => setEscenarioActive(e.target.checked)}
                className="accent-cyan-500"
              />
              Activar
            </label>
          </div>
          
          {escenarioActive && (
            <div className="space-y-3">
              <input
                type="text"
                value={escenarioTitle}
                onChange={(e) => setEscenarioTitle(e.target.value)}
                placeholder="Título (ej: La construcción del altar)"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={escenarioYear}
                onChange={(e) => setEscenarioYear(e.target.value)}
                placeholder="Año/Época (ej: 1623)"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
              <textarea
                value={escenarioDescription}
                onChange={(e) => setEscenarioDescription(e.target.value)}
                placeholder="Descripción de la escena histórica..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setEscenarioMediaType('text')}
                  className={`flex-1 py-1 rounded text-xs ${escenarioMediaType === 'text' ? 'bg-cyan-600' : 'bg-slate-700'}`}
                >
                  📝 Texto
                </button>
                <button
                  onClick={() => setEscenarioMediaType('audio')}
                  className={`flex-1 py-1 rounded text-xs ${escenarioMediaType === 'audio' ? 'bg-cyan-600' : 'bg-slate-700'}`}
                >
                  🎵 Audio
                </button>
              </div>
              {escenarioMediaType === 'audio' && (
                <input
                  type="text"
                  value={escenarioMediaUrl}
                  onChange={(e) => setEscenarioMediaUrl(e.target.value)}
                  placeholder="URL del audio..."
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                />
              )}
            </div>
          )}
        </div>

        {/* 🧩 SIGILUM (Capa intelectual - puzzles) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-amber-400 font-bold text-xs uppercase">🧩 Sigilum</h2>
            <label className="flex items-center gap-2 text-xs">
              <input 
                type="checkbox" 
                checked={sigilumActive}
                onChange={(e) => setSigilumActive(e.target.checked)}
                className="accent-amber-500"
              />
              Activar
            </label>
          </div>
          
          {sigilumActive && (
            <div className="space-y-3">
              <textarea
                value={sigilumPuzzle}
                onChange={(e) => setSigilumPuzzle(e.target.value)}
                placeholder="Enunciado del puzzle..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20"
              />
              <input
                type="text"
                value={sigilumAnswer}
                onChange={(e) => setSigilumAnswer(e.target.value)}
                placeholder="Respuesta correcta..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={sigilumHint}
                onChange={(e) => setSigilumHint(e.target.value)}
                placeholder="Pista (opcional)..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        {/* 🌑 UMBRA (Capa sensorial) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-violet-400 font-bold text-xs uppercase mb-3">🌑 Umbra</h2>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { id: 'text', label: '📝' },
              { id: 'audio', label: '🎵' },
              { id: 'haptic', label: '📳' },
              { id: 'silence', label: '🔇' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setUmbraType(t.id as any)}
                className={`py-2 rounded text-center ${umbraType === t.id ? 'bg-violet-600' : 'bg-slate-700'}`}
              >
                <span className="text-lg">{t.label}</span>
              </button>
            ))}
          </div>

          {umbraType !== 'silence' && (
            <textarea
              value={umbraContent}
              onChange={(e) => setUmbraContent(e.target.value)}
              placeholder={umbraType === 'text' ? 'Texto enigmático...' : 'URL del audio...'}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-20 mb-3"
            />
          )}

          <div>
            <label className="text-xs text-slate-500 block mb-2">Intensidad: {umbraPacing}</label>
            <div className="flex justify-between gap-1">
              {pacingLevels.map(l => (
                <button
                  key={l}
                  onClick={() => setUmbraPacing(l)}
                  className={`flex-1 py-1 rounded text-xs ${umbraPacing === l ? 'bg-violet-600' : 'bg-slate-700'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold"
        >
          ✓ GUARDAR UMBRAL
        </button>
      </div>
    </div>
  );
}