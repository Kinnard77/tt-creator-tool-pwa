/**
 * El validador de UMBRA.
 *
 * No inventa criterios: aplica los que ya están escritos en los documentos
 * de diseño — los riesgos declarados de cada emoción, las reglas de cada
 * máquina y las seis comprobaciones del Control de Calidad del Atlas.
 *
 * Su razón de ser: un metapuzzle con tres umbrales en vez de cuatro deja al
 * jugador atascado sin remedio, y nadie se enteraría hasta que alguien se
 * queje en la catedral. Este archivo existe para que eso salte antes.
 */

import { EMOCIONES, buscarEmocion, buscarMaquina, type IdEmocion } from './maquinas';

export type Gravedad = 'error' | 'aviso' | 'sugerencia';

export interface Hallazgo {
  gravedad: Gravedad;
  titulo: string;
  detalle: string;
  /** Ciclo o umbral al que se refiere, si aplica. */
  donde?: string;
}

export interface UmbralParaValidar {
  id: string;
  node_number?: number | null;
  ciclo?: number | null;
  emocion?: string | null;
  maquina?: string | null;
  accion_exigida?: string | null;
  restriccion?: string | null;
  feedback?: string | null;
  casi?: string | null;
  pacing_value?: number | null;
  experience_config?: any;
}

export interface LabyrinthosParaValidar {
  name?: string | null;
  tipo?: string | null;
  estado_inicial?: string | null;
  estado_final?: string | null;
}

const UMBRALES_POR_CICLO = 4;

export function validar(
  lab: LabyrinthosParaValidar,
  umbrales: UmbralParaValidar[]
): Hallazgo[] {
  const h: Hallazgo[] = [];

  if (umbrales.length === 0) {
    h.push({
      gravedad: 'aviso',
      titulo: 'Sin umbrales',
      detalle: 'Este Labyrinthos no tiene ningún umbral todavía.',
    });
    return h;
  }

  // --- El arco del jugador -------------------------------------------
  if (!lab.estado_inicial || !lab.estado_final) {
    h.push({
      gravedad: 'aviso',
      titulo: 'Falta el arco del jugador',
      detalle:
        'Sin estado inicial y final no hay transformación que medir. ' +
        'Define cómo llega el jugador y cómo quieres que salga.',
    });
  }

  // --- Ciclos completos ----------------------------------------------
  const porCiclo = new Map<number, UmbralParaValidar[]>();
  for (const u of umbrales) {
    const c = u.ciclo ?? u.experience_config?.ciclo ?? 1;
    if (!porCiclo.has(c)) porCiclo.set(c, []);
    porCiclo.get(c)!.push(u);
  }

  const ciclosOrdenados = Array.from(porCiclo.entries()).sort((a, b) => a[0] - b[0]);
  for (const [ciclo, lista] of ciclosOrdenados) {
    if (lista.length !== UMBRALES_POR_CICLO) {
      const falta = UMBRALES_POR_CICLO - lista.length;
      h.push({
        gravedad: 'error',
        titulo: `El ciclo ${ciclo} no forma un metapuzzle`,
        detalle:
          falta > 0
            ? `Tiene ${lista.length} umbrales y un metapuzzle exige ${UMBRALES_POR_CICLO}. Faltan ${falta}.`
            : `Tiene ${lista.length} umbrales, ${-falta} más de los ${UMBRALES_POR_CICLO} que exige un metapuzzle.`,
        donde: `Ciclo ${ciclo}`,
      });
    }
  }

  // --- El clímax -----------------------------------------------------
  const emociones = umbrales.map((u) => u.emocion).filter(Boolean) as IdEmocion[];

  if (emociones.length === 0) {
    h.push({
      gravedad: 'aviso',
      titulo: 'Ningún umbral declara su emoción',
      detalle:
        'Sin emociones asignadas no se puede dibujar la curva ni detectar ' +
        'desequilibrios. Es el primer campo que conviene rellenar.',
    });
  } else {
    if (!emociones.includes('asombro')) {
      h.push({
        gravedad: 'error',
        titulo: 'No hay clímax',
        detalle:
          'Ningún umbral persigue el Asombro, que es la revelación de la capa ' +
          'oculta del espacio real. Sin él la experiencia no culmina.',
      });
    }

    if (emociones.includes('deseo') && !emociones.includes('orgullo')) {
      h.push({
        gravedad: 'aviso',
        titulo: 'Deseo prometido sin recompensa',
        detalle:
          'Hay Deseo pero ningún Orgullo que lo cierre. Riesgo declarado del ' +
          'Deseo: prometer algo que el sistema no entrega.',
      });
    }

    if (!emociones.includes('transformacion')) {
      h.push({
        gravedad: 'sugerencia',
        titulo: 'Sin transformación final',
        detalle:
          'Ningún umbral persigue la Transformación. El criterio de éxito es ' +
          'que el lugar quede alterado en la memoria del jugador.',
      });
    }
  }

  // --- Desgaste: emociones repetidas seguidas ------------------------
  const ordenados = [...umbrales].sort(
    (a, b) => (a.node_number ?? 0) - (b.node_number ?? 0)
  );
  let racha = 1;
  for (let i = 1; i < ordenados.length; i++) {
    const previa = ordenados[i - 1].emocion;
    const actual = ordenados[i].emocion;
    if (actual && actual === previa) {
      racha++;
      if (racha === 3) {
        const e = buscarEmocion(actual);
        h.push({
          gravedad: 'aviso',
          titulo: `Tres umbrales seguidos de ${e?.nombre ?? actual}`,
          detalle: e
            ? `Riesgo declarado: ${e.riesgo.toLowerCase()}.`
            : 'Encadenar la misma emoción desgasta la curva.',
          donde: `Umbrales ${ordenados[i - 2].node_number}–${ordenados[i].node_number}`,
        });
      }
    } else {
      racha = 1;
    }
  }

  // --- La fórmula operacional, umbral por umbral ---------------------
  for (const u of ordenados) {
    const n = u.node_number ?? '?';
    const faltan: string[] = [];
    if (!u.accion_exigida) faltan.push('acción exigida');
    if (!u.restriccion) faltan.push('restricción');
    if (!u.feedback) faltan.push('feedback');

    if (faltan.length === 3) {
      h.push({
        gravedad: 'aviso',
        titulo: `El umbral ${n} es una pregunta, no una máquina`,
        detalle:
          'No declara acción exigida, restricción ni feedback. Sin esos tres ' +
          'componentes la fórmula operacional no se cumple.',
        donde: `Umbral ${n}`,
      });
    } else if (faltan.length > 0) {
      h.push({
        gravedad: 'sugerencia',
        titulo: `Al umbral ${n} le falta ${faltan.join(' y ')}`,
        detalle: 'La fórmula pide emoción, acción, información incompleta, restricción y feedback.',
        donde: `Umbral ${n}`,
      });
    }

    if (!u.casi) {
      h.push({
        gravedad: 'sugerencia',
        titulo: `El umbral ${n} no tiene "casi"`,
        detalle:
          'El casi es el motor dopaminérgico central: la pista que acerca sin cerrar.',
        donde: `Umbral ${n}`,
      });
    }

    // Reglas propias de la máquina elegida.
    const m = buscarMaquina(u.maquina);
    if (m) {
      if (m.id === 'cuenta_regresiva' && !u.restriccion) {
        h.push({
          gravedad: 'error',
          titulo: `Umbral ${n}: Cuenta Regresiva sin restricción`,
          detalle: m.regla,
          donde: `Umbral ${n}`,
        });
      }
      if (m.id === 'prohibicion' && !u.feedback) {
        h.push({
          gravedad: 'error',
          titulo: `Umbral ${n}: transgresión sin consecuencia`,
          detalle: m.regla,
          donde: `Umbral ${n}`,
        });
      }
      if (m.id === 'identidad_asignada' && !u.accion_exigida) {
        h.push({
          gravedad: 'error',
          titulo: `Umbral ${n}: rol sin acciones que lo validen`,
          detalle: m.regla,
          donde: `Umbral ${n}`,
        });
      }
    }
  }

  return h;
}

/** Resumen corto para mostrar en una cabecera. */
export function resumir(hallazgos: Hallazgo[]): string {
  const e = hallazgos.filter((x) => x.gravedad === 'error').length;
  const a = hallazgos.filter((x) => x.gravedad === 'aviso').length;
  const s = hallazgos.filter((x) => x.gravedad === 'sugerencia').length;
  if (e === 0 && a === 0 && s === 0) return 'Sin hallazgos';
  const partes: string[] = [];
  if (e) partes.push(`${e} ${e === 1 ? 'error' : 'errores'}`);
  if (a) partes.push(`${a} ${a === 1 ? 'aviso' : 'avisos'}`);
  if (s) partes.push(`${s} ${s === 1 ? 'sugerencia' : 'sugerencias'}`);
  return partes.join(' · ');
}

export { EMOCIONES };
