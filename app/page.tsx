'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Portada - Full screen branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Logo area */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-6xl shadow-2xl shadow-violet-500/30">
            ⏱️
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 tracking-wider mb-4">
          Time Travellers
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-2">
          Creator Tool
        </p>
        
        <p className="text-sm text-violet-400/60 italic font-mono mb-12">
          "Walking is Writing"
        </p>

        {/* Enter button */}
        <Link 
          href="/hub"
          className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-lg font-bold shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-purple-500 transition-all"
        >
          ENTRAR →
        </Link>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-slate-800">
        <p className="text-xs text-slate-600">v1.0 · IF&IF Studio</p>
      </footer>
    </div>
  );
}