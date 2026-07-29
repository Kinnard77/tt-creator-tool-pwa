/**
 * Lectura tolerante de coordenadas escritas o pegadas a mano.
 *
 * Acepta los formatos con los que uno se encuentra de verdad:
 *
 *   21.1583            grados decimales
 *   21,1583            con coma decimal (teclado espanol)
 *   20°54'49.4"N       grados/minutos/segundos, que es lo que copia Google Maps
 *   20 54 49.4 N       lo mismo con espacios
 *   20°54.823'N        grados y minutos decimales (formato nautico)
 *   -100.9326          negativo directo
 *   100°44'37.7"O      hemisferio en espanol (O de Oeste)
 *
 * Por que importa: <input type="number"> rechaza la coma decimal y devuelve
 * cadena vacia, que antes se guardaba como 0. Una catedral en (0,0) aparece
 * en el Atlantico frente a Africa.
 */

export type Resultado =
  | { ok: true; valor: number }
  | { ok: false; vacio: boolean; motivo: string };

const VACIOS = ['', '-', '.', '-.', ',', '-,'];

/** Extrae signo por hemisferio, y los numeros que haya. */
function analizar(entrada: string): { signo: number; partes: number[] } | null {
  let t = entrada.trim().toUpperCase().replace(/,/g, '.');

  let signo = 1;

  // Hemisferio, al principio o al final. O = Oeste, W = West.
  const hemisferio = t.match(/[NSEWO]/g);
  if (hemisferio && hemisferio.length === 1) {
    const h = hemisferio[0];
    if (h === 'S' || h === 'W' || h === 'O') signo = -1;
    t = t.replace(/[NSEWO]/g, '');
  } else if (hemisferio && hemisferio.length > 1) {
    return null; // "20N30S" no significa nada
  }

  if (t.includes('-')) {
    // El menos solo vale delante. En medio no es una coordenada.
    if (!/^\s*-/.test(t)) return null;
    // Menos y hemisferio negativo a la vez ("-100 W") siguen siendo negativo.
    signo = -1;
    t = t.replace('-', '');
  }

  // Todo lo que no sea digito o punto separa numeros: ° ' " espacios, etc.
  const trozos = t.split(/[^0-9.]+/).filter((s) => s !== '');
  if (trozos.length === 0 || trozos.length > 3) return null;

  const partes: number[] = [];
  for (const trozo of trozos) {
    const n = Number(trozo);
    if (!Number.isFinite(n) || n < 0) return null;
    partes.push(n);
  }

  return { signo, partes };
}

function aDecimal(entrada: string): number | null {
  const r = analizar(entrada);
  if (!r) return null;
  const [g, m = 0, s = 0] = r.partes;
  if (m >= 60 || s >= 60) return null; // minutos y segundos van de 0 a 59
  return r.signo * (g + m / 60 + s / 3600);
}

function leer(texto: string, max: number, nombre: string, pista: string): Resultado {
  const limpio = texto.trim().replace(/\s+/g, '');
  if (VACIOS.includes(limpio)) {
    return { ok: false, vacio: true, motivo: 'Sin valor' };
  }

  const n = aDecimal(texto);
  if (n === null || !Number.isFinite(n)) {
    return {
      ok: false,
      vacio: false,
      motivo: 'No se entiende. Vale 21.1583, o 21°09\'29.9"N como lo copia Google Maps.',
    };
  }
  if (n < -max || n > max) {
    return { ok: false, vacio: false, motivo: `${nombre} va de -${max} a ${max}. ${pista}` };
  }
  return { ok: true, valor: n };
}

export function leerLatitud(texto: string): Resultado {
  return leer(texto, 90, 'La latitud', '¿Has cambiado latitud por longitud?');
}

export function leerLongitud(texto: string): Resultado {
  return leer(texto, 180, 'La longitud', '');
}

/** (0,0) esta en el Atlantico, frente a Africa. Casi siempre significa que
 *  las coordenadas nunca llegaron a guardarse bien. */
export function esNulaIsla(lat: number, lng: number): boolean {
  return Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001;
}
