'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Los 15 tipos de datos con iconos
const DATA_TYPES = [
  { id: 'physical', icon: '📍', label: 'Físicos', color: 'emerald' },
  { id: 'historical', icon: '📚', label: 'Históricos', color: 'blue' },
  { id: 'characters', icon: '👤', label: 'Personajes', color: 'indigo' },
  { id: 'esoteric', icon: '🔮', label: 'Esotéricos', color: 'purple' },
  { id: 'sacred_geometry', icon: '⚙️', label: 'Geom. Sagrada', color: 'cyan' },
  { id: 'numerology', icon: '🔢', label: 'Numerología', color: 'amber' },
  { id: 'symbolism', icon: '✨', label: 'Simbolismo', color: 'yellow' },
  { id: 'astronomy', icon: '🌅', label: 'Astronomía/Luz', color: 'orange' },
  { id: 'acoustics', icon: '🎵', label: 'Acústica', color: 'pink' },
  { id: 'materials', icon: '🗿', label: 'Materiales', color: 'stone' },
  { id: 'inscriptions', icon: '📖', label: 'Textos', color: 'red' },
  { id: 'art', icon: '🎨', label: 'Arte/Iconografía', color: 'rose' },
  { id: 'architecture', icon: '🏛️', label: 'Arquitectura', color: 'slate' },
  { id: 'legends', icon: '👻', label: 'Leyendas/Mitos', color: 'fuchsia' },
  { id: 'fiction', icon: '💭', label: 'Ficción/Teorías', color: 'violet' },
];

// Mapeo de tipos a campos específicos
const TYPE_FIELDS: Record<string, { key: string; label: string; type: string; placeholder: string }[]> = {
  physical: [
    { key: 'gps_lat', label: 'Latitud', type: 'number', placeholder: '48.8530' },
    { key: 'gps_lng', label: 'Longitud', type: 'number', placeholder: '2.3499' },
    { key: 'measure', label: 'Medida', type: 'text', placeholder: 'Ej: 7 arcos' },
    { key: 'count', label: 'Conteo', type: 'text', placeholder: 'Ej: 12 columnas' },
    { key: 'state', label: 'Estado', type: 'select', placeholder: 'intacto/dañado/restaurado' },
    { key: 'accessibility', label: 'Accesibilidad', type: 'select', placeholder: 'público/restringido' },
  ],
  historical: [
    { key: 'date', label: 'Fecha/Período', type: 'text', placeholder: 'Ej: 1250' },
    { key: 'event_type', label: 'Tipo evento', type: 'text', placeholder: 'construcción/batalla/consagración' },
    { key: 'certainty', label: 'Certeza', type: 'select', placeholder: 'documentado/estimado/leyenda' },
    { key: 'source', label: 'Fuente', type: 'text', placeholder: 'Libro/archivo/web' },
  ],
  characters: [
    { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre completo' },
    { key: 'role', label: 'Rol', type: 'text', placeholder: 'rey/obispo/cantero/mecenas' },
    { key: 'dates', label: 'Fechas', type: 'text', placeholder: '1194-1250' },
    { key: 'importance', label: 'Importancia', type: 'select', placeholder: 'alta/media/baja' },
  ],
  esoteric: [
    { key: 'tradition', label: 'Tradición', type: 'text', placeholder: 'masónico/templario/hermético' },
    { key: 'secret_level', label: 'Nivel secreto', type: 'select', placeholder: 'público/iniciados/maestros' },
    { key: 'interpretation', label: 'Interpretación', type: 'select', placeholder: 'literal/simbólica/codificada' },
  ],
  sacred_geometry: [
    { key: 'shape', label: 'Forma', type: 'text', placeholder: 'Vesica Piscis/Phi/Pentagrama' },
    { key: 'proportion', label: 'Proporción', type: 'text', placeholder: '1:1.618' },
    { key: 'location', label: 'Ubicación', type: 'text', placeholder: '¿dónde se manifiesta?' },
  ],
  numerology: [
    { key: 'number', label: 'Número', type: 'text', placeholder: '3, 7, 12, 33...' },
    { key: 'traditions', label: 'Tradiciones', type: 'text', placeholder: 'Cristiana/Masónica/Cabalística' },
  ],
  symbolism: [
    { key: 'symbol', label: 'Símbolo', type: 'text', placeholder: 'Nombre del símbolo' },
    { key: 'tradition', label: 'Tradición', type: 'text', placeholder: 'cristiana/pagana/masónica' },
    { key: 'meaning', label: 'Significado', type: 'text', placeholder: 'Qué representa' },
  ],
  astronomy: [
    { key: 'phenomenon', label: 'Fenómeno', type: 'text', placeholder: 'solsticio/equinoccio/luna llena' },
    { key: 'date_time', label: 'Fecha/Hora', type: 'text', placeholder: '21 junio, 12:00' },
    { key: 'point', label: 'Punto de incidencia', type: 'text', placeholder: 'dónde cae la luz' },
    { key: 'verifiable', label: 'Verificable', type: 'select', placeholder: 'sí/no' },
  ],
  acoustics: [
    { key: 'type', label: 'Tipo', type: 'text', placeholder: 'eco/resonancia/cámara de susurros' },
    { key: 'location', label: 'Ubicación GPS', type: 'text', placeholder: 'punto 1, punto 2 si es eco' },
    { key: 'frequency', label: 'Frecuencia (Hz)', type: 'text', placeholder: 'Ej: 440Hz' },
    { key: 'effect', label: 'Efecto', type: 'text', placeholder: 'qué se escucha' },
  ],
  materials: [
    { key: 'material', label: 'Material', type: 'text', placeholder: 'caliza/ágata/oro/plomo' },
    { key: 'origin', label: 'Origen', type: 'text', placeholder: 'cantera/región' },
    { key: 'alchemy_props', label: 'Prop. alquímicas', type: 'text', placeholder: 'propiedades simbólicas' },
  ],
  inscriptions: [
    { key: 'language', label: 'Idioma', type: 'text', placeholder: 'latín/griego/hebreo' },
    { key: 'original_text', label: 'Texto original', type: 'text', placeholder: 'El texto tal cual' },
    { key: 'translation', label: 'Traducción', type: 'text', placeholder: 'Traducción al español' },
    { key: 'context', label: 'Contexto', type: 'text', placeholder: 'quién/cuándo/por qué' },
  ],
  art: [
    { key: 'work_type', label: 'Tipo obra', type: 'text', placeholder: 'pintura/escultura/vitral' },
    { key: 'theme', label: 'Tema', type: 'text', placeholder: 'religioso/mitológico/simbólico' },
    { key: 'artist', label: 'Artista', type: 'text', placeholder: 'si se conoce' },
    { key: 'hidden_elements', label: 'Elementos ocultos', type: 'text', placeholder: 'qué hay oculto' },
  ],
  architecture: [
    { key: 'element', label: 'Elemento', type: 'text', placeholder: 'arbotante/bóveda/clave de arco' },
    { key: 'function', label: 'Función técnica', type: 'text', placeholder: 'qué hace estructuralmente' },
    { key: 'meaning', label: 'Significado filosófico', type: 'text', placeholder: 'interpretación' },
  ],
  legends: [
    { key: 'type', label: 'Tipo', type: 'text', placeholder: 'aparición/milagro/maldición/tesoro' },
    { key: 'origin', label: 'Origen', type: 'text', placeholder: 'popular/documentado/reciente' },
    { key: 'variants', label: 'Variantes', type: 'text', placeholder: 'versiones diferentes' },
    { key: 'validation', label: 'Validación', type: 'select', placeholder: 'verificable/folklore' },
  ],
  fiction: [
    { key: 'fiction_type', label: 'Tipo', type: 'text', placeholder: 'narrativa/conspiración/personaje' },
    { key: 'real_base', label: 'Base real', type: 'text', placeholder: 'en qué datos se basa' },
    { key: 'creative_freedom', label: 'Libertad creativa', type: 'select', placeholder: '100% ficción/mezcla' },
  ],
};

export default function DataCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const umbralId = params.id as string;

  // Obtener cathedral_id del umbral
  const [cathedralId, setCathedralId] = useState<string | null>(null);
  
  // Estado de la lista de entradas
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Cargar datos
  useEffect(() => {
    async function fetchData() {
      // Primero obtener el umbral para saber el cathedral_id
      const { data: umbral } = await supabase
        .from('umbrales')
        .select('cathedral_id')
        .eq('id', umbralId)
        .single();

      if (umbral) {
        setCathedralId(umbral.cathedral_id);
        
        // Cargar entradas existentes para este nodo
        const { data: entriesData } = await supabase
          .from('data_collection_entries')
          .select('*')
          .eq('umbral_id', umbralId)
          .order('created_at', { ascending: false });

        if (entriesData) {
          setEntries(entriesData);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [umbralId]);

  const handleSave = async () => {
    if (!selectedType || !title) {
      alert('Selecciona un tipo y escribe un título');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('data_collection_entries')
      .insert({
        cathedral_id: cathedralId,
        umbral_id: umbralId,
        type: selectedType,
        title,
        content,
        type_specific: formData,
        status: 'draft',
      });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('✓ DATO GUARDADO');
      // Recargar
      const { data } = await supabase
        .from('data_collection_entries')
        .select('*')
        .eq('umbral_id', umbralId)
        .order('created_at', { ascending: false });
      if (data) setEntries(data);
      
      // Limpiar formulario
      setSelectedType(null);
      setTitle('');
      setContent('');
      setFormData({});
    }
    setSaving(false);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('¿Eliminar este dato?')) return;
    
    await supabase.from('data_collection_entries').delete().eq('id', entryId);
    setEntries(entries.filter(e => e.id !== entryId));
  };

  const getTypeIcon = (type: string) => DATA_TYPES.find(t => t.id === type)?.icon || '📦';
  const getTypeLabel = (type: string) => DATA_TYPES.find(t => t.id === type)?.label || type;

  // Si hay un tipo seleccionado, mostrar el formulario
  if (selectedType) {
    const fields = TYPE_FIELDS[selectedType] || [];

    return (
      <div className="min-h-screen bg-black text-white pb-8">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSelectedType(null)} className="text-violet-400 hover:underline text-sm">← Volver</button>
          <h1 className="text-violet-400 font-bold text-sm">{getTypeIcon(selectedType)} {getTypeLabel(selectedType)}</h1>
          <div className="w-16"></div>
        </header>

        <div className="p-4 space-y-4">
          {/* Título */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-2">📝 Título del dato</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Ej: ${getTypeLabel(selectedType)} del pórtico...`}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Contenido principal */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-2">📄 Descripción / Notas</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descripción detallada..."
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm h-24"
            />
          </div>

          {/* Campos específicos del tipo */}
          {fields.map((field) => (
            <div key={field.key} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-2">{field.label}</p>
              {field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {field.placeholder.split('/').map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold disabled:opacity-50"
          >
            {saving ? 'Guardando...' : '✓ GUARDAR DATO'}
          </button>
        </div>
      </div>
    );
  }

  // Vista principal: lista de tipos + entradas existentes
  return (
    <div className="min-h-screen bg-black text-white pb-8">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between sticky top-0 z-20">
        <Link href={`/composer/${umbralId}`} className="text-violet-400 hover:underline text-sm">← Volver</Link>
        <h1 className="text-violet-400 font-bold text-sm">📦 Data Collection</h1>
        <div className="w-16"></div>
      </header>

      <div className="p-4 space-y-4">
        {/* Lista de entradas existentes */}
        {entries.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Datos guardados ({entries.length})</p>
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{getTypeIcon(entry.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{entry.title}</p>
                      <p className="text-xs text-slate-500">{getTypeLabel(entry.type)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 p-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Los 15 tipos de datos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Seleccionar tipo de dato</p>
          <div className="grid grid-cols-3 gap-2">
            {DATA_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-[10px] text-center text-slate-300">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}