---
name: Dale Play!
description: Descubrimiento de cine en español, en una sala a oscuras
colors:
  violeta-marquesina: "rgb(125, 125, 255)"
  violeta-marquesina-deep: "rgb(60, 60, 255)"
  rojo-cartelera: "rgb(200, 50, 50)"
  verde-regresar: "rgb(0, 140, 0)"
  verde-regresar-deep: "rgb(1, 90, 1)"
  rojo-cerrar: "rgb(175, 24, 24)"
  rojo-cerrar-deep: "rgb(134, 6, 6)"
  negro-sala: "#000"
  plata-pantalla: "#ccc"
  blanco-pantalla: "#fff"
  gris-ficha: "rgba(80, 80, 80, 0.3)"
  gris-claro-ficha: "rgba(245, 245, 245, 0.3)"
typography:
  scale:
    hero-display-min: "2rem"
    hero-display-max: "4rem"
    brand-display-min: "1.9rem"
    brand-display-max: "3rem"
    seccion-display-min: "1.4rem"
    seccion-display-max: "2rem"
    resultado-display-min: "1.3rem"
    resultado-display-max: "1.8rem"
    modal-display-min: "1.6rem"
    modal-display-max: "2.4rem"
    rank: "1.35rem"
    estado: "1.05rem"
    anio: "0.8rem"
    vacio: "1.1rem"
    retry: "0.95rem"
    icono-buscar: "2.1rem"
  display:
    fontFamily: '"Prata", Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.9rem, 4.5vw, 3rem)"
    fontWeight: 400
  headline:
    fontFamily: '"Prata", Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.4rem, 2.6vw, 2rem)"
    fontWeight: 400
  title:
    fontFamily: '"Nunito Sans", "Sofia Sans", Arial, Helvetica, sans-serif'
    fontSize: "1.5rem"
    fontWeight: 800
  body:
    fontFamily: '"Nunito Sans", "Sofia Sans", Arial, Helvetica, sans-serif'
    fontWeight: 400
  label:
    fontFamily: '"Nunito Sans", "Sofia Sans", Arial, Helvetica, sans-serif'
    fontSize: "1.2rem"
    fontWeight: 700
rounded:
  xs: "4px"
  sm: "5px"
  md: "10px"
  lg: "14px"
  pill: "999px"
  full: "50%"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.violeta-marquesina}"
    textColor: "#fff"
    rounded: "{rounded.sm}"
    height: "2.5rem"
    padding: "0 0.5rem"
  button-primary-hover:
    backgroundColor: "{colors.violeta-marquesina-deep}"
  button-regresar:
    backgroundColor: "{colors.verde-regresar}"
    textColor: "#fff"
    rounded: "{rounded.sm}"
    height: "2.5rem"
  button-regresar-hover:
    backgroundColor: "{colors.verde-regresar-deep}"
  button-close:
    backgroundColor: "{colors.rojo-cerrar}"
    textColor: "#fff"
    rounded: "{rounded.full}"
    size: "40px"
  button-close-hover:
    backgroundColor: "{colors.rojo-cerrar-deep}"
  input-search:
    backgroundColor: "#fff"
    textColor: "#333"
    rounded: "{rounded.sm}"
    height: "2.5rem"
    padding: "0 0.5rem"
  card:
    backgroundColor: "transparent"
    textColor: "{colors.plata-pantalla}"
---

# Design System: Dale Play!

## Overview

**Creative North Star: "La Sala Oscura"**

Dale Play! es una sala de cine a oscuras: la luz apagada, la pantalla encendida, y nada compitiendo por la atención. El fondo es negro profundo; los pósters de TMDB son la única fuente de luz y color en la habitación. La interfaz se rehúsa a animarse: superficies oscuras, texto gris plata, y un solo accent — Violeta Marquesina — que enciende títulos y acciones.

El tono es cinematográfico y directo. No hay ornamento, no hay gradientes decorativos, no hay fondos claros: hay negro, un accent frío para actuar, un rojo para señalar secciones, y mucho póster. Los componentes son táctiles y confiados: planos en reposo, con profundidad que solo aparece como respuesta — una sombra al hover, un zoom de imagen, un modal que flota sobre el resto con blur. Los bordes son redondeados pero discretos (5px); la separación la hace el vacío negro, no las líneas.

**Key Characteristics:**
- Fondo Negro Sala y texto Plata de Pantalla; los pósters son el color de la app.
- Un solo accent para acciones y títulos (Violeta Marquesina), un rojo reservado para encabezados de sección.
- Profundidad reactiva: plana en reposo, viva en hover (sombra + zoom) y en el modal (blur + overlay).
- Tipografía sans redondeada y pesada (Nunito Sans): amigable, legible, directa.
- El modal de detalle usa el backdrop de la película como fondo difuminado.

## Colors

Paleta de una sala de cine: un accent frío para actuar, un rojo para encabezados, y neutros apagados para que el arte de cada película sea el protagonista.

### Primary
- **Violeta Marquesina** (rgb(125, 125, 255)): el accent central. Tiñe el título de la marca, los años y géneros dentro de las cards (`.card strong`), y el botón de búsqueda. Su variante hover, **Violeta Marquesina Profundo** (rgb(60, 60, 255)), sube la saturación al presionar.
- **Violeta Marquesina Profundo** (rgb(60, 60, 255)): estado hover del accent, no un color independiente.

### Secondary
- **Rojo Cartelera** (rgb(200, 50, 50)): reservado para los encabezados de sección (`h2` de "Top 10…"). Es señal de lectura, no de acción.

### Tertiary
- **Verde Regresar** (rgb(0, 140, 0)): exclusivo del botón "Regresar" a la pantalla principal. Su hover, **Verde Regresar Profundo** (rgb(1, 90, 1)), es un estado de ese botón, no un color independiente.
- **Rojo Cerrar** (rgb(175, 24, 24)): fondo del botón circular de cierre del modal; su hover, **Rojo Cerrar Profundo** (rgb(134, 6, 6)), solo existe como estado.

### Neutral
- **Negro Sala** (#000): fondo de la app y del modal. El lienzo de la sala.
- **Plata de Pantalla** (#ccc): texto por defecto sobre el negro.
- **Gris Ficha** (rgba(80, 80, 80, .3)): overlay translúcido sobre pósters claros.
- **Gris Claro Ficha** (rgba(245, 245, 245, .3)): overlay translúcido para superficies claras (rama light definida en `:root`, no activa por defecto).
- **Blanco Pantalla** (#fff): texto sobre botones y en el modal.

### Named Rules
**The Poster Wins Rule.** El fondo y las superficies se apagan (negro, grises translúcidos) para que el arte del póster sea la única luz de la pantalla. Nada claro y saturado compite con la película.

**The One Voice Rule.** El accent violeta es una sola voz: títulos de marca y acciones. El rojo solo marca encabezados de sección; el verde vive únicamente en "Regresar". Un color, un trabajo.

## Typography

**Display Font:** Prata (serif) para marca, secciones, título del hero y del modal.
**Body Font:** Nunito Sans (con Sofia Sans, Arial, Helvetica, sans-serif)

**Character:** El contraste es editorial-cinematográfico: los títulos en Prata (un serif frío, de catálogo de cine) y el cuerpo en Nunito Sans, humanista, redondeada y pesada. La app se lee como un catálogo de cartelera: serif para lo que brilla, sans para lo que informa.

### Hierarchy
- **Display** (Prata, 400): marca "Dale Play!" (clamp 1.9–3rem) y título del hero (clamp 2–4rem, blanco).
- **Headline** (Prata, 400, Rojo Cartelera): encabezados de sección "Top 10 · …" con regla fina; en violeta para los resultados de búsqueda.
- **Title** (Nunito Sans 800, 1.5rem): títulos de película y personas dentro de las cards, truncados a una línea con ellipsis.
- **Body** (400, Plata de Pantalla): sinopsis, biografía, fechas y metadatos en el modal y las cards.
- **Label** (700, 1.2rem): botones, inputs y select de búsqueda; a 2.5rem de alto para toque confortable.
- **Rank** (Prata, 1.35rem): numeración "01…10" del Top 10, sobre un chip oscuro.

### Named Rules
**The One-Line Title Rule.** Los títulos de card nunca rompen línea: `white-space: nowrap` con ellipsis. El póster habla; el texto no ocupa dos renglones.

## Layout

El modelo es una galería de cartelera en carrusel: cada sección "Top 10" es un track horizontal (`grid-auto-flow: column`) con `scroll-snap-type: x mandatory`, cards de `clamp(250px, 72vw, 320px)`, swipe táctil nativo y flechas `‹`/`›` (glass, circulares) desde ≥768px. El track oculta su scrollbar y se navega con el teclado (focus + flechas). Cada card es un póster con relación 2:3 a todo el ancho de su celda, con la numeración del Top 10 (chip "01…10") en su esquina superior izquierda. El encabezado apila logo, marca y el icono de búsqueda en fila (space-evenly en móvil, space-between desde ≥768px); el logo mantiene aspect-ratio 1:1 y 100px de alto.

El hero de portada ("En cartelera hoy") abre el home a pantalla de cine: min-height 16rem en móvil, 58vh desde ≥768px (máx 74vh), con el `backdrop_path` de la película destacada como fondo, velo degradado para legibilidad y el contenido anclado abajo.

El formulario de búsqueda es un panel (borde 14px) con controles en fila (10px) desde ≥768px: input, select y los botones Buscar/Regresar con padding horizontal generoso y `flex-shrink: 0`. Ocupa 80% (≥768px), 60% (≥1024px) y 40% (≥1440px) del ancho, centrado. El modal es 95vw × 80vh en móvil y 50vw, alto ajustado al contenido desde ≥1024px. Densidad: padding horizontal de 1rem en las secciones de cards, 0.5rem en los bordes de inputs y títulos de card. Breakpoints activos: 768, 1024 y 1440px.

## Elevation & Depth

Sistema **planar reactivo**: las superficies son planas en reposo; la profundidad existe solo como respuesta al estado. Se transmite con luz (sombra blanca), zoom y blur, no con sombras ambientales permanentes.

- **Card al hover:** sombra `0 4px 24px rgba(255,255,255,.18)` (transición .4s) y el póster escala a 1.05 (transición .4s).
- **Hero al hover:** sombra `0 6px 30px rgba(255,255,255,.14)`.
- **Modal:** el backdrop de la película entra como fondo con `blur(8px) grayscale(.3)`, debajo de un overlay `rgba(0,0,0,.5)`; el `::backdrop` del dialog agrega `rgba(0,0,0,.55)` con `blur(5px)` para aislar la sala.
- **Glass:** los metadatos sobre el póster van sobre un overlay `rgba(0,0,0,.35)` con `blur(3px)`.
- **Entrada del hero:** un solo momento autoral — el fondo entra en cámara lenta (scale 1.06→1, 1.1s) y el contenido asciende (.9s). Todo el movimiento respeta `prefers-reduced-motion`.

### Named Rules
**The Flat-By-Default Rule.** En reposo no hay sombras ni relieves. La profundidad es una respuesta, nunca un estado permanente: hover en cards, modal abierto, overlay de ficha.

## Shapes

Lenguaje de esquinas suaves y discretas: **5px** en inputs, select y botones (suficiente para sentirse táctil, no caricaturesco); **10px** en el modal; círculo completo (**50%**) para el botón de cerrar de 40px. No hay bordes visibles — la separación la hace el contraste negro/plata, no líneas (el `border: #fff` de controles solo fija color, sin grosor).

## Components

### Buttons
- **Shape:** esquinas suaves (5px), alto fijo de 2.5rem, label a 1.2rem en bold, transición de fondo .4s.
- **Primary (Buscar):** fondo Violeta Marquesina, texto blanco. Hover a Violeta Marquesina Profundo.
- **Secondary (Regresar):** fondo Verde Regresar, hover a verde profundo (rgb(1, 90, 1)).
- **Cerrar modal:** círculo (40px, 50%), fondo Rojo Cerrar (hover Rojo Cerrar Profundo), "X" blanca. Anclado arriba a la derecha del modal.

### Inputs / Select
- **Style:** alto 2.5rem, esquinas 5px, texto 1.2rem, padding-inline 0.5rem, fondo blanco.
- **Focus:** ring plano de 2px (offset 2px) en Violeta Marquesina sobre el fondo blanco; los botones usan ring blanco para contrastar sobre su fondo de color. Sin glows ni sombras.

### Cards
- **Corner Style:** rectas (sin radio); el póster llega a los bordes de la celda.
- **Background:** transparente; figura 2:3 con `object-fit: cover`, con máscara degradada hacia abajo.
- **Shadow Strategy:** solo al hover, ver The Flat-By-Default Rule.
- **Overlay:** Glass (rgba(0,0,0,.15), blur 2px) al pie, con título truncado (The One-Line Title Rule), año y géneros resaltados en Violeta Marquesina.
- **Valoración:** medidor de 5 estrellas proporcional a la escala 0–10 (ancho = valor ÷ 10 × 100%), violeta sobre estrellas vacías grises, con el valor numérico al lado (`.estrellas-num`). Sin valoración → "(Sin info)".
- **Internal Padding:** 0.5rem horizontal en el overlay.

### Navigation
- **Encabezado:** marca "Dale Play!" (Display 900) enlazada al home, logo circular a la izquierda, y el icono `search` de Material Symbols (2.1rem) como botón que alterna el formulario de búsqueda. En móvil el icono se adelanta (order -2) y el logo queda a la derecha.

### Estado / Avisos
- **Región `#aviso`:** tira de estado centrada (max 40rem) sobre Gris Ficha (rgba(80,80,80,.25)), radio 5px, texto Plata de Pantalla a 1.05rem con `aria-live="polite"`. Usada para cargas ("Cargando la sala…", "Buscando…") y errores con botón **Reintentar** (0.95rem). Los vacíos de búsqueda usan `.estado-vacio`: texto centrado a 1.1rem, "Probá otra palabra o mirá las tendencias".

### Hero de Portada
- **Fondo:** el `backdrop_path` de la película destacada en cartelera, `object-fit: cover`, bajo un velo con doble degradado (arriba y a la izquierda hacia transparente; abajo oscuro para el texto).
- **Contenido:** anclado abajo a la izquierda: título en Prata blanco (max 20ch), año · géneros en Violeta Marquesina, sinopsis en clamp de 3 líneas (max 60ch) y el CTA "Ver detalle" en píldora violeta.
- **Interacción:** toda la tarjeta es un `.card` con `data-id="P…"` → abre el mismo modal; `tabindex="0"`, `role="button"`, `aria-label` con el título.

### Signature Component: El Modal de Detalle
- **Fondo:** el `backdrop_path` de la película a pantalla, difuminado (blur 8px, grayscale .3) bajo un overlay oscuro (rgba(0,0,0,.5)) y el `::backdrop` del dialog (rgba(0,0,0,.55), blur 5px).
- **Contenido:** columna centrada (margen automático) con scroll interno para contenidos largos: título en Prata blanco, póster de la película o retrato del actor en marco 2:3 (`.poster-modal`, radio 10px, hairline `rgba(255,255,255,.14)` y sombra de overlay; solo se renderiza si existe imagen), sinopsis/biografía limitadas a 5 líneas con toggle "leer más… / leer menos…" (`.texto-ampliable` + `.leer-mas`) que aparece solo si hay excedente, metadatos con negritas en Violeta Marquesina sobre texto Plata (incluida la valoración como medidor de estrellas, igual que en las cards), el indicador de scroll (chevron ▼ anclado al borde inferior, `#indicador-scroll`) visible solo mientras el contenido desborde y no se esté al final del scroll, y el botón de cerrar circular (Rojo Cerrar). Cierra con la X (botón `type="button"`), click fuera del contenido o Esc.
- **Créditos:** listados `.creditos` (películas del actor y actores de la película) como filas interactivas planas (regla Flat-By-Default) que iluminan con `--bg-card-light` al hover/focus-within (radio 10px, transición `hover-fade`). Los enlaces `.enlace-credito` (`data-credito-id="P…/A…"`) en blanco, una línea con ellipsis, pasan a Violeta Marquesina al hover; el año de cada película va a `.8rem` (paso `anio`) en gris suave. Reutilizan el modal para abrir la ficha correspondiente.

## Do's and Don'ts

### Do:
- **Do** dejar que el póster domine cada card: fondo negro, overlay translúcido que nunca opaque el arte.
- **Do** usar Violeta Marquesina solo para acciones y títulos de marca; su rareza es el punto.
- **Do** truncar títulos de card a una línea con ellipsis.
- **Do** responder al hover con luz y movimiento contenidos: sombra blanca 3px + zoom 1.05 + transiciones de .4s.
- **Do** mantener la búsqueda de tres criterios (Titulo / Actor / Tendencias) siempre visible tras el icono `search`.

### Don't:
- **Don't** usar fondos claros o saturados que compitan con los pósters; la sala se apaga para que la película ilumine.
- **Don't** usar el Rojo Cartelera para acciones; es para encabezados de sección.
- **Don't** añadir bordes duros o sombras permanentes; la separación la dan el negro y la luz reactiva.
- **Don't** ampliar el verde más allá del botón "Regresar".
- **Don't** usar glows ni sombras de foco: el foco es un ring plano de 2px (violeta sobre fondos claros, blanco sobre botones).
