# UMBRA

## Owner
Jorge Bonilla / IF&IF Studio 2026

## Origen
Este proyecto nace a partir de una conversación de diseño profundo centrada en juegos iniciáticos, Street Games, arquitectura sagrada, percepción, presencia física y narrativa no explícita.  
Origen directo: este chat (spawn A).

## Tipo
Juego / App (Videojuego experiencial en espacio físico)

## Estado (1 de agosto de 2026)
**Activo — P1.** Arquitectura cerrada, validando precisión en campo.
- Repos: `Kinnard77/tt-creator-tool-pwa` · `Kinnard77/umbra-ar-godot` (privado)
- Publicado: `lelegion.com/v10` (topógrafo AR) · `lelegion.com/catedral`
- **Bloqueante**: ARCore no sigue el movimiento (6 m reales = 0,7 m medidos).
- Tareas en `tasks.md`. Diseño completo en `diseno/`.

## Vocabulario (cerrado)
- **UMBRA** — el juego.
- **Labyrinthos** — la sede: catedral, parque o tramo de ciudad. Plural
  *Labyrinthoi*. Lleva tipo interior/exterior/mixto, que decide la mecánica.
- **Umbral** — cada nodo del recorrido.
- **Ciclo** — cuatro umbrales que forman un metapuzzle. Cinco ciclos por sede.

## Quién juega
**Familias de 3 o 4 personas**, no jugadores solitarios. Tres de las doce
máquinas exigen grupo: Información Oculta, Prueba de Confianza e Identidad
Asignada.

## Propósito
Crear un Street Game iniciático que se vive caminando en catedrales y espacios de alto valor simbólico, donde el jugador no “resuelve” acertijos clásicos, sino que atraviesa umbrales perceptivos, simbólicos y corporales.  
UMBRA busca transformar la forma en que el jugador percibe el espacio, manteniendo una tensión constante entre comprensión intelectual y experiencia sensorial, sin depender de narrativas cerradas ni de soluciones explícitas.

## Loop central del jugador
1. Entrada al espacio (como turista/jugador).
2. Activación de atención mediante puzzles y tensiones perceptivas.
3. Progresión por umbrales invisibles (orden, disrupción, ambigüedad).
4. Acumulación del estado “CASI” (anticipación sin cierre).
5. Clímax lúdico (experiencia culminante corporal o decisional).
6. Cierre operativo de la experiencia (progreso validado).
7. Deseo de repetir la experiencia en otra catedral.

## Pilares
1. Presencia física obligatoria: si no se está ahí, no ocurre.
2. MetaPuzzle universal con expresión local: misma estructura, experiencias distintas.
3. CASI como motor dopaminérgico central (anticipación > resolución).
4. Tensión Pan / Luzbel. **Corrección (1 ago 2026): son personajes
   secundarios**, no solo fuerzas. Pan hace ver, Luzbel tienta, y Dogma
   prohíbe: entre los tres producen la Culpa.
5. Anti-IA por diseño: no resoluble remotamente ni por información textual.

## Alcance P0 (MVP)
- Una app/juego en formato horizontal fullscreen.
- Descarga de “paquetes” por catedral/ciudad (~50MB).
- Al menos 1 catedral diseñada bajo el canon UMBRA.
- Un clímax lúdico funcional y validado en sitio.
- Backend autoritario que valida progreso sin exponer soluciones.
- Soporte para dos capas de experiencia:
  - UMBRA (sensorial/iniciática).
  - UMBRA · SIGILUM (intelectual/simbólica).

## Fuera de alcance (por ahora)
- Narrativa cerrada o explicativa.
- Tours históricos tradicionales.
- Mecánicas de puntos, rankings o competencia.
- Público masivo no dispuesto a la ambigüedad.
- Diseño definitivo de recorridos sin visita física del autor.

## Riesgos
- Percepción inicial de “no entender” si el onboarding es débil.
- Confundir contemplación con falta de juego si no hay clímax claro.
- Diseñar desde escritorio sin validación física (riesgo mayor).
- Diluir la autoría si no se respeta la Creator Tool como filtro.

## El arco, cerrado
Ocho etapas del Viaje del Héroe. La I ocurre **fuera de la herramienta** (es
mercadotecnia y puesta en escena). Los cinco ciclos cubren las etapas II a VI,
uno por etapa. Las etapas VII y VIII son el **cierre, sin puzles**. La Cámara
Oscura es **única**, al final del ciclo 5.

| Etapa | Emoción | Dónde | Máquinas |
|---|---|---|---|
| I · La Llamada | Misterio | fuera | — |
| II · El Cruce del Umbral | Deseo | ciclo 1 | Ritual de Entrada · Recompensa Diferida |
| III · Las Pruebas | Urgencia | ciclo 2 | Cuenta Regresiva |
| IV · Los Aliados | Complicidad | ciclo 3 | Información Oculta · Prueba de Confianza |
| V · La Caverna Profunda | Culpa | ciclo 4 | Prohibición · Elección Irreversible |
| VI · El Clímax | Asombro | ciclo 5 | Meta-Puzzle |
| VII · La Recompensa | Orgullo | cierre | Reconocimiento del Grupo |
| VIII · El Regreso con el Elixir | Transformación | cierre | Identidad Asignada · Prueba del Espejo |

**La emoción no se elige: es consecuencia de la máquina.** Detalle completo en
`diseno/ARCO_Y_MAQUINAS.md` y `diseno/ATLAS_DE_MAQUINAS.md`.

## Cómo se ancla el contenido
- **Volúmenes grandes y lejanos** (dragones, portales): por coordenadas GPS.
  Toleran metros de error.
- **Objetos que se manipulan** (Cryptex): por **calibración con 4 referencias**
  medidas con láser, y con iluminación suficiente. El GPS no entra en el
  cálculo: todo es relativo.
- La oscuridad **puede ser el destino, pero no el camino**: ARCore deja de
  seguirte si la recorre.

## Próximos pasos (concretos)
1. **Resolver el bloqueante del tracking** (ver `tasks.md`).
2. Medir el error real del sistema con el recorrido ya medido con láser.
3. Manual de referenciado para interiores.
4. Pantalla de anclas en la Creator Tool y ContentDB en Godot.
5. Integrar el AR real en cathedral.
