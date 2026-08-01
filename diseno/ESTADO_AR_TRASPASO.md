# Estado del trabajo de AR — traspaso

Lo que no está en el código ni en los commits: el razonamiento, lo que ya se
descartó, y por qué.

---

## EL PROBLEMA ABIERTO, y es grave

**ARCore no sigue el movimiento del jugador.** Caminando **6 metros reales**,
la app reporta **0,7 m**. En otro intento, **10 m reales → 4,7 m**.

No es deriva ni imprecisión acumulada: es un factor de 3 a 8. Mientras esto
no se resuelva, **cualquier medida de precisión que se saque es basura**.

### Lo que hay que averiguar primero

1. ¿Llega la posición desde el navegador? Es decir, ¿`camara.global_position`
   (la XRCamera3D) cambia realmente al caminar?
2. ¿O el tracking se pierde y la pose se congela? Los avisos existen pero
   Jorge no los ve: **el texto desaparece mientras marca**.
3. ¿O el error está en el cálculo de `_posicion_jugador()`?

### Lo siguiente a construir: pantalla de diagnóstico

- Posición cruda de la XRCamera3D, actualizándose en vivo.
- Estado del tracking, grande y permanente (no un aviso que se va).
- El registro completo en texto, para que Jorge lo fotografíe y lo mande:
  **los datos viven en el móvil y el asistente NO puede leerlos.**

---

## Lo ya descartado, para no repetirlo

**VPS de Google (Geospatial API)**: no existe en WebXR, solo en SDK nativo.
**VPS de Niantic para web**: Niantic lo está apagando (feb 2026 / feb 2027).
**Plugin godot_arcore**: sin releases estables, no compila de forma fiable.
**APK nativo con AR**: imposible hoy en Godot; por eso todo va por WebXR.
**AR por marcadores**: existe, necesita imágenes planas, experimental en WebXR.

---

## Fallos resueltos y su causa real (12 versiones)

Cada uno costó una salida a la calle. No repetirlos:

| Síntoma | Causa real |
|---|---|
| La interfaz desaparecía al iniciar AR | Se creyó que Godot no dibuja CanvasLayer en XR. **FALSO en este móvil: sí los dibuja.** Se construyó un HUD 3D innecesario. |
| Imagen de 4 colores tapando la cámara a plena luz | Era ese HUD 3D: letras de más de un metro pegadas a la cámara. Verde=progreso, rojo=tracking, blanco=estado, negro=contornos. En penumbra se confundía con la imagen oscura. |
| Los toques no hacían nada | El navegador **no da la posición del toque** en AR de móvil. El código la exigía y descartaba el toque. Ahora cualquier toque avanza la secuencia. |
| Las medidas no aparecían | Varios mensajes se escribían solo en la etiqueta plana sin pasar por el HUD. Se unificó en `_mensaje()`. |
| "Subo el archivo y no cambia nada" | **Dos causas distintas**: (1) subía a `public_html/catedral` en vez de `public_html/ar`; (2) el service worker de la PWA servía una copia cacheada. |
| Botones diminutos, aleatorio entre versiones | Los tamaños se calculaban en `_ready()`, cuando **el lienzo del navegador aún no tiene su tamaño final**. Ahora se recalculan al cambiar de tamaño y 4 veces en los primeros 3 s. |
| Cryptex gigantesco | Se escalaba **antes de estar en la escena**, cuando `global_transform` no existe. Ahora se ajusta después, en `_ajustar_tamano_cryptex()`. |
| Coordenadas al Atlántico (Creator Tool) | `<input type="number">` rechaza la coma decimal y devuelve cadena vacía → se guardaba 0. |

---

## Reglas de trabajo aprendidas

**Marcar la versión en pantalla.** El botón dice "INICIAR AR · v16". Sin eso
se pierden horas discutiendo si el archivo llegó.

**No tocar los tamaños de botones y letras.** Jorge confirmó que en v14 están
perfectos. Los valores están en `_forzar_tamanos()`.

**Publicar en carpeta versionada.** `lelegion.com/v10/` — una carpeta nueva no
puede tener caché. La PWA está desactivada y el `index.html` lleva un script
que desinstala service workers viejos.

**Solo se sube `index.pck`** (3 MB) salvo que cambie el motor. El `.wasm` son
37 MB y no cambia.

**Exportar desde línea de comandos**, sin abrir Godot:
`Godot_v4.6.3-stable_win64.exe --headless --path <proyecto> --export-release "Web" <salida>/index.html`
El ejecutable está en `Downloads\Godot_v4.6.3-stable_win64.exe\` (carpeta con
el mismo nombre que el .exe). El .exe suelto en Downloads pesa 0 bytes.

**Tras exportar hay que poner `display: fullscreen`** en `index.manifest.json`.

**Los .glb desempaquetan sus texturas** como PNG sueltos en la carpeta y
disparan el tamaño del `.pck` de 114 KB a 14 MB. Vigilarlo.

**Describir tamaños como fracción de pantalla**, nunca en porcentajes de
cambio ("2,5 veces más grande" no significó nada útil).

---

## Datos de campo confirmados

- **AR real funciona**: ARCore trackea, los objetos quedan anclados, Jorge
  recogió 5 esferas caminando alrededor.
- **cathedral también hace AR real** en el navegador (escena `geo_test`).
- **Con poca luz el tracking se degrada** y la interfaz llegó a desaparecer.
- Jorge repite **siempre el mismo recorrido con 4 referencias medidas con
  láser**: es un banco de pruebas repetible, hay que aprovecharlo.

---

## Dónde está cada cosa

- **AR**: `C:\Users\illus\ClaudeCode\ar-godot` → github.com/Kinnard77/umbra-ar-godot (privado)
- **Creator Tool**: `PROYECTOS_IA_MASTER\tt-creator-tool-pwa` → github.com/Kinnard77/tt-creator-tool-pwa
- **Publicado**: `lelegion.com/v10` (topógrafo) y `lelegion.com/catedral`
- **Diseño**: `FUSION_CREATOR_TOOL.md`, `ARCO_Y_MAQUINAS.md`, `ATLAS_DE_MAQUINAS.md`
- **Contrato con Godot**: `ar-godot/CONTRATO_CREATOR_GODOT.md`

---

## Decisiones de diseño que NO están en el código

**Vocabulario**: UMBRA es el juego. **Labyrinthos** la sede. **Umbral** el
nodo. Ciclo = 4 umbrales.

**Se juega en FAMILIAS** de 3-4 personas, no en solitario. Tres máquinas lo
exigen.

**El arco**: etapa I fuera de la herramienta (mercadotecnia); ciclos 1-5 =
etapas II-VI; etapas VII-VIII son el cierre sin puzles; Cámara Oscura única
al final del ciclo 5.

**Dogma prohíbe, Luzbel tienta, Pan hace ver.** Motor narrativo de la Culpa.
Corregir `project.md`, que dice que son "fuerzas, no personajes".

**El orgullo se resuelve sin actor**: la app adjudica el gesto final a quien
más aportó, delante de su familia, más un carnet con cinco sobres cerrados.
Los artefactos (Character Sheet, taza, cena) son el Elixir de la etapa VIII,
no el Orgullo.

**Si el antagonista se encarna**, actor contratado y sabedor. Nunca personal
real de la catedral.

---

## Pendiente de Jorge

- Comparativa Data Collection Box vs POIs (no tocar hasta que avise).
- ¿Personaje narrativo y rol jugable son la misma entidad?
- Enseñar la generación del personaje y la taza.
- Idea anotada: **tableta informativa en AR** frente a obras de arte, con
  números que dirijan la mirada a detalles. No necesita precisión.
