# UMBRA: Creator Tool — Design & Specification

> **Propósito**: Herramienta exclusiva para el Autor (Jorge Bonilla) que permite "escribir" la experiencia sobre el espacio físico real. No es un CMS de escritorio; es una herramienta de campo.

## 1. Filosofía de Diseño
La Creator Tool debe funcionar bajo la premisa de **"Walking is Writing"**. El autor no diseña el nivel en una pantalla y luego va a la catedral; el autor va a la catedral y "graba" la experiencia caminando.
- **Input Principal**: La posición física y la mirada del autor.
- **Output**: Un "Script Espacial" (JSON) que el cliente de UMBRA interpreta.

## 2. Flujo de Uso (The Author's Loop)

### Fase 1: Ingesta (In-Situ)
1. **Arribo**: El autor llega a la Catedral (ej. Notre Dame).
2. **Anclaje**: Define el "Punto Cero" (Zero Anchor) para calibrar el GPS/BlueDot.
3. **Caminata (Drafting)**: El autor camina el recorrido ideal.
   - *Momento de inspiración*: "Aquí la luz es impresionante".
   - **Acción**: Presiona "DROP UMBRAL".
   - **Resultado**: Se crea un nodo geo-referenciado vacío en ese punto.
4. **Captura**: Toma una foto de referencia y graba una nota de voz rápida: "El jugador debe mirar arriba, al rosetón sur".

### Fase 2: Composición (In/Out-Situ)
1. **Refinamiento**: Selecciona un nodo creado (Draft).
2. **Definición del Umbral**:
   - **Trigger**: ¿Cómo se activa? (Radio GPS, Orientación brújula, Hora del día).
   - **Capa Sensorial**: ¿Qué debe sentir el jugador? (Tensión, Silencio, Vértigo).
   - **Contenido**: Texto enigmático, Audio binaural, o Silencio (No-UI).
3. **Conexión**: Une los nodos para sugerir un orden (aunque el jugador puede romperlo).

### Fase 3: Validación (The Test Run)
1. **Simulación**: El autor reinicia la app en modo "Player Dummy".
2. **Recorrido**: Intenta activar los triggers tal como lo haría un jugador.
3. **Ajuste Fino**: "El radio es muy pequeño, no saltó". -> Ajustar radio a 5m.

## 3. Pantallas Principales

### A. The Atlas (Dashboard)
Pantalla de inicio.
- **Lista de Catedrales**: Tarjetas con estado (Borrador, Alpha, Publicado).
- **Botón**: "Nuevo Sitio".
- **Datos**: Muestra cuántos Umbrales tiene cada sitio.

### B. The Walker (Modo Campo)
La pantalla más importante. Uso a una mano mientras se camina.
- **UI**: Minimalista. Mapa oscuro con el punto azul del usuario.
- **Botón Gigante**: `[+] DROP UMBRAL`.
- **Feedback**: Vibración háptica al soltar un nodo.
- **Lista Flotante**: Últimos nodos creados para editar rápido.

### C. The Composer (Editor de Nodo)
Donde se define la magia de cada punto.
- **Header**: Foto de referencia del lugar.
- **Configuración de Trigger**:
  - Slider de Radio (2m - 50m).
  - Toggle: "Requiere Orientación" (¿Debe estar mirando al Norte?).
- **Editor de Experiencia**:
  - Tipo: `Texto` | `Audio` | `Haptic` | `Silencio`.
  - Input: Campo de texto o subida de audio.
- **Meta-Data**:
  - "Intensidad": 1-10 (Para controlar el pacing).
  - "Tag": `Umbra` (Sensorial) o `Sigilum` (Intelectual).

### D. The Sequencer (Vista de Grafo)
Vista aérea para conectar los puntos.
- **Visual**: Los nodos sobre el mapa satelital.
- **Interacción**: Dibujar líneas entre nodos para sugerir rutas.
- **Logic**: Definir dependencias "Hard" (El nodo B no aparece hasta que A esté completo) o "Soft" (Sugerencia).

## 4. Estructura de Datos (Preview)
Lo que genera esta herramienta:
```json
{
  "cathedral_id": "notre_dame_paris",
  "zero_anchor": { "lat": 48.85, "lng": 2.35 },
  "umbrales": [
    {
      "id": "u_roseton_sur",
      "trigger": { "type": "geo_radius", "lat": 48.853, "lng": 2.349, "radius": 5 },
      "experience": { "type": "audio", "src": "chant_01.mp3" },
      "pacing_value": 3,
      "requires": ["u_entrace"]
    }
  ]
}
```
