/**
 * El arco de UMBRA: etapas, emociones y máquinas.
 *
 * Esto no es material de ambientación: es la biblioteca de la que el autor
 * elige, y la fuente de los avisos del validador.
 *
 * DECISIÓN DE DISEÑO CENTRAL
 * La emoción NO se elige: es consecuencia de la máquina. Si en un punto del
 * juego hay que generar Urgencia, para eso está la Cuenta Regresiva. Y no
 * debe generarse Urgencia en otra etapa del arco. Por eso el selector libre
 * de emociones se retiró: invitaba a un error en vez de prevenirlo.
 *
 * Principio rector: "Una mecánica no es una ocurrencia. Es una máquina
 * emocional. No diseñes un puzzle, diseña una transformación."
 */

export type IdEmocion =
  | 'misterio' | 'deseo' | 'urgencia' | 'complicidad'
  | 'culpa' | 'asombro' | 'orgullo' | 'transformacion';

/** Dónde vive cada etapa. */
export type Ubicacion =
  | 'fuera'   // no se diseña en la herramienta
  | 'ciclo'   // se diseña como umbrales dentro de un ciclo
  | 'cierre'; // el final formal, sin puzles

export interface Etapa {
  numero: number;
  romano: string;
  nombre: string;
  emocion: IdEmocion;
  ubicacion: Ubicacion;
  /** Ciclo que le corresponde, si vive en uno. */
  ciclo?: number;
  /** Qué la produce. */
  mecanica: string;
  /** El riesgo de abusar de ella. Alimenta los avisos del validador. */
  riesgo: string;
  color: string;
}

/**
 * Las ocho etapas del Viaje del Héroe. Cinco ciclos cubren de la II a la VI,
 * uno por etapa; las etapas VII y VIII son el cierre y no llevan puzles; la
 * etapa I ocurre fuera de la herramienta, al ofrecer la experiencia.
 */
export const ETAPAS: Etapa[] = [
  {
    numero: 1, romano: 'I', nombre: 'La Llamada', emocion: 'misterio',
    ubicacion: 'fuera',
    mecanica: 'Promesa clara + información incompleta + pistas verificables',
    riesgo: 'Confundirlo con vaguedad',
    color: 'amber',
  },
  {
    numero: 2, romano: 'II', nombre: 'El Cruce del Umbral', emocion: 'deseo',
    ubicacion: 'ciclo', ciclo: 1,
    mecanica: 'Un objeto o secreto que se vuelve ineludiblemente relevante',
    riesgo: 'Prometer algo que el sistema no entrega',
    color: 'rose',
  },
  {
    numero: 3, romano: 'III', nombre: 'Las Pruebas', emocion: 'urgencia',
    ubicacion: 'ciclo', ciclo: 2,
    mecanica: 'Tiempo limitado + pérdida visible + objetivo',
    riesgo: 'Agotar al jugador o volverlo mecánico',
    color: 'blue',
  },
  {
    numero: 4, romano: 'IV', nombre: 'Los Aliados', emocion: 'complicidad',
    ubicacion: 'ciclo', ciclo: 3,
    mecanica: 'Secreto compartido o rol común',
    riesgo: 'Excluir a parte del grupo',
    color: 'orange',
  },
  {
    numero: 5, romano: 'V', nombre: 'La Caverna Profunda', emocion: 'culpa',
    ubicacion: 'ciclo', ciclo: 4,
    mecanica: 'Transgresión con consecuencia simbólica',
    riesgo: 'Manipular demasiado o incomodar sin propósito',
    color: 'purple',
  },
  {
    numero: 6, romano: 'VI', nombre: 'El Clímax', emocion: 'asombro',
    ubicacion: 'ciclo', ciclo: 5,
    mecanica: 'Revelar la capa oculta del espacio real',
    riesgo: 'Forzar interpretaciones débiles',
    color: 'red',
  },
  {
    numero: 7, romano: 'VII', nombre: 'La Recompensa', emocion: 'orgullo',
    ubicacion: 'cierre',
    mecanica: 'Logro difícil + visible + reconocido',
    riesgo: 'Recompensar acciones demasiado fáciles',
    color: 'cyan',
  },
  {
    numero: 8, romano: 'VIII', nombre: 'El Regreso con el Elixir',
    emocion: 'transformacion', ubicacion: 'cierre',
    mecanica: 'Cambio de identidad + prueba',
    riesgo: 'Quedarse en disfraz superficial',
    color: 'violet',
  },
];

export interface Maquina {
  id: string;
  numero: number;
  nombre: string;
  /** La emoción que produce. No es elegible: es consecuencia. */
  emocion: IdEmocion;
  /** Etapa a la que pertenece. */
  etapa: number;
  mecanismo: string;
  /** La regla que no se puede incumplir sin que la máquina deje de funcionar. */
  regla: string;
  /** Si exige más de un jugador. UMBRA se juega en familias de 3-4. */
  requiereGrupo: boolean;
  icono: string;
}

/**
 * Las máquinas. Ojo con dos ausencias deliberadas:
 *
 * - La etapa I no tiene máquina: el Misterio se consigue al ofrecer la
 *   experiencia (mercadotecnia, disfraz, app atractiva), fuera de aquí.
 * - Observación Situada dejó de ser máquina. Su regla —"si se resuelve con
 *   Google desde casa, ha fallado"— no es un momento del arco sino una
 *   condición de TODAS las máquinas. Vive ahora como sello obligatorio.
 */
export const MAQUINAS: Maquina[] = [
  {
    id: 'ritual_entrada', numero: 10, nombre: 'Ritual de Entrada',
    emocion: 'deseo', etapa: 2, icono: '🚪',
    mecanismo: 'Acción física y simbólica que separa la vida ordinaria del tiempo de juego.',
    regla: 'El contrato inicial: saca al turista de su papel y lo inviste de iniciado.',
    requiereGrupo: false,
  },
  {
    id: 'recompensa_diferida', numero: 4, nombre: 'Recompensa Diferida',
    emocion: 'deseo', etapa: 2, icono: '🔑',
    mecanismo: 'Una clave u objeto obtenido temprano cobra sentido mucho después.',
    regla: 'El asombro retroactivo valida toda la experiencia previa.',
    requiereGrupo: false,
  },
  {
    id: 'cuenta_regresiva', numero: 1, nombre: 'Cuenta Regresiva',
    emocion: 'urgencia', etapa: 3, icono: '⏱️',
    mecanismo: 'El jugador tiene pocos minutos antes de que cierre una ventana narrativa o física.',
    regla: 'La restricción temporal debe ser innegociable.',
    requiereGrupo: false,
  },
  {
    id: 'informacion_oculta', numero: 2, nombre: 'Información Oculta',
    emocion: 'complicidad', etapa: 4, icono: '🔍',
    mecanismo: 'Un jugador sabe algo que los demás desconocen y debe administrarlo.',
    regla: 'Crea asimetría: convierte a un jugador pasivo en el portador de la verdad.',
    requiereGrupo: true,
  },
  {
    id: 'prueba_confianza', numero: 8, nombre: 'Prueba de Confianza',
    emocion: 'complicidad', etapa: 4, icono: '🤝',
    mecanismo: 'Un jugador queda ciego o inmovilizado y depende de otro para avanzar.',
    regla: 'Rompe la dinámica del jugador alfa. Fuerza comunicación precisa y entrega de control.',
    requiereGrupo: true,
  },
  {
    id: 'prohibicion', numero: 6, nombre: 'Prohibición y Transgresión',
    emocion: 'culpa', etapa: 5, icono: '🚫',
    mecanismo: 'Dogma prohíbe explícitamente una acción que el jugador desea realizar; Luzbel la susurra.',
    regla: 'Sin deseo genuino de transgredir, la mecánica no existe. La transgresión debe tener consecuencia narrativa.',
    requiereGrupo: false,
  },
  {
    id: 'eleccion_irreversible', numero: 3, nombre: 'Elección Irreversible',
    emocion: 'culpa', etapa: 5, icono: '⚖️',
    mecanismo: 'Abrir una ruta cierra otra de forma permanente.',
    regla: 'Si la elección no cuesta algo, no es irreversible: es una bifurcación estética.',
    requiereGrupo: false,
  },
  {
    id: 'meta_puzzle', numero: 9, nombre: 'Meta-Puzzle',
    emocion: 'asombro', etapa: 6, icono: '🧩',
    mecanismo: 'Piezas dispersas y aparentemente inconexas forman de repente un sentido mayor.',
    regla: 'El clímax cognitivo: lo que parecía ruido se revela como la melodía principal.',
    requiereGrupo: false,
  },
  {
    id: 'reconocimiento_grupo', numero: 11, nombre: 'Reconocimiento del Grupo',
    emocion: 'orgullo', etapa: 7, icono: '🏅',
    mecanismo: 'La app registra quién aportó qué y le entrega el acto final a esa persona delante de los demás. Se abre el sobre del ciclo y se sella el carnet.',
    regla: 'El reconocimiento nunca lo da la pantalla: la pantalla solo adjudica el gesto. El público es la propia familia.',
    requiereGrupo: true,
  },
  {
    id: 'identidad_asignada', numero: 7, nombre: 'Identidad Asignada',
    emocion: 'transformacion', etapa: 8, icono: '🎭',
    mecanismo: 'El jugador opera desde las reglas, privilegios y debilidades de un rol específico.',
    regla: 'El rol debe exigir acciones reales y comprobables, no quedarse en disfraz superficial.',
    requiereGrupo: true,
  },
  {
    id: 'prueba_espejo', numero: 12, nombre: 'Prueba del Espejo',
    emocion: 'transformacion', etapa: 8, icono: '🪞',
    mecanismo: 'Al principio se muestra algo que el jugador no puede leer, sin explicarlo. Al final se le presenta lo mismo y se le pide interpretarlo.',
    regla: 'Tiene que ser exactamente el mismo estímulo, no uno parecido. No cambió el objeto: cambió su mirada.',
    requiereGrupo: false,
  },
];

/**
 * El sello obligatorio, heredado de la antigua Máquina 05 (Observación
 * Situada). Es la segunda comprobación del Control de Calidad convertida en
 * requisito: el pilar Anti-IA por diseño.
 */
export const SELLO_PRESENCIA = {
  titulo: 'Exige presencia física',
  pregunta: '¿Se podría resolver esto desde casa buscando en Google?',
  regla:
    'Si la respuesta es sí, la máquina ha fallado. El lugar real debe ser la interfaz.',
} as const;

/** Las cinco preguntas del patrón IF&IF. Son las etiquetas de los campos. */
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

export const CICLO_CAMARA_OSCURA = 5;

export function buscarMaquina(id: string | null | undefined): Maquina | undefined {
  if (!id) return undefined;
  return MAQUINAS.find((m) => m.id === id);
}

export function buscarEtapa(numero: number | null | undefined): Etapa | undefined {
  if (numero == null) return undefined;
  return ETAPAS.find((e) => e.numero === numero);
}

export function etapaDeCiclo(ciclo: number | null | undefined): Etapa | undefined {
  if (ciclo == null) return undefined;
  return ETAPAS.find((e) => e.ciclo === ciclo);
}

export function emocionDeEtapa(numero: number | null | undefined): IdEmocion | undefined {
  return buscarEtapa(numero)?.emocion;
}

/** Máquinas disponibles para un ciclo dado, según su etapa. */
export function maquinasDeCiclo(ciclo: number | null | undefined): Maquina[] {
  const etapa = etapaDeCiclo(ciclo);
  if (!etapa) return [];
  return MAQUINAS.filter((m) => m.etapa === etapa.numero);
}

/** Compatibilidad: algunas pantallas todavía piden la lista de emociones. */
export const EMOCIONES = ETAPAS.map((e) => ({
  id: e.emocion,
  nombre: e.emocion.charAt(0).toUpperCase() + e.emocion.slice(1),
  etapa: `${e.romano} · ${e.nombre}`,
  mecanica: e.mecanica,
  riesgo: e.riesgo,
  color: e.color,
}));

export function buscarEmocion(id: string | null | undefined) {
  if (!id) return undefined;
  return EMOCIONES.find((e) => e.id === id);
}
