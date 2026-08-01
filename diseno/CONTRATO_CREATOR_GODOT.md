# El contrato: qué le manda Creator Tool a Godot

> **Nota de vocabulario (posterior a la primera redacción):** donde este
> documento dice `cathedral`, ahora se dice **Labyrinthos** — la sede, sea
> una catedral, un parque o un tramo de ciudad. Ver `FUSION_CREATOR_TOOL.md`.

Este documento define **lo único que las dos aplicaciones necesitan acordar**.
Mientras el formato se respete, cada una puede evolucionar por su cuenta.

- **Creator Tool** es la herramienta de autor. Solo la usas tú. Produce datos.
- **Godot** es el juego que ve el jugador. Consume esos datos y los convierte
  en experiencia: gráficos, narrativa, AR.

El contrato es un archivo JSON. Creator Tool lo exporta; Godot lo importa.

---

## Dos sistemas de coordenadas, a propósito

Esta es la decisión de diseño central, y conviene entenderla bien porque de
ella depende todo lo demás.

**Coordenadas geográficas (latitud/longitud).** Sirven para documentar y para
narrar: en qué zona de la catedral está una vidriera, dónde debe mirar el
jugador, qué se ve desde dónde. Precisión de metros, y en interior el GPS ni
siquiera funciona. Es la capa de *conocimiento*.

**Coordenadas locales métricas (X, Z en metros).** Sirven para el AR y solo
para el AR. Se miden con el láser respecto a un origen que tú fijas dentro de
la catedral. Precisión de centímetros. Es la capa de *anclaje*.

No compiten: cada una responde una pregunta distinta. Un POI puede existir
sin ancla —la mayoría— y un ancla puede no corresponder a ningún POI.

---

## Tres tipos de entidad

### 1. POI — un lugar que importa a la narrativa

Ya existe en Creator Tool y no cambia. Lleva latitud, longitud, fotos,
descripción, dato verificable, dificultad de observación. Es lo que el
jugador debe *encontrar y observar* con sus propios ojos.

### 2. Ancla — un punto medido en el mundo real

Entidad nueva. Lleva coordenadas locales en metros y viene en dos sabores:

**Anclas de calibración.** Los puntos permanentes e inconfundibles que el
jugador marca para que el sistema se alinee. Necesitan foto obligatoria y una
descripción de cómo identificarlas sin ambigüedad. Cuatro por zona de juego,
repartidas formando el cuadrilátero más amplio posible, nunca en línea recta.

**Anclas de contenido.** Dónde aparece cada objeto AR: el Cryptex, un portal,
un símbolo flotante. Se miden igual, con láser, respecto al mismo origen.

### 3. Reto — un puzle

Las tablas ya existen en tu Supabase (`ct_challenges` y compañía), sin
interfaz todavía. Un reto enlaza narrativa, solución, los POIs que usa, el
conocimiento que exige, y —lo nuevo— **el ancla donde se materializa su
contenido AR**, si lo tiene.

Los retos se encadenan por lo que otorgan y requieren. Ese encadenamiento es
el recorrido del juego.

---

## El formato

```json
{
  "schema": "tt-content/3.0",
  "exported_at": "2026-07-27T18:00:00Z",

  "cathedral": {
    "nombre": "Catedral de Ejemplo",
    "ciudad": "San Miguel de Allende",
    "centro": [21.160969, -100.909439],

    "sistema_local": {
      "descripcion": "Origen en el centro de la losa bajo el crucero. Eje X hacia el altar mayor.",
      "origen_gps": [21.160969, -100.909439],
      "rumbo_grados": 0.0
    }
  },

  "anclas": [
    {
      "id": "cal_crucero_nw",
      "tipo": "calibracion",
      "nombre": "Esquina noroeste de la losa del crucero",
      "local": { "x": 0.0, "z": 0.0 },
      "identificacion": "Junta en escuadra entre la losa clara y el pavimento oscuro.",
      "foto": "anclas/cal_crucero_nw.jpg",
      "medido_con": "laser",
      "verificado": true
    },
    {
      "id": "ancla_cryptex_1",
      "tipo": "contenido",
      "nombre": "Nicho del Cryptex del capitel",
      "local": { "x": 12.40, "z": -8.15, "y": 1.10 },
      "identificacion": "Repisa de piedra bajo el tercer capitel de la nave sur.",
      "foto": "anclas/cryptex_1.jpg",
      "medido_con": "laser",
      "verificado": true
    }
  ],

  "pois": [
    {
      "id": "vidriera-sur-3",
      "nombre": "Vidriera del pelícano",
      "coords": [21.160980, -100.909400],
      "posicion_manual": true,
      "dato_verificable": "El pelícano se abre el pecho: aparecen tres crías.",
      "candidato_puzzle": true,
      "fotos": ["pois/vidriera_sur_3.jpg"]
    }
  ],

  "retos": [
    {
      "id": "cryptex-del-pelicano",
      "nombre": "El Cryptex del pelícano",
      "tipo": "cryptex",
      "pacing": 2,

      "ancla": "ancla_cryptex_1",
      "pois": [
        { "id": "vidriera-sur-3", "rol": "pista" }
      ],

      "narrativa": {
        "intro": "El informe del 47 mencionaba un ave que se hiere a sí misma.",
        "exito": "El cilindro cede con un chasquido seco.",
        "fallo": "Los anillos giran en falso."
      },

      "solucion": { "tipo": "codigo", "valor": "3" },

      "requiere": ["libreta-del-espia"],
      "otorga": ["llave-de-la-cripta"],

      "recompensa": { "tipo": "portal", "destino": "cripta_1947" }
    }
  ]
}
```

---

## Lo que hace Godot con esto

Al cargar el archivo, el juego separa las anclas de calibración del resto.
Cuando el jugador llega a la catedral, le pide que marque esas anclas —lo que
narrativamente es el ritual de calibrar el instrumento— y con ellas alinea su
mundo virtual con el real.

A partir de ahí, cualquier ancla de contenido se convierte en una posición
concreta dentro de la sesión AR, y ahí se instancian el Cryptex, el portal o
lo que toque. Los retos gobiernan qué está disponible, qué desbloquea qué, y
qué narrativa se muestra.

Godot no necesita saber nada de GPS para el AR: solo las coordenadas locales.
El GPS lo usa para lo otro, para saber en qué sede está el jugador y para
guiarle en el mapa.

---

## Lo que falta construir, en orden

**En Creator Tool:** una pantalla de anclas donde registras cada punto con su
medida de láser, su foto y su descripción; el campo de ancla en los retos; y
el editor del Módulo B, que hoy solo existe como tablas vacías en Supabase.

**En Godot:** el ContentDB que lee este JSON, el instanciador que coloca las
anclas de contenido, y el flujo de calibración conectado a la narrativa.

**Primero, antes que nada:** la prueba de campo. Si el error real resulta ser
de tres metros en lugar de cincuenta centímetros, este contrato necesita otra
estrategia de anclaje y más vale saberlo antes de escribir las dos mitades.
