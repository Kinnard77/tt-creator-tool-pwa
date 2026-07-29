'use client';

import { EMOCIONES, buscarEmocion, buscarMaquina } from '@/lib/maquinas';

interface UmbralCurva {
  id: string;
  node_number?: number | null;
  ciclo?: number | null;
  emocion?: string | null;
  maquina?: string | null;
  pacing_value?: number | null;
}

const COLORES_CICLO = ['#8b5cf6', '#3b82f6', '#22c55e', '#f97316', '#ef4444'];

/**
 * Dibuja el recorrido emocional del Labyrinthos: la intensidad de cada
 * umbral en el orden en que el jugador los vive, con su emoción y su ciclo.
 *
 * Para qué sirve: de un vistazo se ve si la experiencia va de Misterio a
 * Transformación o si son seis umbrales seguidos de Urgencia. La curva es
 * el diagnóstico que el texto de las Emociones Jugables pide poder hacer.
 */
export default function CurvaEmocional({ umbrales }: { umbrales: UmbralCurva[] }) {
  const orden = [...umbrales].sort(
    (a, b) => (a.node_number ?? 0) - (b.node_number ?? 0)
  );

  if (orden.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Sin umbrales todavía: no hay curva que dibujar.
      </p>
    );
  }

  const ancho = Math.max(orden.length * 56, 240);
  const alto = 120;
  const margenInf = 26;
  const utilAlto = alto - margenInf - 8;

  const puntos = orden.map((u, i) => {
    const intensidad = u.pacing_value ?? 5;
    const x = (i + 0.5) * (ancho / orden.length);
    const y = 8 + utilAlto * (1 - (intensidad - 1) / 9);
    return { x, y, u, intensidad };
  });

  const linea = puntos.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Qué emociones del catálogo no aparecen en ningún umbral.
  const presentes = new Set(orden.map((u) => u.emocion).filter(Boolean));
  const ausentes = EMOCIONES.filter((e) => !presentes.has(e.id));

  return (
    <div>
      <div className="overflow-x-auto">
        <svg width={ancho} height={alto} className="block">
          {/* Guías de intensidad */}
          {[1, 5, 10].map((v) => {
            const y = 8 + utilAlto * (1 - (v - 1) / 9);
            return (
              <g key={v}>
                <line x1={0} y1={y} x2={ancho} y2={y} stroke="#1e293b" strokeWidth={1} />
                <text x={2} y={y - 3} fontSize={8} fill="#475569">{v}</text>
              </g>
            );
          })}

          <polyline
            points={linea}
            fill="none"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {puntos.map((p, i) => {
            const ciclo = p.u.ciclo ?? 1;
            const color = COLORES_CICLO[(ciclo - 1) % COLORES_CICLO.length];
            const e = buscarEmocion(p.u.emocion);
            const m = buscarMaquina(p.u.maquina);
            return (
              <g key={p.u.id}>
                <circle cx={p.x} cy={p.y} r={6} fill={color} stroke="#0f172a" strokeWidth={2} />
                <title>
                  {`Umbral ${p.u.node_number ?? i + 1} · ciclo ${ciclo}\n` +
                    `${e ? e.nombre : 'sin emoción'}${m ? ` · ${m.nombre}` : ''}\n` +
                    `intensidad ${p.intensidad}/10`}
                </title>
                <text
                  x={p.x}
                  y={alto - 14}
                  fontSize={9}
                  fill="#94a3b8"
                  textAnchor="middle"
                >
                  {p.u.node_number ?? i + 1}
                </text>
                <text
                  x={p.x}
                  y={alto - 3}
                  fontSize={8}
                  fill={e ? '#cbd5e1' : '#64748b'}
                  textAnchor="middle"
                >
                  {e ? e.nombre.slice(0, 6) : '—'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {ausentes.length > 0 && (
        <p className="text-[10px] text-slate-500 mt-2">
          Emociones sin usar: {ausentes.map((e) => e.nombre).join(', ')}.
        </p>
      )}
    </div>
  );
}
