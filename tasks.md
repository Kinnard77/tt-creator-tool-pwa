# Tasks — UMBRA (GAME-015)

> AUTORIZADO POR EL ARQUITECTO
> Owner: Jorge Bonilla / IF&IF Studio 2026
> Estado: **Activo — P1** (arquitectura cerrada, validando precisión)
> Actualizado: 1 de agosto de 2026

---

## BLOQUEANTE — nada avanza hasta resolver esto

- [ ] **Diagnosticar por qué ARCore no sigue el movimiento.**
      Caminando 6 m reales, la app reporta 0,7 m. En otro intento, 10 m → 4,7 m.
      No es deriva: es un factor de 3 a 8. Mientras siga así, cualquier medida
      de precisión es basura.
      Construir pantalla de diagnóstico: posición cruda de la cámara en vivo,
      estado del tracking permanente y grande, y el registro en texto para
      fotografiar — los datos viven en el móvil y el asistente no los ve.

- [ ] **Medir el error real** con el recorrido de 4 referencias ya medido con
      láser. Repetir 3-4 veces. **Importa el PEOR caso, no la media.**
      Criterio: <50 cm seguimos · 50 cm–1,5 m sirve con ajustes · >2 m replantear.

---

## Depende de esa medida

- [ ] Manual de referenciado para interiores: cómo elegir, distribuir y medir
      las referencias con el láser, y cómo documentarlas.
- [ ] Pantalla de anclas en la Creator Tool: coordenadas locales métricas,
      foto obligatoria, descripción de identificación, tipo calibración/contenido.
- [ ] ContentDB en Godot: cargador del export `tt-content/3.0`.
- [ ] Integrar el AR real en cathedral (hoy usa fake AR con CameraServer).
- [ ] Medir a qué nivel de luz deja de funcionar el tracking. Decide dónde se
      puede poner contenido anclado dentro de una catedral.

---

## Creator Tool — construcción

- [ ] **Fusión por capas** (no es fusión, son capas): base UMBRA + trasplante
      del offline-first con Dexie, la ficha completa de POI, el esquema con
      autenticación y el export.
- [ ] Conectar Data Collection Box con POIs: el saber alimenta los puzles.
      **NO TOCAR hasta que Jorge haga su comparativa.**
- [ ] Collection Box a nivel de Labyrinthos, no solo por umbral: hay saber que
      no pertenece a ningún punto (el Tetramorfo son 4 ubicaciones, un símbolo).
- [ ] Etiquetas y enlaces entre entradas (copiar `ct_links` del otro proyecto).
- [ ] Modo GamePlayer: ver cada umbral como lo verá el jugador, sin campos.
- [ ] Interfaz para `estado_inicial` y `estado_final` del Labyrinthos.
      Las columnas existen en la base de datos; la pantalla, no.

---

## Decisiones pendientes de Jorge

- [ ] **¿Personaje narrativo y rol jugable son la misma entidad?**
      Afecta al esquema. Se juega en familias de 3-4 y tres máquinas exigen roles.
- [ ] Comparativa Data Collection Box vs POIs.
- [ ] Enseñar la generación del personaje y la taza, para conectarla al elixir.
- [ ] Corregir en `project.md` que Pan y Luzbel ya no son solo fuerzas.

---

## Ideas anotadas, sin empezar

- [ ] **Tableta informativa en AR** frente a obras de arte: números que dirijan
      la mirada a detalles concretos. No necesita precisión; va en paralelo.
- [ ] Enviar o copiar los datos medidos desde el móvil, para no depender de
      apuntar a mano en la catedral.
- [ ] Rectificar los croquis con medidas de láser para convertirlos en planos
      a escala.

---

## Hecho

- [x] Diseñar Creator Tool (pantallas y flujo)
- [x] **AR real funcionando y publicado** en `lelegion.com/v10`. ARCore trackea
      el mundo; los objetos quedan anclados al espacio físico.
- [x] Calibración por 4 referencias (Umeyama/Procrustes), verificada con 4
      pruebas numéricas. 4 referencias mejoran un 45% frente a 2 y delatan la
      mal medida.
- [x] Credenciales fuera del repositorio público, login con enlace mágico y
      políticas de solo-autenticados.
- [x] Renombrado completo a Labyrinthos (146 apariciones + tablas y columnas).
- [x] Las 12 máquinas y el arco de 8 etapas implementados, con validador que
      aplica los riesgos declarados y las reglas de cada máquina.
- [x] Registro de intentos con media y peor caso.
- [x] Ambos repositorios en GitHub; 5 documentos de diseño en `diseno/`.
- [x] Confirmado que cathedral también hace AR real en el navegador.

---

## Descartado, para no volver a proponerlo

- **VPS de Google (Geospatial API)**: no existe en WebXR, solo en SDK nativo.
- **VPS de Niantic para web**: lo están apagando (feb 2026 / feb 2027).
- **Plugin godot_arcore**: sin releases estables, no compila de forma fiable.
- **APK nativo con AR**: imposible hoy en Godot. Por eso todo va por WebXR.
- **AR por marcadores**: existe, exige imágenes planas, experimental en WebXR.
- **Contratar un actor para el Orgullo**: innecesario. En una familia el
  público ya está dentro.
- **El miedo como emoción**: descartado a propósito. Cierra la mirada cuando
  el juego necesita abrirla, y hay niños en el grupo.

---

## Reglas de trabajo aprendidas en campo

- **Marcar la versión en pantalla.** El botón dice "INICIAR AR · v16". Sin eso
  se pierden horas discutiendo si el archivo llegó.
- **No tocar los tamaños de botones y letras**: correctos desde v14.
- **Publicar en carpeta versionada** (`/v10/`): una carpeta nueva no tiene caché.
- **Solo se sube `index.pck`** (3 MB). El `.wasm` son 37 MB y no cambia.
- **Exportar sin abrir Godot**:
  `Godot_v4.6.3-stable_win64.exe --headless --path <proy> --export-release "Web" <sal>/index.html`
  El ejecutable está en `Downloads\Godot_v4.6.3-stable_win64.exe\` (carpeta con
  el mismo nombre que el .exe; el .exe suelto pesa 0 bytes).
- Tras exportar, poner `display: fullscreen` en `index.manifest.json`.
- **Los .glb desempaquetan sus texturas** como PNG sueltos y disparan el `.pck`
  de 114 KB a 14 MB. Vigilarlo.
- **Describir tamaños como fracción de pantalla**, nunca en porcentajes de cambio.

---

## Los fallos ya resueltos, con su causa real

Cada uno costó una salida a la calle. Detalle en `diseno/ESTADO_AR_TRASPASO.md`.

| Síntoma | Causa real |
|---|---|
| La interfaz desaparecía al iniciar AR | Se creyó que Godot no dibuja CanvasLayer en XR. **Falso en este móvil.** Se construyó un HUD 3D innecesario. |
| Imagen de 4 colores tapando la cámara al sol | Era ese HUD 3D: letras de más de un metro pegadas a la cámara. |
| Los toques no hacían nada | El navegador no da la posición del toque en AR de móvil. |
| Las medidas no aparecían | Mensajes escritos solo en una de las dos interfaces. |
| "Subo el archivo y no cambia nada" | Subía a `/catedral` en vez de `/ar`; y el service worker servía caché. |
| Botones diminutos, aleatorio entre versiones | Se calculaban en `_ready()`, antes de que el lienzo tuviera su tamaño final. |
| Cryptex gigantesco | Se escalaba antes de estar en la escena, sin transformación global. |
| Coordenadas al Atlántico | `<input type="number">` rechaza la coma decimal y devolvía cadena vacía. |
