'use client';

import { useEffect } from 'react';

/**
 * UMBRA no usa service worker. Si encuentra alguno registrado en esta
 * direccion, lo desregistra y borra sus cachés.
 *
 * Por qué existe esto: los service workers pertenecen a una direccion
 * (localhost:3100, midominio.com), no a un proyecto. Si otra aplicacion
 * registro uno antes en la misma direccion, ese service worker sigue vivo
 * e intercepta las peticiones de UMBRA, sirviendo trozos de JavaScript de
 * la otra app. El sintoma es que la pagina se reinicia sola en mitad de un
 * formulario. Ya nos paso con tt-creator-tool en localhost:3000.
 */
export default function LimpiarServiceWorkers() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((regs) => {
      if (regs.length === 0) return;
      console.warn(
        `[UMBRA] Encontrados ${regs.length} service worker(s) ajenos. ` +
          'Desregistrando para evitar interferencias.'
      );
      regs.forEach((r) => r.unregister());

      if ('caches' in window) {
        caches.keys().then((claves) => claves.forEach((c) => caches.delete(c)));
      }
    });
  }, []);

  return null;
}
