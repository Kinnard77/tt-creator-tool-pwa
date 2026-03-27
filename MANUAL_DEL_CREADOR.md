# 📖 MANUAL DEL CREADOR - UMBRA Creator Tool

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Proyecto:** Time Travelers - UMBRA

---

## 🧭 QUÉ ES UMBRA

**UMBRA Creator Tool** es una aplicación para crear experiencias de realidad aumentada en catedrales. Los jugadores (turistas convertidos en espías) resuelven puzzles en ubicaciones reales dentro de catedrales, siguiendo el arco narrativo del Viaje del Héroe.

---

## 📋 FLUJO DE TRABAJO (Orden recomendado)

```
1️⃣ NARRATIVAS    →    2️⃣ PUZZLES    →    3️⃣ NODOS (UMBRA)
   (La historia)         (Los enigmas)      (Los lugares físicos)
```

### Paso 1: Crear una Narrativa
- En el **Hub**, click en **📖 Narrativas**
- Click **+ Nueva**
- Elegí una sugerencia o creá desde cero
- Seleccioná la **Fase del Viaje del Héroe**

### Paso 2: Crear Puzzles
- En el **Hub**, click en **🧩 Puzzles**
- Click **+ Nuevo**
- Seleccioná la narrativa a la que pertenece
- Completá: título, tipo de puzzle, enunciado, respuesta, pista

### Paso 3: Crear Nodos (Umbrales)
- En el **Hub**, click en **🌑 UMBRA**
- Seleccioná la catedral
- En el **Walker**, click en "DROP UMBRAL" para crear un nodo
- En el **Composer**, configurá el contenido

---

## 🎯 CONCEPTOS CLAVE

### Nodo / Umbral
Un punto GPS físico en la catedral donde el jugador activará una experiencia.

### Ciclo
Grupo de 4 nodos que forman un **Metapuzzle** (resolver 4 = código final). Cada ciclo tiene su propio color en el mapa:

| Ciclo | Color |
|-------|-------|
| 1 | Violeta → Rosa |
| 2 | Azul → Cyan |
| 3 | Verde → Teal |
| 4 | Naranja → Ámbar |
| 5 | Rojo → Rosa |

### Las 3 Capas de cada Nodo

| Capa | Qué es |
|------|--------|
| **🎬 ESCENARIO** | Contexto histórico/dramático |
| **🧩 SIGILUM** | El puzzle/enigma a resolver |
| **🌑 UMBRA** | Experiencia sensorial final |

### Cámara Oscura
Experiencia dinámica (sin ubicación física) que aparece después de completar 4 nodos. Es la "prueba trascendental" del Viaje del Héroe.

---

## 📱 MENÚ PRINCIPAL (HUB)

| Herramienta | Función |
|-------------|---------|
| 🌑 **UMBRA** | Crear nodos en el mapa |
| 📖 **Narrativas** | Crear historias |
| 🧩 **Puzzles** | Crear enigmas |
| 🎭 **Personajes** | Crear personajes (incluye Aenigma) |
| 🍌 **Prompts** | Generar prompts para Nano Banana 2 |

---

## 🏛️ EJEMPLO COMPLETO: Notre Dame

### 1. LA NARRATIVA

**Título:** "El Misterio de Notre Dame"  
**Ubicación:** Catedral de Notre Dame, París  
**Época:** 1163-1345  
**Fase del Viaje del Héroe:** Pruebas

---

### 2. LOS PUZZLES (4 nodos = 1 Metapuzzle)

| Nodo | Puzzle | Respuesta | Pista |
|------|--------|-----------|-------|
| 1 | ¿Cuántos arcos tiene el pórtico norte? | **7** | Cuenta los arcos apuntados |
| 2 | Busca una letra tallada cerca del altar. ¿Cuál? | **F** | Lado izquierdo del altar mayor |
| 3 | Mide la distancia del banco al pilar más cercano. ¿Cuántos metros? | **3** | 1 paso ≈ 1 metro |
| 4 | Código final (F + 7 + 3) | **F73** | Letra + arcos + distancia |

---

### 3. LOS NODOS (Configuración en Composer)

#### Nodo 1: El Pórtico Norte
- **Coordenadas:** 48.8530, 2.3495
- **Trigger:** 10 metros
- **Ciclo:** 1 (violeta)
- **ESCENARIO:**
  - Título: "El Pórtico Norte"
  - Año: 1250
  - Descripción: "El pórtico norte fue el primero en construirse. Sus 7 arcos simbolizan los 7 sacramentos..."
- **SIGILUM:**
  - Puzzle: "¿Cuántos arcos tiene el pórtico norte?"
  - Respuesta: 7
  - Pista: "Cuenta los arcos apuntados"
- **UMBRA:**
  - Tipo: Texto
  - Contenido: "Has descubierto el primer secreto. Los 7 arcos representan la perfección divina..."
  - Pacing: 5/10

#### Nodo 2: El Altar
- **Coordenadas:** 48.8535, 2.3500
- **Trigger:** 10 metros
- **Ciclo:** 1 (violeta)
- **ESCENARIO:**
  - Título: "La Primera Misa"
  - Año: 1345
  - Descripción: "En 1345, el rey Felipe VI consagró este altar..."
- **SIGILUM:**
  - Puzzle: "Busca una letra tallada cerca del altar. ¿Cuál?"
  - Respuesta: F
  - Pista: "Mira en el lado izquierdo del altar mayor"
- **UMBRA:**
  - Tipo: Texto
  - Contenido: "La letra F representa la palabra 'Fides' (Fe)..."
  - Pacing: 6/10

#### Nodo 3: La Capilla Lateral
- **Coordenadas:** 48.8540, 2.3490
- **Trigger:** 10 metros
- **Ciclo:** 1 (violeta)
- **ESCENARIO:**
  - Título: "La Capilla de los Muertos"
  - Descripción: "Aquí descansar los nobles que financiaron la construcción..."
- **SIGILUM:**
  - Puzzle: "Mide la distancia del banco al pilar más cercano. ¿Cuántos metros?"
  - Respuesta: 3
  - Pista: "Usa tus pasos como referencia"
- **UMBRA:**
  - Tipo: Texto
  - Contenido: "El 3 representa la Santísima Trinidad..."
  - Pacing: 5/10

#### Nodo 4: La Salida - Código Final
- **Coordenadas:** 48.8545, 2.3485
- **Trigger:** 15 metros
- **Ciclo:** 1 (violeta)
- **ESCENARIO:**
  - Título: "El Código Final"
  - Descripción: "Has completado las pruebas. Ahora combina todo lo aprendido..."
- **SIGILUM:**
  - Puzzle: "Código final: F + 7 + 3"
  - Respuesta: F73
  - Pista: "Orden: letra + arcos + distancia"
- **UMBRA:**
  - Tipo: Texto
  - Contenido: "¡Has descifrado el código! La Llave de Cronos está más cerca..."
  - Pacing: 8/10

---

### 4. PROGRESIÓN DEL JUGADOR

```
Nodo 1 (7) → Nodo 2 (F) → Nodo 3 (3) → Nodo 4 (F73)
                                                    ↓
                    CÁMARA OSCURA (experiencia dinámica)
                                                    ↓
                        RECOMPENSA (cena real)
```

---

## 🎨 COLORES EN EL MAPA

Los nodos se muestran con colores según su ciclo:

- **Ciclo 1:** Violeta → Rosa (🟣)
- **Ciclo 2:** Azul → Cyan (🔵)
- **Ciclo 3:** Verde → Teal (🟢)
- **Ciclo 4:** Naranja → Ámbar (🟠)
- **Ciclo 5:** Rojo → Rosa (🔴)

---

## 💡 CONSEJOS PRÁCTICOS

### Para el Levantamiento In-Situ:

1. ** GPS no funciona bien en interiores** → Usá las flechitas de precisión (+1m) en el Walker
2. **Primero caminá toda la catedral** → Identificá los lugares clave
3. **Creá los nodos primero sin contenido** → Después completá en Composer
4. **Cada nodo = un puzzle** → Pero pueden compartir narrativa

### Para los Puzzles:
- Que sean **resolubles** pero no obvios
- Usar el **entorno real** (arcos, letras, distancias)
- Las **pistas** deben ayudar sin dar la respuesta

---

## 📞 SOPORTE

Para dudas o errores, consultá la documentación en:
- **TOOLS.md** - Configuración local
- **GAMEFLOW.md** - Diseño del juego
- **PLAYER_APP_README.md** - Para Godot

---

**© 2026 Time Travelers - UMBRA Creator Tool**  
*Creado por Kinnard + Taleniekov*