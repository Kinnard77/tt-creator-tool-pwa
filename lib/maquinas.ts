/**
 * El Atlas de Máquinas y las Emociones Jugables.
 *
 * Esto no es material de ambientación: es la biblioteca de la que el autor
 * elige al diseñar cada umbral, y la fuente de los avisos del validador.
 *
 * Principio rector: "Una mecánica no es una ocurrencia. Es una máquina
 * emocional. No diseñes un puzzle, diseña una transformación."
 */

export type IdEmocion =
  | 'misterio' | 'deseo' | 'urgencia' | 'complicidad'
  | 'culpa' | 'asombro' | 'orgullo' | 'transformacion';

export interface Emocion {
  id: IdEmocion;
  nombre: string;
  /** Qué la produce. */
  mecanica: string;
  /** El riesgo de abusar de ella. Alimenta los avisos del validador. */
  riesgo: string;
  /** Etapa del Viaje del Héroe con la que se corresponde. */
  etapa: string;
  color: string;
}

export const EMOCIONES: Emocion[] = [
  {
    id: 'misterio', nombre: 'Misterio', etapa: 'La Llamada a la Aventura',
    mecanica: 'Promesa clara + información incompleta + pistas verificables',
    riesgo: 'Confundirlo con vaguedad',
    color: 'amber',
  },
  {
    id: 'deseo', nombre: 'Deseo', etapa: 'El Cruce del Umbral',
    mecanica: 'Un objeto o secreto que se vuelve relevante',
    riesgo: 'Prometer algo que el sistema no entrega',
    color: 'rose',
  },
  {
    id: 'urgencia', nombre: 'Urgencia', etapa: 'Pruebas y Aliados',
    mecanica: 'Tiempo limitado + pérdida visible + objetivo',
    riesgo: 'Agotar al jugador o volverlo mecánico',
    color: 'blue',
  },
  {
    id: 'complicidad', nombre: 'Complicidad', etapa: 'Encuentro con el Mentor',
    mecanica: 'Secreto compartido o rol común',
    riesgo: 'Excluir a parte del grupo',
    color: 'orange',
  },
  {
    id: 'culpa', nombre: 'Culpa', etapa: 'El Acercamiento a la Caverna',
    mecanica: 'Transgresión con consecuencia simbólica',
    riesgo: 'Manipular demasiado o incomodar sin propósito',
    color: 'purple',
  },
  {
    id: 'asombro', nombre: 'Asombro', etapa: 'La Revelación / El Clímax',
    mecanica: 'Revelar la capa oculta del espacio real',
    riesgo: 'Forzar interpretaciones débiles',
    color: 'red',
  },
  {
    id: 'orgullo', nombre: 'Orgullo', etapa: 'La Recompensa',
    mecanica: 'Logro difícil, visible y reconocido',
    riesgo: 'Recompensar acciones demasiado fáciles',
    color: 'cyan',
  },
  {
    id: 'transformacion', nombre: 'Transformación', etapa: 'El Regreso con el Elixir',
    mecanica: 'Cambio de identidad + prueba',
    riesgo: 'Quedarse en disfraz superficial',
    color: 'violet',
  },
];

export interface Maquina {
  id: string;
  numero: number;
  nombre: string;
  emocion: string;
  /** La emoción del catálogo con la que se corresponde, si aplica. */
  emocionId?: IdEmocion;
  mecanismo: string;
  /** La regla que no se puede incumplir sin que la máquina deje de funcionar. */
  regla: string;
  /** Si exige más de un jugador. UMBRA se juega en familias de 3-4. */
  requiereGrupo: boolean;
  icono: string;
}

export const MAQUINAS: Maquina[] = [
  {
    id: 'cuenta_regresiva', numero: 1, nombre: 'Cuenta Regresiva',
    emocion: 'Urgencia', emocionId: 'urgencia', icono: '⏱️',
    mecanismo: 'El jugador tiene pocos minutos antes de que cierre una ventana narrativa o física.',
    regla: 'La restricción temporal debe ser innegociable.',
    requiereGrupo: false,
  },
  {
    id: 'informacion_oculta', numero: 2, nombre: 'Información Oculta',
    emocion: 'Curiosidad', icono: '🔍',
    mecanismo: 'Un jugador sabe algo que los demás desconocen y debe administrarlo.',
    regla: 'Crea asimetría: convierte a un jugador pasivo en el portador de la verdad.',
    requiereGrupo: true,
  },
  {
    id: 'eleccion_irreversible', numero: 3, nombre: 'Elección Irreversible',
    emocion: 'Peso moral', icono: '⚖️',
    mecanismo: 'Abrir una ruta cierra otra de forma permanente.',
    regla: 'Si la elección no cuesta algo, no es irreversible: es una bifurcación estética.',
    requiereGrupo: false,
  },
  {
    id: 'recompensa_diferida', numero: 4, nombre: 'Recompensa Diferida',
    emocion: 'Deseo', emocionId: 'deseo', icono: '🔑',
    mecanismo: 'Una clave u objeto obtenido temprano cobra sentido mucho después.',
    regla: 'El asombro retroactivo valida toda la experiencia previa.',
    requiereGrupo: false,
  },
  {
    id: 'observacion_situada', numero: 5, nombre: 'Observación Situada',
    emocion: 'Presencia', icono: '🔭',
    mecanismo: 'Solo se resuelve mirando un objeto real, una inscripción o una relación espacial.',
    regla: 'Si se resuelve buscando en Google desde casa, la máquina ha fallado. El lugar real debe ser la interfaz.',
    requiereGrupo: false,
  },
  {
    id: 'prohibicion', numero: 6, nombre: 'Prohibición y Transgresión',
    emocion: 'Tentación', emocionId: 'culpa', icono: '🚫',
    mecanismo: 'La autoridad prohíbe explícitamente una acción que el jugador desea realizar.',
    regla: 'Sin deseo genuino de transgredir, la mecánica no existe. La transgresión debe tener consecuencia narrativa.',
    requiereGrupo: false,
  },
  {
    id: 'identidad_asignada', numero: 7, nombre: 'Identidad Asignada',
    emocion: 'Transformación', emocionId: 'transformacion', icono: '🎭',
    mecanismo: 'El jugador opera desde las reglas, privilegios y debilidades de un rol específico.',
    regla: 'El rol debe exigir acciones reales y comprobables, no quedarse en disfraz superficial.',
    requiereGrupo: true,
  },
  {
    id: 'prueba_confianza', numero: 8, nombre: 'Prueba de Confianza',
    emocion: 'Vulnerabilidad', icono: '🤝',
    mecanismo: 'Un jugador queda ciego o inmovilizado y depende de otro para avanzar.',
    regla: 'Rompe la dinámica del jugador alfa. Fuerza comunicación precisa y entrega de control.',
    requiereGrupo: true,
  },
  {
    id: 'meta_puzzle', numero: 9, nombre: 'Meta-Puzzle',
    emocion: 'Revelación', emocionId: 'asombro', icono: '🧩',
    mecanismo: 'Piezas dispersas y aparentemente inconexas forman de repente un sentido mayor.',
    regla: 'El clímax cognitivo: lo que parecía ruido se revela como la melodía principal.',
    requiereGrupo: false,
  },
  {
    id: 'ritual_entrada', numero: 10, nombre: 'Ritual de Entrada',
    emocion: 'Umbral', emocionId: 'misterio', icono: '🚪',
    mecanismo: 'Acción física y simbólica que separa la vida ordinaria del tiempo de juego.',
    regla: 'El contrato inicial: saca al turista de su papel y lo inviste de iniciado.',
    requiereGrupo: false,
  },
];

/**
 * Las cinco preguntas del patrón IF&IF. Son las etiquetas literales de los
 * campos, no una guía aparte: si el autor no puede responderlas, el umbral
 * no está diseñado.
 */
export const PATRON_IFIF = [
  { id: 'anomalia',   tiempo: 'Anomalía',   pregunta: '¿Qué detalle real parece fuera de lugar o cargado de sentido?' },
  { id: 'promesa',    tiempo: 'Promesa',    pregunta: '¿Qué podría descubrir el jugador si acepta mirar mejor?' },
  { id: 'friccion',   tiempo: 'Fricción',   pregunta: '¿Qué le impide resolverlo de inmediato?' },
  { id: 'casi',       tiempo: 'Casi',       pregunta: '¿Qué pista lo acerca pero todavía no cierra?' },
  { id: 'revelacion', tiempo: 'Revelación', pregunta: '¿Qué entiende ahora que antes no podía ver?' },
] as const;

/** Las seis comprobaciones del Control de Calidad del Atlas. */
export const CONTROL_CALIDAD = [
  'El jugador entiende qué hacer, aunque no entienda todavía el significado.',
  'La acción es físicamente dependiente del entorno: no se resuelve desde casa buscando en Google.',
  'La restricción aumenta genuinamente el deseo, en lugar de bloquearlo gratuitamente.',
  'El feedback confirma avance o error sin romper jamás la ficción narrativa.',
  'La emoción buscada se manifiesta en el cuerpo antes de que alguien tenga que explicarla.',
  'El lugar real queda alterado permanentemente en la memoria de quien lo jugó.',
] as const;

export function buscarMaquina(id: string | null | undefined): Maquina | undefined {
  if (!id) return undefined;
  return MAQUINAS.find((m) => m.id === id);
}

export function buscarEmocion(id: string | null | undefined): Emocion | undefined {
  if (!id) return undefined;
  return EMOCIONES.find((e) => e.id === id);
}
