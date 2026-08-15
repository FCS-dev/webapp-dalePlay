# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Demo / portafolio de frontend. El usuario primario es quien evalúa la app: un reclutador, cliente o par técnico que busca una muestra limpia de trabajo frontend. Su tarea: abrir la app y descubrir películas en español sin fricción.

## Product Purpose

Permitir descubrir y explorar películas en español: navegar cartelera, próximos estrenos, populares y mejor calificadas, y buscar por título, actor/actriz o tendencias del día. Es una demo funcional sobre la API de TMDB, sin login ni personalización.

## Positioning

Descubrimiento de cine en español, simple y sin fricción, sobre la API cruda de TMDB: cuatro secciones "Top 10" curadas por defecto, tres criterios de búsqueda claros y detalle en un modal. No exige cuenta ni configurar nada.

## Operating Context

- Se ejecuta en local con un servidor de archivos estáticos (Live Server, puerto 5501); requiere `config.js` con la API key.
- Se publica en GitHub Pages mediante GitHub Actions en push a `main`; la key se inyecta desde el secret `TMDB_API_KEY` usando `config.example.js` como plantilla.
- `config.js` está en `.gitignore`; `config.example.js` es la fuente versionada.

## Capabilities and Constraints

- Búsqueda por tres criterios: título (`pelicula`), actor/actriz (`persona`) y tendencias del día (`tendencia`).
- Home por defecto con cuatro secciones "Top 10": En cartelera, Próximos Estrenos, Populares y Mejores Calificados.
- Modal de detalle: sinopsis, fecha de lanzamiento y géneros para películas; biografía, lugar y fecha de nacimiento para personas.
- Idioma de la API y de la UI: español (`es-ES`).
- Sin favoritos, historial, persistencia ni autenticación.
- Sujeto a los límites y disponibilidad de la API pública de TMDB.
- Plataforma web estática sin framework ni build.

## Brand Commitments

- Nombre: "Dale Play!".
- Logo: `assets/imgs/dalealplay-logo.png`, enlazado al home.
- UI en español.
- Deploy en GitHub Pages (repositorio `FCS-dev/webapp-dalePlay`).

## Evidence on Hand

- Datos reales en vivo de la API de TMDB (cartelera, tendencias, películas, personas).
- Assets: logo `dalealplay-logo.png` y placeholders de imagen (`no-image-placeholder.png`, `no_image_available.png`, `no-image.webp`).
- Sin testimonios, casos de estudio, prensa ni datos propios de audiencia; no fabricar.

## Product Principles

1. **La demo es el producto.** El código y la UI deben sostenerse por sí solos ante quien evalúa el portafolio.
2. **Cine en español, sin fricción.** Buscar y descubrir debe ser inmediato, sin cuenta ni configuración.
3. **La API cruda no es la experiencia.** Curar y simplificar (top 10, tres criterios, modal) supera mostrar datos en bruto.
4. **Sencillez estructural.** Un HTML, un CSS, un JS; cualquier adición debe justificarse frente a la simplicidad actual.
5. **Lo público no falla.** El manejo de errores y de datos faltantes de la API debe estar siempre presente.
