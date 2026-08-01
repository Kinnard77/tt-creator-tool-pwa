# Fusión de las dos Creator Tool — propuesta de qué sí y qué no

Documento de decisión. Nada se toca hasta que apruebes esta lista.

Las dos herramientas no compiten: **hacen cosas distintas y encajan en capas**.
Al ponerlas una encima de otra aparece el sistema completo, y descubrí que
varias piezas que parecían duplicadas son en realidad la misma idea con dos
nombres — eso es buena señal, significa que llegaste dos veces a la misma
necesidad.

---

## Las tres capas del sistema

**Capa 1 — Documental: qué HAY en la catedral.**
La aporta `tt-creator-tool` (el local). Levantamiento metódico: POIs con ficha
de observación, checklist, fotos, planos. Responde: ¿qué elementos reales
existen aquí y cuáles sirven para jugar?

**Capa 2 — Autoral: qué OCURRE ahí.**
La aporta UMBRA. Narrativas, puzzles, umbrales, ciclos, personajes, ritmo.
Responde: ¿qué experimenta el jugador y en qué orden?

**Capa 3 — Espacial: DÓNDE exactamente.**
La aportamos nosotros estas últimas horas. Anclas medidas con láser,
calibración por cuatro referencias, AR real. Responde: ¿dónde se materializa
cada cosa, con precisión de un metro?

Ninguna de las tres sobra. UMBRA sin la capa 1 diseña a ciegas; la capa 1 sin
UMBRA es un catálogo muerto; y las dos sin la capa 3 no pueden poner un
Cryptex donde el jugador lo alcance.

---

## La convergencia que no habíamos visto

Tres hallazgos que hacen que la fusión sea más natural de lo esperado.

**El primero.** El campo `dato_verificable` de los POIs del local es
exactamente la materia prima de la mecánica de **LA BÚSQUEDA** de UMBRA. Uno
registra "el pelícano se abre el pecho: aparecen tres crías" y el otro
construye con eso el puzzle "¿cuántas crías hay?". El levantamiento alimenta
directamente los enigmas. No hay que inventar el puente: ya existe.

**El segundo.** El campo `googleable` del local sirve al pilar
**"Anti-IA por diseño"** de UMBRA. Marca si una respuesta se puede encontrar
en internet sin estar allí. Es el filtro automático que garantiza que el juego
no se resuelva desde el sofá. Ese campo vale oro y hay que conservarlo.

**El tercero.** El "Zero Anchor" del diseño de UMBRA y el `sistema_local` que
propuse son el mismo concepto, pensados por separado. Confirmación de que la
arquitectura va bien.

---

## QUÉ SE QUEDA

### De UMBRA — todo el corazón creativo

| Pieza | Por qué se queda |
|---|---|
| **Las 3 capas del nodo** (Escenario / Sigilum / Umbra) | Es la estructura dramática del juego. Nada la sustituye. |
| **Ciclos y Metapuzzle** (4 nodos → código final) | La arquitectura de progresión. Insustituible. |
| **Cámara Oscura** | Experiencia sin ubicación tras completar un ciclo. |
| **Narrativas con Viaje del Héroe** | El arco narrativo. |
| **Puzzles** con enunciado, respuesta y pista | El núcleo lúdico. |
| **Personajes** (incluida Aenigma) | Material creativo. |
| **Prompts** para generación de imagen | Flujo de producción ya montado. |
| **Walker** — "Walking is Writing" | La filosofía de campo. Es lo mejor de UMBRA. |
| **Composer** y **Sequencer** | Edición de nodo y vista de grafo. |
| **Pacing** (1-10) e **intensidad** | Control del ritmo. |
| **Tipos umbra / sigilum** | Las dos capas de experiencia del P0. |
| **Atlas** con estados (borrador/alpha/publicado) | Gestión de sitios. |

### Del local — todo el rigor documental

| Pieza | Por qué se queda |
|---|---|
| **Offline-first con Dexie** | **Crítico.** Dentro de una catedral no hay señal. UMBRA escribe directo a Supabase y ahí se cae. Esto es lo más valioso del local. |
| **Ficha de POI completa** (`dato_verificable`, `googleable`, `dificultad_observacion`, `ventana_visibilidad`, `accesibilidad`, `iluminación`, `aglomeración`) | Alimenta los puzzles de búsqueda y evita diseñar cosas imposibles de ver. |
| **Checklist de levantamiento** | Que no se te olvide documentar nada estando allí. |
| **Plano de planta con esquinas georreferenciadas** | Orientación en interior, donde el GPS no existe. |
| **Fotos con almacenamiento y sincronización** | Imprescindible para identificar anclas. |
| **Autenticación y RLS** | UMBRA tiene las políticas abiertas a cualquiera. El local está protegido. |
| **Capas y zonas** | Organización espacial. |
| **Slugs estables** | IDs fiables para referenciar desde Godot. |
| **Export a Godot** | El puente ya escrito. |

### De nuestro trabajo — la precisión

| Pieza | Por qué |
|---|---|
| **Anclas con coordenadas locales métricas** | Lo único que da el metro de precisión. |
| **Calibración por 4 referencias** | Ya programada y verificada. |
| **Separación ancla de calibración / ancla de contenido** | Dos funciones distintas. |
| **AR real por WebXR** | Validado en tu móvil. |

---

## QUÉ NO SE QUEDA

Nada se pierde: en los cuatro casos, lo que se descarta es **la versión peor
de algo que se conserva mejor en el otro proyecto**.

**El esquema de base de datos de UMBRA se sustituye por el del local.** El de
UMBRA (`cathedrals`, `umbrales`, `desafios`) es más simple pero tiene las
políticas de seguridad abiertas de par en par y no contempla fotos ni
sincronización. Los conceptos de UMBRA no se pierden: se trasladan al esquema
del local, que ya tiene autenticación, fotos y las tablas del Módulo B.

**El disparador por radio GPS deja de ser el único.** Se conserva para los
umbrales sensoriales, donde un radio de cinco metros es perfecto. Pero deja de
usarse para el contenido AR, que pasa a anclas métricas.

**Las flechitas de corrección manual del Walker (+1m) se sustituyen.** Tú
mismo escribiste en el manual que el GPS no funciona en interiores y que hay
que corregir a mano. Eso era el parche correcto sin AR; ahora el ajuste lo da
la calibración por referencias, que es más preciso y menos tedioso.

**El campo `requires` como lista suelta se sustituye por la tabla de aristas**
del local. La lista de UMBRA no permite validar el grafo; la tabla sí, y con
ella se puede detectar automáticamente si el juego tiene un bucle irresoluble.

---

## LO QUE HAY QUE DECIDIR — necesito tu respuesta

**Decisión 1 — ¿Sobre qué base construimos?**
Mi recomendación: **la base de código de UMBRA**, porque tiene ocho módulos
escritos frente a cuatro pantallas del local, y su modelo creativo es el que
manda. Se le trasplantan del local el offline-first, la ficha de POI, el
esquema con autenticación y el export. Es menos trabajo que al revés.

**Decisión 2 — ¿POI y Nodo son la misma entidad o dos?**
Mi recomendación: **dos**. Un POI es algo que existe en la catedral y que
documentaste; un Nodo/Umbral es algo que tú creaste para que ocurra allí. Un
nodo puede apoyarse en varios POIs, y la mayoría de POIs no serán nodos.
Además ya lo confirmaste antes para las anclas.

**Decisión 3 — ¿Un ancla por nodo, o varias?**
Ejemplo: un nodo con un Cryptex y además un portal que se abre en otra pared.
Mi recomendación: **varias**, con un rol cada una.

**Decisión 4 — ¿Qué pasa con los datos ya cargados?**
UMBRA tiene catedrales de ejemplo (Notre Dame, Valencia, Sevilla, Dolores
Hidalgo) y hay un `ejemplo_notre_dame.sql` y un `narrativas.sql`.
¿Son datos reales de trabajo que hay que migrar, o semillas de prueba
desechables? Esto no lo puedo saber desde fuera.

**Decisión 5 — ¿El local tiene contenido real cargado?**
¿Llegaste a levantar POIs de verdad en alguna catedral con él, o se quedó en
pruebas? Si hay levantamiento real, hay que migrarlo.

---

## El vocabulario, ya cerrado

Los nombres se deciden ahora porque van a estar en cada tabla, cada pantalla
y cada conversación. Cambiarlos hoy cuesta un par de horas; dentro de tres
meses, con una sede levantada entera, sería una migración delicada.

| Concepto | Nombre | Qué es |
|---|---|---|
| El proyecto | **UMBRA** | El juego entero, el paraguas de todo. |
| La sede | **Labyrinthos** | Una catedral, un parque, un tramo de ciudad. Sustituye a `cathedral`. |
| El punto | **Umbral** | Cada nodo del recorrido. Se queda como está: *umbral* significa el punto donde se cruza algo, que es exactamente lo que es. |
| El grupo | **Ciclo** | Cuatro umbrales que forman un metapuzzle. |

En plural, **Labyrinthoi**. En código, tabla `labyrinthos` y columna
`labyrinthos_id`.

(UMBRA es también el nombre de una de las tres capas de cada umbral, la capa
sensorial. Convive sin problema: una es el proyecto y otra es una capa, y el
contexto las distingue siempre.)

Por qué Labyrinthos y no otra cosa: las catedrales góticas tenían laberintos
trazados en el suelo que los peregrinos recorrían como camino de iniciación.
El nombre no solo etiqueta la sede, **sugiere cómo diseñarla**: un laberinto
tiene centro, recorrido y orden de llegada, que es justo lo que necesitan los
ciclos y la curva emocional.

Cada Labyrinthos lleva además un **tipo — interior, exterior o mixto —** y eso
no es decorativo: decide la mecánica. En exterior se puede disparar por radio
de GPS; en interior hace falta anclaje por calibración con láser. La
herramienta debe ofrecer unas opciones u otras según el tipo.

---

## Las Emociones Jugables como estructura, no como documento

El marco de las ocho emociones —Misterio, Deseo, Urgencia, Complicidad,
Culpa, Asombro, Orgullo y Transformación— no es material de ambientación:
es el control de calidad de la herramienta. Cada emoción trae su mecánica y
**su riesgo**, y esos riesgos son los que convierten el marco en validador.

**En cada umbral**: un campo de emoción objetivo, elegida entre las ocho.
Junto con el `pacing_value` que ya existe, da la curva emocional del punto.

**En el Sequencer**: además del grafo de dependencias, dibujar la **curva
emocional del recorrido**. De un vistazo se ve si el Labyrinthos va de
Misterio a Transformación o si son seis umbrales seguidos de Urgencia.

**En el validador**: avisos redactados con los riesgos del propio documento.
Tres Urgencias encadenadas disparan *"riesgo de agotar al jugador o volverlo
mecánico"*. Un Labyrinthos sin ningún Asombro avisa de que no hay clímax.
Deseo prometido sin Orgullo que lo cierre avisa de *"prometer algo que el
sistema no entrega"*.

### Dos huecos detectados

Jorge marcó seis etapas como resueltas y **dos como pendientes de diseñar:
Culpa y Asombro**. Son justo las dos que dependen del espacio físico:

- **Asombro** lo definió como *"revelar capa oculta del espacio real"*. Eso
  es la realidad aumentada. El AR no es una función de la app: es el
  instrumento del clímax emocional.
- **Culpa** como *"transgresión con consecuencias simbólicas"*, ir a donde no
  se puede ir. También es espacial.

De ahí que la precisión de anclaje no sea una cuestión técnica: si el portal
aparece medio metro desplazado, no ocurre el Asombro, ocurre un fallo.

### Un desequilibrio que señala el propio marco

Está escrito que la Urgencia es *"casi todas las actividades del jugador"*, y
su riesgo declarado es *"agotar al jugador o volverlo mecánico"*. El diseño
actual carga sobre la emoción que más desgasta mientras las dos que producen
la transformación siguen sin diseñar. El marco detecta esto solo en cuanto se
pone al lado del diseño real: por eso tiene que vivir dentro de la
herramienta.

---

## La fórmula operacional: los campos que faltan

El segundo texto estructural aporta una fórmula concreta:

> Emoción deseada + acción exigida + información incompleta + restricción
> significativa + feedback claro = gameplay con intención

Son **cinco componentes**, y al contrastarlos con lo que la herramienta pide
hoy aparece el hueco. El Composer pide enunciado, respuesta y pista — o sea,
cubre a medias la *información incompleta* y nada más. Faltan tres campos por
umbral:

- **Acción exigida**: qué tiene que HACER el jugador, no qué tiene que
  responder. Contar, medir, esperar, callar, tocar, volver de noche.
- **Restricción significativa**: qué le da peso. Tiempo, silencio, una
  prohibición, el riesgo de perder algo.
- **Feedback**: qué responde el sistema. Revelación, desbloqueo, recompensa
  o consecuencia narrativa.

Sin esos tres, un umbral es una pregunta de examen. Con ellos, es una máquina
emocional. El principio del texto es tajante y conviene grabarlo en la propia
herramienta: **no se diseña un puzzle, se diseña una transformación**.

### En el Labyrinthos, no en el umbral

Dos campos más, pero a nivel de sede, porque describen el arco completo:
**estado inicial** y **estado final** del jugador. Llega como turista y sale
como investigador, o como testigo, o como creador. Eso convierte el
Labyrinthos en una promesa medible, y le da al validador algo que comprobar.

---

## El hallazgo: las tres capas ya son el patrón de cinco tiempos

El texto propone un patrón para convertir un lugar real en juego:
**Anomalía → Promesa → Fricción → Casi → Revelación**.

Y resulta que **las tres capas que UMBRA ya tiene en cada umbral encajan
exactamente encima**:

| Capa existente | Tiempos del patrón |
|---|---|
| 🎬 **Escenario** | Anomalía + Promesa — rompe la mirada ordinaria y orienta el deseo |
| 🧩 **Sigilum** | Fricción + Casi — impide resolver de inmediato y crea proximidad |
| 🌑 **Umbra** | Revelación — cambia cómo se lee el lugar |

La estructura correcta ya estaba construida; lo que faltaba era saber
**para qué servía cada capa**. Eso cambia la interfaz del Composer: en vez de
tres cajas de texto que se rellenan como se pueda, cada capa debe decir qué
tiene que lograr, y el Casi merece campo propio porque es, según el propio
`project.md`, el motor dopaminérgico central del juego.

---

## El modo GamePlayer

El texto pide operar con doble mente: la del GameDesigner, que construye el
mecanismo, y la del GamePlayer, que vive el cuerpo emocional. El diseño
original de la Creator Tool ya lo previó con un modo *Player Dummy* que nunca
se construyó.

Merece la pena rescatarlo: una vista que muestre cada umbral **como lo verá
el jugador**, sin campos ni configuración, para comprobar si la anomalía se
nota, si la promesa se entiende y si el casi produce ansia. Diseñar y jugar
son dos miradas distintas, y la herramienta debe permitir cambiar de una a
otra sin salir de ella.

---

## El criterio de éxito

Está escrito en el texto y debería presidir la herramienta: la experiencia
funcionó cuando **el lugar real y la vivencia quedan transformados en la
memoria del jugador**. No cuando el puzzle se resolvió.

---

## Orden propuesto, si apruebas

1. Terminar la validación de precisión en campo (sigue siendo lo primero).
2. Congelar el esquema fusionado de base de datos.
3. Migrar los datos reales que me confirmes.
4. Trasplantar el offline-first a UMBRA.
5. Añadir la pantalla de anclas y la calibración.
6. Cerrar el export y escribir el ContentDB de Godot.
