'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const EXAMPLE_PROMPTS = {
  'La Campana': 'Ancient stone bell tower at dawn, Mexican colonial church, massive bronze bell in focus, dramatic chiaroscuro lighting, mysterious fog at ground level, 17th century architectural details, photorealistic, cinematic composition, dark mystical atmosphere',
  'Los Nombres': 'Elderly stone wall with engraved names, forgotten heroes, dramatic side lighting, worn carved letters, historical monument, Mexico 1810, sepia tones, melancholic atmosphere, photorealistic, detailed stone textures',
  'El Pasaje Secreto': 'Narrow stone corridor, hidden passage, mysterious shadows, flickering candlelight, 18th century architecture, secret doorway revealed, dramatic lighting, dark corridor with ancient bricks, mysterious atmosphere',
  'La Cifra': 'Mathematical symbols carved in stone altar, golden ratio proportions, sacred geometry, mystical numbers, cathedral interior, divine light from stained glass, mathematical mysticism, photorealistic, intricate carvings',
  'El Susurro': 'Dark confession booth, mysterious shadowy figure whispering, dramatic backlight, Catholic church interior 1810, gothic architecture, suspenseful atmosphere, hidden secrets, photorealistic, cinematic',
  'La Salida': 'Ancient church exit, doorway to freedom, morning light breaking through, hope and liberation, Mexican independence theme, architectural detail, photorealistic, symbolic composition, historical drama',
  'Notre Dame': 'Medieval cathedral interior, massive ribbed vaults, stained glass windows with light rays, flying buttresses, Gothic architecture, mysterious atmosphere, dramatic vertical lines, photorealistic, cinematic',
  'Dolores Hidalgo': 'Mexican colonial church facade, bell tower, Mexican independence era 1810, historic building, dramatic sky, architectural details, photorealistic, historical monument',
  'Aenigma': 'Mysterious hooded figure, alchemist style, glowing eyes, dark robes with arcane symbols, mystical aura, photorealistic, cinematic lighting, fantasy portrait, dark background',
  'Generico': 'Gothic cathedral interior, mysterious atmosphere, dramatic lighting, photorealistic, cinematic, detailed architectural elements, moody, dark fantasy style',
};

export default function PromptsPage() {
  const [narrativas, setNarrativas] = useState<any[]>([]);
  const [umbrales, setUmbrales] = useState<any[]>([]);
  const [selectedNarrativa, setSelectedNarrativa] = useState('');
  const [selectedUmbral, setSelectedUmbral] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      const [narr, umbr] = await Promise.all([
        supabase.from('narrativas').select('id, title'),
        supabase.from('umbrales').select('id, cathedral_id')
      ]);
      if (narr.data) setNarrativas(narr.data);
      if (umbr.data) setUmbrales(umbr.data);
    }
    fetch();
  }, []);

  const generatePrompt = async () => {
    setLoading(true);
    
    // Construyo contexto
    const narrativa = narrativas.find(n => n.id === selectedNarrativa);
    
    // Genero prompt basado en contexto
    let generatedPrompt = EXAMPLE_PROMPTS['Generico'];
    
    // Custom prompts según selección
    if (selectedUmbral) {
      const umbKey = Object.keys(EXAMPLE_PROMPTS).find(k => 
        selectedUmbral.toLowerCase().includes(k.toLowerCase()) || 
        k.toLowerCase().includes(selectedUmbral.toLowerCase())
      );
      if (umbKey && EXAMPLE_PROMPTS[umbKey as keyof typeof EXAMPLE_PROMPTS]) {
        generatedPrompt = EXAMPLE_PROMPTS[umbKey as keyof typeof EXAMPLE_PROMPTS];
      }
    }
    
    if (narrativa?.title) {
      generatedPrompt += `, ${narrativa.title} theme`;
    }
    
    // Simulo "generación" (yo lo pienso)
    setPrompt(generatedPrompt);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <Link href="/hub" className="text-violet-400">← Hub</Link>
        <h1 className="font-bold">🍌 Generador de Prompts</h1>
        <div className="w-16"></div>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 space-y-4">
        <p className="text-sm text-slate-400 mb-4">
          Selecciona un elemento y genero el prompt para Nano Banana 2
        </p>

        <select
          value={selectedUmbral}
          onChange={(e) => setSelectedUmbral(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
        >
          <option value="">Selecciona un Umbral/Nodo...</option>
          <option value="La Campana">🔔 La Campana</option>
          <option value="Los Nombres">📝 Los Nombres</option>
          <option value="El Pasaje Secreto">🚪 El Pasaje Secreto</option>
          <option value="La Cifra">🔢 La Cifra</option>
          <option value="El Susurro">🤫 El Susurro</option>
          <option value="La Salida">🚪 La Salida</option>
        </select>

        <select
          value={selectedNarrativa}
          onChange={(e) => setSelectedNarrativa(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
        >
          <option value="">Narrativa (opcional)...</option>
          {narrativas.map(n => (
            <option key={n.id} value={n.id}>{n.title}</option>
          ))}
        </select>

        <button 
          onClick={generatePrompt}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 py-3 rounded-xl font-bold text-black"
        >
          {loading ? 'Generando...' : '🍌 Generar Prompt'}
        </button>

        {prompt && (
          <div className="mt-4">
            <label className="text-xs text-amber-400 block mb-2">Prompt generado:</label>
            <textarea
              value={prompt}
              readOnly
              className="w-full bg-slate-800 border border-amber-500/50 rounded px-3 py-2 h-32 text-sm"
            />
            <button 
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="mt-2 w-full bg-slate-700 py-2 rounded text-sm"
            >
              📋 Copiar al portapapeles
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500">
        <p className="mb-2">💡 <strong>Cómo funciona:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Seleccionás el nodo/umbral</li>
          <li>Yo genero el prompt basado en el contexto</li>
          <li>Lo copiá y lo metés en Nano Banana 2</li>
          <li>Subís la imagen generada a la app</li>
        </ol>
      </div>
    </div>
  );
}