'use client';

import Link from 'next/link';

const tools = [
  {
    id: 'umbra',
    name: 'UMBRA',
    icon: '🌑',
    description: 'Creator Tool para experiencias in situ',
    href: '/atlas',
    color: 'from-violet-600 to-purple-600',
    status: 'active'
  },
  {
    id: 'prompts',
    name: 'Prompts',
    icon: '🍌',
    description: 'Generador de prompts para Nano Banana 2',
    href: '/prompts',
    color: 'from-yellow-600 to-amber-600',
    status: 'active'
  },
  {
    id: 'puzzles',
    name: 'Puzzles',
    icon: '🧩',
    description: 'Diseño de enigmas y retos',
    href: '/puzzles',
    color: 'from-emerald-600 to-teal-600',
    status: 'active'
  },
  {
    id: 'narrativas',
    name: 'Narrativas',
    icon: '📖',
    description: 'Creación de historias y textos',
    href: '/narrativas',
    color: 'from-amber-600 to-orange-600',
    status: 'active'
  },
  {
    id: 'personajes',
    name: 'Personajes',
    icon: '🎭',
    description: 'Gestión de personajes y roles',
    href: '/personajes',
    color: 'from-rose-600 to-pink-600',
    status: 'active'
  }
];

export default function Hub() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-400 mb-2">
          Time Travellers
        </h1>
        <p className="text-slate-500">Creator Tool</p>
      </header>

      {/* Grid de herramientas */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm text-slate-400 uppercase tracking-widest mb-6 text-center">
          Selecciona una herramienta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`
                group relative overflow-hidden rounded-2xl p-8 
                bg-slate-900/50 border border-slate-800
                hover:border-slate-700 transition-all
                ${tool.status === 'soon' ? 'opacity-60' : ''}
              `}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`text-5xl`}>
                  {tool.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    {tool.status === 'soon' && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded text-slate-400">
                        PRÓXIMO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{tool.description}</p>
                </div>

                {/* Arrow */}
                <div className="text-violet-400 text-2xl group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-400">
          ← Volver a la portada
        </Link>
      </footer>
    </div>
  );
}