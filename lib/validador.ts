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

import {
  EMOCIONES, ETAPAS, buscarEmocion, buscarMaquina, etapaDeCiclo,
  CICLO_CAMARA_OSCURA, type IdEmocion,
} from './maquinas';

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
  exige_presencia?: boolean | null;
  camara_oscura?: boolean | null;
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

  // --- El arco: cada ciclo pertenece a una etapa ----------------------
  // Cinco ciclos cubren las etapas II a VI, uno por etapa. Si una máquina
  // no corresponde a la etapa de su ciclo, el arco se desordena.
  for (const u of umbrales) {
    const c = u.ciclo ?? u.experience_config?.ciclo ?? 1;
    const etapa = etapaDeCiclo(c);
    const m = buscarMaquina(u.maquina);
    if (etapa && m && m.etapa !== etapa.numero) {
      const suya = ETAPAS.find((e) => e.numero === m.etapa);
      h.push({
        gravedad: 'error',
        titulo: `El umbral ${u.node_number ?? '?'} rompe el orden del arco`,
        detalle:
          `Está en el ciclo ${c}, que corresponde a la etapa ${etapa.romano} (${etapa.nombre}), ` +
          `pero usa ${m.nombre}, que pertenece a la etapa ${suya?.romano} (${suya?.nombre}).`,
        donde: `Umbral ${u.node_number ?? '?'}`,
      });
    }
    if (!etapa && c >= 1 && c <= 5) {
      // No debería ocurrir, pero avisa si el catálogo y los datos se desalinean.
      h.push({
        gravedad: 'aviso',
        titulo: `El ciclo ${c} no tiene etapa asignada`,
        detalle: 'Revisa la correspondencia entre ciclos y etapas del arco.',
      });
    }
  }

  // --- La Complicidad exige grupo ------------------------------------
  // El ciclo 3 es la etapa de Los Aliados, y esa etapa no ocurre sin una
  // máquina que enfrente a los jugadores entre sí.
  const cicloAliados = ETAPAS.find((e) => e.emocion === 'complicidad')?.ciclo;
  if (cicloAliados) {
    const delCiclo = umbrales.filter(
      (u) => (u.ciclo ?? u.experience_config?.ciclo ?? 1) === cicloAliados
    );
    if (delCiclo.length > 0) {
      const hayGrupo = delCiclo.some((u) => buscarMaquina(u.maquina)?.requiereGrupo);
      if (!hayGrupo) {
        h.push({
          gravedad: 'error',
          titulo: `El ciclo ${cicloAliados} no produce Complicidad`,
          detalle:
            'Ningún umbral usa una máquina de grupo. La Complicidad no se narra: ' +
            'se produce obligando a los jugadores a depender entre sí. Usa ' +
            'Información Oculta o Prueba de Confianza.',
          donde: `Ciclo ${cicloAliados}`,
        });
      }
    }
  }

  // --- La Cámara Oscura es única y va al final ------------------------
  const conCamara = umbrales.filter((u) => u.camara_oscura);
  if (conCamara.length > 1) {
    h.push({
      gravedad: 'error',
      titulo: 'Hay más de una Cámara Oscura',
      detalle:
        'La Cámara Oscura es única: es la muerte del yo, no un cierre de ciclo. ' +
        `Debe estar solo al final del ciclo ${CICLO_CAMARA_OSCURA}.`,
    });
  }
  for (const u of conCamara) {
    const c = u.ciclo ?? u.experience_config?.ciclo ?? 1;
    if (c !== CICLO_CAMARA_OSCURA) {
      h.push({
        gravedad: 'error',
        titulo: `Cámara Oscura fuera de sitio (ciclo ${c})`,
        detalle: `Va al final del ciclo ${CICLO_CAMARA_OSCURA}, justo antes del Orgullo.`,
        donde: `Umbral ${u.node_number ?? '?'}`,
      });
    }
  }

  // --- El sello de presencia física ----------------------------------
  const sinSello = umbrales.filter((u) => u.exige_presencia !== true);
  if (sinSello.length > 0) {
    h.push({
      gravedad: 'aviso',
      titulo: `${sinSello.length} umbral(es) sin sello de presencia`,
      detalle:
        'Sin confirmar que no se resuelven desde casa buscando en Google. ' +
        'Es el pilar Anti-IA por diseño: el lugar real debe ser la interfaz.',
    });
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

    // El Orgullo vive en el cierre (etapa VII), no en los ciclos. Lo que se
    // comprueba es que el cierre exista, no que haya un ciclo de Orgullo.
    const hayCierre = umbrales.some(
      (u) => u.maquina === 'reconocimiento_grupo' || u.emocion === 'orgullo'
    );
    if (emociones.includes('deseo') && !hayCierre) {
      h.push({
        gravedad: 'aviso',
        titulo: 'El cierre no está diseñado',
        detalle:
          'Hay Deseo prometido pero ningún Reconocimiento del Grupo que lo ' +
          'cobre. Riesgo declarado del Deseo: prometer algo que el sistema no ' +
          'entrega. El cierre son las etapas VII y VIII, fuera de los cinco ciclos.',
      });
    }

  }
  // Nota: no se reclama Misterio ni Transformación por umbral. El Misterio
  // (etapa I) se consigue al ofrecer la experiencia, fuera de la herramienta,
  // y la Transformación (etapa VIII) pertenece al cierre, no a los ciclos.

  const ordenados = [...umbrales].sort(
    (a, b) => (a.node_number ?? 0) - (b.node_number ?? 0)
  );

  // --- Desgaste: la misma emoción abarcando varios ciclos -------------
  // Dentro de un ciclo la emoción se repite POR DISEÑO, porque el ciclo es
  // una etapa. Lo que sí desgasta es que dos ciclos consecutivos persigan la
  // misma emoción: eso significa que el arco se ha estancado en una etapa.
  const emocionPorCiclo = new Map<number, Set<string>>();
  for (const u of umbrales) {
    const c = u.ciclo ?? u.experience_config?.ciclo ?? 1;
    if (!emocionPorCiclo.has(c)) emocionPorCiclo.set(c, new Set());
    if (u.emocion) emocionPorCiclo.get(c)!.add(u.emocion);
  }
  const ciclosConEmocion = Array.from(emocionPorCiclo.entries())
    .sort((a, b) => a[0] - b[0])
    .filter(([, s]) => s.size === 1)
    .map(([c, s]) => ({ ciclo: c, emocion: Array.from(s)[0] }));

  for (let i = 1; i < ciclosConEmocion.length; i++) {
    const prev = ciclosConEmocion[i - 1];
    const act = ciclosConEmocion[i];
    if (prev.emocion === act.emocion && act.ciclo === prev.ciclo + 1) {
      const e = buscarEmocion(act.emocion);
      h.push({
        gravedad: 'aviso',
        titulo: `Los ciclos ${prev.ciclo} y ${act.ciclo} persiguen la misma emoción`,
        detalle: e
          ? `El arco se estanca en ${e.nombre}. Riesgo declarado: ${e.riesgo.toLowerCase()}.`
          : 'Dos ciclos consecutivos con la misma emoción estancan el arco.',
        donde: `Ciclos ${prev.ciclo}–${act.ciclo}`,
      });
    }
  }

  // --- Emociones mezcladas dentro de un mismo ciclo ------------------
  for (const [c, s] of Array.from(emocionPorCiclo.entries()).sort((a, b) => a[0] - b[0])) {
    if (s.size > 1) {
      const etapa = etapaDeCiclo(c);
      h.push({
        gravedad: 'aviso',
        titulo: `El ciclo ${c} mezcla emociones`,
        detalle:
          `Contiene ${Array.from(s).join(', ')}. Un ciclo es una etapa del arco` +
          (etapa ? `, y la del ciclo ${c} es ${etapa.emocion}.` : '.'),
        donde: `Ciclo ${c}`,
      });
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
