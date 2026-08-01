# Atlas de Máquinas — catálogo operativo para la Creator Tool

Extraído del *Atlas de Mecánicas, Emociones y Transformación* (IF&IF Studio,
v1.0). Este documento no es ambientación: es la biblioteca de la que el autor
elige al crear cada umbral.

Principio rector, literal:

> **Una mecánica no es una ocurrencia. Es una máquina emocional.**
> No diseñes un puzzle. Diseña una transformación.

---

## Las diez máquinas

| # | Máquina | Emoción | Mecanismo | Regla de uso |
|---|---|---|---|---|
| 01 | **Cuenta Regresiva** | Urgencia | Pocos minutos antes de que cierre una ventana narrativa o física | La restricción temporal debe ser **innegociable** |
| 02 | **Información Oculta** | Curiosidad | Un jugador sabe algo que los demás no, y debe administrarlo | Crea asimetría; convierte al pasivo en portador de la verdad |
| 03 | **Elección Irreversible** | Peso moral | Abrir una ruta cierra otra para siempre | Si no cuesta algo, no es irreversible: es una bifurcación estética |
| 04 | **Recompensa Diferida** | Deseo | Algo obtenido pronto cobra sentido mucho después | El asombro retroactivo valida toda la experiencia previa |
| 05 | **Observación Situada** | Presencia | Solo se resuelve mirando un objeto real, una inscripción o una relación espacial | **Si se resuelve con Google desde casa, la máquina ha fallado** |
| 06 | **Prohibición y Transgresión** | Tentación (culpa o desafío) | La autoridad prohíbe algo que el jugador desea hacer | Sin deseo genuino de transgredir, la mecánica no existe |
| 07 | **Identidad Asignada** | Transformación | El jugador opera desde las reglas y debilidades de un rol | El rol debe exigir **acciones comprobables**, no disfraz |
| 08 | **Prueba de Confianza** | Vulnerabilidad | Uno queda ciego o inmovilizado y depende de otro | Rompe la dinámica del "jugador alfa" |
| 09 | **Meta-Puzzle** | Revelación | Piezas dispersas y aparentemente inconexas forman un sentido mayor | El clímax cognitivo: el ruido se revela melodía |
| 10 | **Ritual de Entrada** | Umbral | Acción física y simbólica que separa la vida ordinaria del juego | El contrato inicial: saca al turista y lo inviste de iniciado |

---

## El patrón IF&IF, con sus preguntas

Los cinco tiempos, y **la pregunta que el autor debe responder en cada uno**.
Estas preguntas deberían ser literalmente las etiquetas de los campos del
Composer:

1. **Anomalía** — *¿Qué detalle real parece fuera de lugar o cargado de sentido?*
2. **Promesa** — *¿Qué podría descubrir el jugador si acepta mirar mejor?*
3. **Fricción** — *¿Qué le impide resolverlo de inmediato?*
4. **Casi** — *¿Qué pista lo acerca pero todavía no cierra?*
5. **Revelación** — *¿Qué entiende ahora que antes no podía ver?*

---

## Intervención de la Realidad: los seis pasos de campo

El procedimiento para convertir un lugar real en juego. Es el guion del
Walker, y encaja con "Walking is Writing":

1. **Nombrar** la escena base (catedral, callejón, restaurante).
2. **Detectar lo verificable**: inscripciones, orientación, luz, materiales.
3. **Definir la promesa**: aquí hay algo que la mayoría no ve.
4. **Elegir la fricción**: tiempo, silencio, espera o colaboración.
5. **Crear acción situada**: obligar a mirar, medir, comparar o registrar.
6. **Revelación**: el espacio ya no vuelve a ser el mismo.

El paso 2 es exactamente el campo `dato_verificable` del levantamiento, y el
paso 5 es el campo `accion_exigida`. La herramienta ya tiene dónde
guardarlos: faltaba saber que eran pasos de un método.

---

## Control de calidad: el validador, literal

Seis comprobaciones que el propio documento define. Son la especificación
del validador, sin necesidad de inventar nada:

1. El jugador **entiende qué hacer**, aunque no entienda aún el significado.
2. La acción es **físicamente dependiente del entorno**. No se resuelve desde
   casa buscando en Google.
3. La restricción **aumenta el deseo** en vez de bloquear gratuitamente.
4. El feedback confirma avance o error **sin romper la ficción**.
5. La emoción se manifiesta **en el cuerpo** antes de que nadie la explique.
6. El lugar real queda **alterado permanentemente en la memoria**.

La comprobación 2 valida el campo `googleable` del levantamiento: deja de ser
un dato curioso y pasa a ser una puerta de calidad.

---

## Lo que este documento revela y el modelo de datos no contempla

**Varias máquinas exigen grupo, no jugador solitario.** La 02 crea asimetría
entre jugadores; la 08 obliga a que uno dependa de otro; la 03 cambia la
relación con un mentor; el riesgo declarado de la Complicidad es *"excluir a
parte del grupo"*.

Hoy no existe en el modelo ninguna noción de **jugadores, grupo o roles**.
Si UMBRA se juega en grupo —y estas máquinas dicen que sí—, hace falta
decidirlo pronto, porque afecta al esquema entero: un umbral tendría que
poder dirigirse a un rol concreto y no a "el jugador" en abstracto.

Es la pregunta abierta más grande que deja el documento.
