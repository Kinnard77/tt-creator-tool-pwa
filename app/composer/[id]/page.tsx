'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, explicarError } from '@/lib/supabase';
import {
  buscarMaquina, etapaDeCiclo, maquinasDeCiclo,
  SELLO_PRESENCIA, CICLO_CAMARA_OSCURA,
} from '@/lib/maquinas';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-48 bg-slate-800 flex items-center justify-center">
      <p className="text-slate-500">Cargando mapa...</p>
    </div>
  )
});

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

  // Position for editing
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [labyrinthosId, setLabyrinthosId] = useState<string | null>(null);
  const [ciclo, setCiclo] = useState(1);
  // La fórmula operacional: lo que convierte una pregunta en una máquina.
  const [maquina, setMaquina] = useState<string>('');
  const [emocion, setEmocion] = useState<string>('');
  const [accionExigida, setAccionExigida] = useState('');
  const [restriccion, setRestriccion] = useState('');
  const [feedback, setFeedback] = useState('');
  const [casi, setCasi] = useState('');
  const [exigePresencia, setExigePresencia] = useState(false);
  const [camaraOscura, setCamaraOscura] = useState(false);

  const [loading, setLoading] = useState(true);

  // Foto
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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
        setPosition(data.position || { lat: 0, lng: 0 });
        setLabyrinthosId(data.labyrinthos_id);
        // Load photoUrl from experience_config
        if (data.experience_config?.photoUrl) {
          setPhotoUrl(data.experience_config.photoUrl);
        }
        // Load ciclo
        setCiclo(data.ciclo ?? data.experience_config?.ciclo ?? 1);
        setMaquina(data.maquina || '');
        setEmocion(data.emocion || '');
        setAccionExigida(data.accion_exigida || '');
        setRestriccion(data.restriccion || '');
        setFeedback(data.feedback || '');
        setCasi(data.casi || '');
        setExigePresencia(data.exige_presencia === true);
        setCamaraOscura(data.camara_oscura === true);
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

  const maquinaElegida = buscarMaquina(maquina);
  const etapaActual = etapaDeCiclo(ciclo);
  const maquinasDisponibles = maquinasDeCiclo(ciclo);

  const handleSave = async () => {
    const experience_config = {
      ciclo, // Guardar el ciclo
      photoUrl, // Guardar la URL de la foto
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
        position,
        ciclo,
        maquina: maquina || null,
        emocion: emocion || null,
        accion_exigida: accionExigida || null,
        restriccion: restriccion || null,
        feedback: feedback || null,
        casi: casi || null,
        exige_presencia: exigePresencia,
        camara_oscura: camaraOscura,
        trigger_config: { type: 'geo_radius', radius: triggerRadius, orientation: requiresOrientation },
        experience_config
      })
      .eq('id', umbralId);

    if (error) {
      alert('Error: ' + explicarError(error));
    } else {
      alert('✓ UMBRAL ACTUALIZADO');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este nodo?')) return;
    
    const { error } = await supabase
      .from('umbrales')
      .delete()
      .eq('id', umbralId);

    if (error) {
      alert('Error al eliminar: ' + error.message);
      console.error(error);
    } else {
      // Navigate back instead of to atlas
      window.history.back();
    }
  };

  const updatePosition = (deltaLat: number, deltaLng: number) => {
    setPosition(prev => ({
      lat: prev.lat + deltaLat,
      lng: prev.lng + deltaLng
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${umbralId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('umbrales-fotos')
      .upload(fileName, file);

    if (error) {
      alert('Error subiendo foto: ' + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('umbrales-fotos')
        .getPublicUrl(fileName);
      
      setPhotoUrl(publicUrl);
      alert('✓ Foto subida');
    }
    
    setUploading(false);
  };

  const handleDeletePhoto = async () => {
    if (!photoUrl) return;
    if (!confirm('¿Eliminar esta foto?')) return;
    
    // Extraer nombre del archivo de la URL
    const fileName = photoUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from('umbrales-fotos').remove([fileName]);
    }
    setPhotoUrl('');
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
        {labyrinthosId ? (
          <Link href={`/walker/${labyrinthosId}`} className="text-violet-400 hover:underline text-sm">← Volver</Link>
        ) : (
          <Link href="/atlas" className="text-violet-400 hover:underline text-sm">← Volver</Link>
        )}
        <div className="text-center">
          <h1 className="text-violet-400 font-bold text-sm">✨ Composer</h1>
          <p className="text-[10px] text-slate-500 font-mono">{umbralId}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="text-xs bg-red-600 px-2 py-1 rounded">🗑️ Eliminar</button>
          <button onClick={handleSave} className="text-xs bg-violet-600 px-3 py-1 rounded">Guardar</button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 📷 Foto */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-2">📷 Foto de referencia</p>
          
          {photoUrl ? (
            <div className="relative">
              <img 
                src={photoUrl} 
                alt="Foto del nodo" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={handleDeletePhoto}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs"
              >
                🗑️ Eliminar
              </button>
            </div>
          ) : (
            <label className="h-24 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm cursor-pointer hover:bg-slate-700 transition-colors block">
              <span>📷 Tocar para agregar foto</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                disabled={uploading}
                className="hidden" 
              />
            </label>
          )}
          
          {uploading && (
            <p className="text-xs text-violet-400 mt-2">Subiendo...</p>
          )}
        </div>

        {/* 📦 Data Collection Box */}
        <Link href={`/composer/${umbralId}/data`} className="block">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 hover:bg-slate-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <p className="text-violet-400 font-bold text-sm">Data Collection Box</p>
              </div>
              <span className="text-slate-500">→</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Ingresa los 15 tipos de datos</p>
          </div>
        </Link>

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

        {/* 🌀 CICLO - Grupo de nodos.
            Estos botones no hacian nada: su onClick estaba vacio con un
            comentario pendiente, asi que el ciclo elegido en el Composer se
            perdia siempre. Ahora escriben en la columna ciclo. */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-violet-400 font-bold text-xs uppercase mb-3">🌀 Ciclo</h2>
          <p className="text-[10px] text-slate-500 mb-2">A qué ciclo pertenece este umbral (4 umbrales = 1 metapuzzle)</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(c => (
              <button
                key={c}
                onClick={() => setCiclo(c)}
                className={`px-3 py-1 rounded text-xs ${
                  ciclo === c
                    ? (c === 1 ? 'bg-violet-600' : c === 2 ? 'bg-blue-600'
                      : c === 3 ? 'bg-green-600' : c === 4 ? 'bg-orange-600' : 'bg-red-600')
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                🌀 {c}
              </button>
            ))}
          </div>
        </div>

        {/* ⚙️ LA MÁQUINA.
            Solo se ofrecen las que corresponden a la etapa de este ciclo: si
            hay que generar Urgencia, para eso está la Cuenta Regresiva, y no
            debe generarse Urgencia en otra etapa del arco. */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-violet-400 font-bold text-xs uppercase mb-1">⚙️ Máquina</h2>
          {etapaActual ? (
            <p className="text-[10px] text-slate-500 mb-3">
              Ciclo {ciclo} · etapa <strong className="text-slate-300">{etapaActual.romano} — {etapaActual.nombre}</strong>.
              Emoción de esta etapa: <strong className="text-slate-300">{etapaActual.emocion}</strong>.
            </p>
          ) : (
            <p className="text-[10px] text-amber-400 mb-3">
              El ciclo {ciclo} no corresponde a ninguna etapa del arco.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {maquinasDisponibles.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMaquina(m.id);
                  setEmocion(m.emocion);
                }}
                className={`text-left px-2 py-2 rounded text-xs ${
                  maquina === m.id ? 'bg-violet-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{m.icono}</span>
                {m.nombre}
                {m.requiereGrupo && <span className="ml-1 text-[9px] opacity-70">👥</span>}
              </button>
            ))}
          </div>

          {maquinasDisponibles.length === 0 && (
            <p className="text-[11px] text-slate-500">
              No hay máquinas para esta etapa. Cambia el ciclo.
            </p>
          )}

          {maquinaElegida && (
            <div className="mt-3 bg-slate-950 border border-violet-900/50 rounded-lg p-3">
              <p className="text-[11px] text-slate-300">{maquinaElegida.mecanismo}</p>
              <p className="text-[11px] text-amber-300 mt-2">
                <strong>Regla:</strong> {maquinaElegida.regla}
              </p>
              <p className="text-[11px] text-violet-300 mt-2">
                Produce <strong>{maquinaElegida.emocion}</strong>. La emoción no se
                elige: es consecuencia de la máquina.
              </p>
              {maquinaElegida.requiereGrupo && (
                <p className="text-[10px] text-cyan-300 mt-2">
                  👥 Necesita más de un jugador. UMBRA se juega en familias.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🔭 SELLO DE PRESENCIA: el pilar Anti-IA, obligatorio */}
        <div className={`border rounded-xl p-3 ${
          exigePresencia
            ? 'bg-emerald-950/30 border-emerald-800'
            : 'bg-amber-950/30 border-amber-800'
        }`}>
          <h2 className="text-xs font-bold uppercase mb-1 text-slate-200">
            🔭 {SELLO_PRESENCIA.titulo}
          </h2>
          <p className="text-[11px] text-slate-300 mb-2">{SELLO_PRESENCIA.pregunta}</p>
          <label className="flex items-start gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={exigePresencia}
              onChange={(e) => setExigePresencia(e.target.checked)}
              className="accent-emerald-500 mt-0.5"
            />
            <span>
              Confirmo que <strong>no</strong> se puede resolver desde casa.
            </span>
          </label>
          <p className="text-[10px] text-amber-300 mt-2">{SELLO_PRESENCIA.regla}</p>
        </div>

        {/* 🌑 CÁMARA OSCURA: única, al final del ciclo 5 */}
        {ciclo === CICLO_CAMARA_OSCURA && (
          <div className="bg-slate-900 border border-red-900/60 rounded-xl p-3">
            <h2 className="text-red-400 font-bold text-xs uppercase mb-1">🌑 Cámara Oscura</h2>
            <p className="text-[10px] text-slate-500 mb-2">
              Única en todo el Labyrinthos, al final del ciclo {CICLO_CAMARA_OSCURA},
              justo antes del Orgullo. La muerte del yo.
            </p>
            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={camaraOscura}
                onChange={(e) => setCamaraOscura(e.target.checked)}
                className="accent-red-500"
              />
              Este umbral es la Cámara Oscura
            </label>
          </div>
        )}

        {/* 🔧 LA FÓRMULA OPERACIONAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-violet-400 font-bold text-xs uppercase mb-1">🔧 La máquina, por dentro</h2>
          <p className="text-[10px] text-slate-500 mb-3">
            Emoción + acción exigida + información incompleta + restricción + feedback.
          </p>

          <label className="block text-[11px] text-slate-400 mb-1">
            Acción exigida — ¿qué tiene que <em>hacer</em>, no responder?
          </label>
          <textarea
            value={accionExigida}
            onChange={(e) => setAccionExigida(e.target.value)}
            placeholder="Contar, medir, esperar, callar, volver de noche…"
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-3"
          />

          <label className="block text-[11px] text-slate-400 mb-1">
            Restricción — ¿qué le da peso?
          </label>
          <textarea
            value={restriccion}
            onChange={(e) => setRestriccion(e.target.value)}
            placeholder="Tiempo, silencio, una prohibición, el riesgo de perder algo…"
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-3"
          />

          <label className="block text-[11px] text-slate-400 mb-1">
            Casi — ¿qué pista lo acerca pero todavía no cierra?
          </label>
          <textarea
            value={casi}
            onChange={(e) => setCasi(e.target.value)}
            placeholder="El motor dopaminérgico: proximidad sin entrega total."
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-3"
          />

          <label className="block text-[11px] text-slate-400 mb-1">
            Feedback — ¿qué responde el sistema?
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Revelación, desbloqueo, recompensa o consecuencia narrativa."
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* 📍 Ubicación del nodo */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <h2 className="text-emerald-400 font-bold text-xs uppercase mb-3">📍 Ubicación del nodo</h2>
          
          {/* Mapa */}
          <div className="h-48 rounded-lg overflow-hidden mb-3">
            <MapComponent 
              center={position} 
              umbrales={[]}
              height="100%"
            />
          </div>
          
          {/* Current coords */}
          <div className="text-center mb-3">
            <p className="text-xs text-slate-500">Coordenadas actuales</p>
            <p className="font-mono text-sm">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
          </div>

          {/* Fine position controls */}
          <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
            <div></div>
            <button onClick={() => updatePosition(0.00001, 0)} className="bg-slate-700 px-2 py-1 rounded text-xs">▲</button>
            <div></div>
            <button onClick={() => updatePosition(0, -0.00001)} className="bg-slate-700 px-2 py-1 rounded text-xs">◄</button>
            <button onClick={() => updatePosition(0, 0.00001)} className="bg-slate-700 px-2 py-1 rounded text-xs">►</button>
            <div></div>
            <button onClick={() => updatePosition(-0.00001, 0)} className="bg-slate-700 px-2 py-1 rounded text-xs">▼</button>
            <div></div>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2">+1m</p>
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