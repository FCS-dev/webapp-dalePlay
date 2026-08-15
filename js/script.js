import {
  API_KEY,
  BASE_URL,
  IMG_URL,
  GENEROS_PELICULAS_URL,
  API_PELI_POPULAR,
  API_PELI_NOW_PLAYING,
  API_PELI_TOP_RATED,
  API_PELI_UPCOMING,
  API_PELI_ID,
  API_ACTOR_ID,
  API_LANGUAGE,
} from "../config.js";

// elementos del HTML para definir la busqueda
const formulario = document.querySelector("#formulario");
const inputTexto = document.querySelector("#texto");
const selectTipo = document.querySelector("#tipo");
const btnRegresar = document.querySelector("#regresar");
const divContenedor = document.querySelector("#principal");
const btnBuscar = document.querySelector("#btn-buscar");
const miModal = document.querySelector("#mi-modal");

let ultimaCardFoco = null;

// Cache de las cuatro secciones del home para no re-pedir la API en cada vuelta.
const cacheBienvenida = {};

const todosLosGeneros = (await getTotalDeGeneros()) ?? [];

// Anular evento submit
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  realizarBusqueda();
});

divContenedor.innerHTML = "";
await genCardsBienvenida(divContenedor);

// Abre/cierra el buscador; al abrirlo enfoca el campo
btnBuscar.addEventListener("click", async () => {
  limpiarAviso();
  formulario.reset();
  formulario.classList.toggle("novisible");
  btnBuscar.setAttribute(
    "aria-expanded",
    String(!formulario.classList.contains("novisible")),
  );
  divContenedor.innerHTML = "";
  if (formulario.classList.contains("novisible")) {
    await genCardsBienvenida(divContenedor);
  } else {
    inputTexto.focus();
  }
});

// "Tendencias hoy" no necesita texto: deshabilita el campo
selectTipo.addEventListener("change", () => {
  const esTendencia = selectTipo.value === "tendencia";
  inputTexto.disabled = esTendencia;
  inputTexto.placeholder = esTendencia
    ? "Se buscan las tendencias del día"
    : "Escribí un título o un actor";
});

// Regresar a la pantalla principal
btnRegresar.addEventListener("click", async () => {
  limpiarAviso();
  formulario.reset();
  formulario.classList.add("novisible");
  btnBuscar.setAttribute("aria-expanded", "false");
  divContenedor.innerHTML = "";
  await genCardsBienvenida(divContenedor);
});

// Restaura el foco a la card que abrió el modal al cerrarlo
miModal.addEventListener("close", () => {
  if (ultimaCardFoco) ultimaCardFoco.focus();
});

// Cierra el modal con la "X" o al hacer click fuera del contenido
miModal.addEventListener("click", (e) => {
  const enCerrar = e.target.closest("#btn-cerrar-modal");
  const dentro = e.target.closest("#contenido-modal");
  if (enCerrar || !dentro) {
    miModal.close();
  }
});

// Abre la ficha de una película o actor desde los listados de créditos
miModal.addEventListener("click", (e) => {
  const enlace = e.target.closest(".enlace-credito");
  if (!enlace) return;
  e.preventDefault();
  genModal(enlace.dataset.creditoId);
});

// Abre el detalle con teclado (Enter/Espacio) desde una card
divContenedor.addEventListener("keydown", (e) => {
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.classList.contains("card")
  ) {
    e.preventDefault();
    e.target.click();
  }
});

// Escuchador para empezar al filtrar
async function realizarBusqueda() {
  const criterio = selectTipo.value;
  const textoABuscar = inputTexto.value.trim().toLowerCase();

  if (criterio !== "tendencia") {
    if (!textoABuscar) {
      mostrarAviso("Escribe un título o un actor para buscar.");
      return;
    }
  } else {
    inputTexto.value = "";
  }

  const url = criteriaDisponible(criterio, textoABuscar);
  if (url === null) return;

  mostrarAviso("Buscando…");
  const data = await getDatos(url);
  if (data === null) {
    mostrarAviso("No se pudo conectar con TMDB. Revisa tu conexión.", {
      retry: () => realizarBusqueda(),
    });
    return;
  }

  divContenedor.innerHTML = "";
  limpiarAviso();

  const div_filtro = document.createElement("div");
  const h2_filtro = document.createElement("h2");
  div_filtro.classList.add("contenedor");
  const env_filtro = envolverCarrusel(div_filtro);

  if (criterio !== "tendencia") {
    const total = data.total_results ?? data.results?.length ?? 0;
    h2_filtro.classList.add("estado-busqueda");
    h2_filtro.textContent =
      total > 0
        ? `Resultados para «${textoABuscar}» (${total})`
        : `Sin resultados para «${textoABuscar}»`;
  } else {
    h2_filtro.textContent = "Hoy, son tendencia:";
  }

  divContenedor.appendChild(h2_filtro);
  divContenedor.appendChild(env_filtro);

  if (data.results?.length > 0) {
    genCards(div_filtro, criterio, data.results);
    actualizarFlechas(div_filtro);
  } else {
    env_filtro.classList.add("novisible");
    const vacio = document.createElement("div");
    vacio.classList.add("estado-vacio");
    if (criterio === "tendencia") {
      vacio.innerHTML = `
            <p>Hoy no hay tendencias para mostrar.</p>
            <p>Prueba de nuevo más tarde.</p>`;
    } else {
      const tipo = criterio === "pelicula" ? "películas" : "personas";
      vacio.innerHTML = `
            <p>No encontramos ${tipo} con «${escapeHTML(textoABuscar)}».</p>
            <p>Prueba otra palabra o mira las tendencias del día.</p>`;
    }
    divContenedor.appendChild(vacio);
  }
}

// Añadiendo evento para mostrar info adicional con ventana modal
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card");

  if (card) {
    ultimaCardFoco = card;
    genModal(card.dataset.id);
  }
});

// Flechas ‹/› de los carruseles: desplazan el track una card por vez
divContenedor.addEventListener("click", (e) => {
  const btn = e.target.closest(".carrusel-btn");
  if (!btn) return;
  const track = btn.closest(".carrusel")?.querySelector(".contenedor");
  if (!track) return;
  const tarjeta = track.querySelector(".card");
  const anchoPaso = tarjeta
    ? tarjeta.getBoundingClientRect().width +
      (parseFloat(getComputedStyle(track).columnGap) || 0)
    : 320;
  const reducirMovimiento = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const direccion = btn.classList.contains("prev") ? -1 : 1;
  track.scrollBy({
    left: direccion * anchoPaso,
    behavior: reducirMovimiento ? "auto" : "smooth",
  });
});

// El enlace "Buscar" del footer abre (o enfoca) el formulario de búsqueda
document.querySelector("#pie-buscar")?.addEventListener("click", (e) => {
  e.preventDefault();
  if (formulario.classList.contains("novisible")) btnBuscar.click();
  inputTexto.focus();
});

// -------
// Funciones
// -------

/**
 * Escapa caracteres HTML para evitar inyección XSS en innerHTML.
 * @param {*} valor - Valor a escapar.
 * @returns {String} Cadena segura para insertar en HTML.
 */
function escapeHTML(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (caracter) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caracter],
  );
}

/**
 * Arma un medidor de 5 estrellas proporcional a la valoración (escala 0-10).
 * @param {String} valoracion Valor numérico (ej. "7.8") o "(Sin info)".
 * @returns {String} HTML del medidor con estrellas + número, o el texto "(Sin info)".
 */
function medidorEstrellas(valoracion) {
  const numero = parseFloat(valoracion);
  if (!Number.isFinite(numero) || numero <= 0) {
    return "(Sin info)";
  }
  const porcentaje = Math.min(100, Math.max(0, (numero / 10) * 100));
  return `
            <span class="estrellas" role="img" aria-label="Valoración ${escapeHTML(valoracion)} de 10">
              <span class="estrellas-fondo" aria-hidden="true">★★★★★</span>
              <span class="estrellas-llenas" aria-hidden="true" style="width:${porcentaje}%">★★★★★</span>
            </span>
            <span class="estrellas-num" aria-hidden="true">${escapeHTML(valoracion)}</span>`;
}

/**
 * Ordena créditos por fecha de lanzamiento ascendente; sin fecha al comienzo.
 * @param {Array} lista - Arreglo de objetos (p.ej. movie_credits.cast).
 * @returns {Array} Copia ordenada (no muta el original).
 */
function ordenarPorFechaLanzamiento(lista) {
  return [...(lista ?? [])].sort((a, b) => {
    const fa = a.release_date ?? "";
    const fb = b.release_date ?? "";
    if (!fa && !fb) return 0;
    if (!fa) return -1;
    if (!fb) return 1;
    return fa.localeCompare(fb);
  });
}

/**
 * Agrega el toggle "leer más… / leer menos…" a sinopsis y biografías del modal
 * que superen 5 líneas. Solo aparece el botón si hay contenido excedente.
 */
function prepararLeerMas() {
  miModal.querySelectorAll(".leer-mas").forEach((b) => b.remove());
  miModal.querySelectorAll(".sinopsis, .biografia").forEach((parrafo) => {
    const yaAmpliable = parrafo.dataset.ampliable === "true";
    const expandido = parrafo.classList.contains("completo");
    if (!yaAmpliable) {
      if (parrafo.scrollHeight <= parrafo.clientHeight) return;
      parrafo.dataset.ampliable = "true";
    }
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "leer-mas";
    boton.textContent = expandido ? "leer menos…" : "leer más…";
    boton.setAttribute("aria-expanded", String(expandido));
    boton.addEventListener("click", () => {
      const ahoraExpandido = parrafo.classList.toggle("completo");
      boton.textContent = ahoraExpandido ? "leer menos…" : "leer más…";
      boton.setAttribute("aria-expanded", String(ahoraExpandido));
      actualizarIndicadorScroll();
    });
    parrafo.insertAdjacentElement("afterend", boton);
  });
}

/**
 * Muestra u oculta el indicador de scroll del modal: visible solo cuando el
 * contenido desborda y no se ha llegado al final del scroll.
 */
function actualizarIndicadorScroll() {
  const contenido = miModal.querySelector("#contenido-modal");
  const indicador = miModal.querySelector("#indicador-scroll");
  if (!contenido || !indicador) return;
  const conOverflow = contenido.scrollHeight > contenido.clientHeight + 1;
  const alFinal =
    contenido.scrollTop + contenido.clientHeight >= contenido.scrollHeight - 8;
  indicador.classList.toggle("novisible", !(conOverflow && !alFinal));
}

/**
 * Prepara el indicador de scroll (chevron) dentro del modal: lo crea la primera
 * vez, escucha el scroll del contenedor y lo re-evalúa al cargar el póster.
 */
function prepararIndicadorScroll() {
  const contenido = miModal.querySelector("#contenido-modal");
  if (!contenido) return;

  let indicador = miModal.querySelector("#indicador-scroll");
  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "indicador-scroll";
    indicador.className = "novisible";
    indicador.setAttribute("aria-hidden", "true");
    indicador.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    miModal.append(indicador);
  }

  contenido.addEventListener("scroll", actualizarIndicadorScroll, {
    passive: true,
  });
  actualizarIndicadorScroll();

  const img = contenido.querySelector(".poster-modal");
  if (img) {
    if (img.complete) {
      actualizarIndicadorScroll();
    } else {
      img.addEventListener("load", actualizarIndicadorScroll);
    }
  }
}

/**
 * Muestra un mensaje de estado en la región #aviso (aria-live).
 * @param {String} mensaje Texto a mostrar.
 * @param {Object} opciones Opcional: { retry: Function } agrega un botón "Reintentar".
 */
function mostrarAviso(mensaje, opciones = {}) {
  const aviso = document.querySelector("#aviso");
  if (!aviso) return;
  const retry = opciones.retry
    ? `<button type="button" id="btn-reintentar">Reintentar</button>`
    : "";
  aviso.innerHTML = `<span>${escapeHTML(mensaje)}</span>${retry}`;
  aviso.classList.remove("novisible");
  const btn = aviso.querySelector("#btn-reintentar");
  if (btn && opciones.retry) btn.addEventListener("click", opciones.retry);
}

/**
 * Oculta y limpia la región de avisos.
 */
function limpiarAviso() {
  const aviso = document.querySelector("#aviso");
  if (!aviso) return;
  aviso.innerHTML = "";
  aviso.classList.add("novisible");
}

/**
 * getDatos con cache por clave.
 * @param {String} url URL a pedir.
 * @param {String} clave Identificador de cache.
 * @returns {Promise<Object|null>} Datos o null si la API falló.
 */
async function getDatosCacheado(url, clave) {
  if (cacheBienvenida[clave]) return cacheBienvenida[clave];
  const data = await getDatos(url);
  if (data) cacheBienvenida[clave] = data;
  return data;
}

/**
 *
 * @param {String} criteria Cadena de texto que contiene el criterio de busqueda solicitado por el usuario.
 * @param {String} texto Cadena de texto a buscar.
 * @returns {String} URL armado para utilizar segun el criterio y constantes de la API. Si no encuentra el criterio, devuelve null.
 */
const criteriaDisponible = (criteria, texto) => {
  const opciones = {
    pelicula: `${BASE_URL}/search/movie?api_key=${API_KEY}&${API_LANGUAGE}&query=${texto}`,
    persona: `${BASE_URL}/search/person?api_key=${API_KEY}&${API_LANGUAGE}&query=${texto}`,
    tendencia: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&${API_LANGUAGE}`,
  };

  if (!Object.keys(opciones).includes(criteria)) {
    mostrarAviso("No se reconoce ese criterio de búsqueda.");
    return null;
  }
  return opciones[criteria] ? opciones[criteria] : null;
};

/**
 * Envuelve un track de cards en un carrusel con flechas ‹/› y accesibilidad.
 * @param {HTMLElement} track - El contenedor con las cards.
 * @returns {HTMLElement} La envoltura .carrusel.
 */
function envolverCarrusel(track) {
  const env = document.createElement("div");
  env.className = "carrusel";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "carrusel-btn prev";
  prev.setAttribute("aria-label", "Ver anteriores");
  prev.textContent = "‹";

  const next = document.createElement("button");
  next.type = "button";
  next.className = "carrusel-btn next";
  next.setAttribute("aria-label", "Ver siguientes");
  next.textContent = "›";

  track.setAttribute("tabindex", "0");
  track.setAttribute("role", "region");
  track.setAttribute("aria-label", "Carrusel de películas");
  track.addEventListener("scroll", () => actualizarFlechas(track), {
    passive: true,
  });

  env.appendChild(prev);
  env.appendChild(track);
  env.appendChild(next);
  return env;
}

/**
 * Habilita/deshabilita las flechas según dónde esté el scroll del track.
 * @param {HTMLElement} track - El track del carrusel.
 */
function actualizarFlechas(track) {
  const env = track.closest(".carrusel");
  const prev = env?.querySelector(".carrusel-btn.prev");
  const next = env?.querySelector(".carrusel-btn.next");
  if (prev) prev.disabled = track.scrollLeft <= 1;
  if (next)
    next.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
}

/**
 * Función para recorrer el arreglo, leer datos requeridos, generar cards y devolver el contenedor lleno.
 * @param {HTMLElement} gallery - Contenedor donde se insertarán los cards
 * @param {String} criteria - Indica el tipo de criterio seleccionado
 * @param {Array} arreglo - Arreglo dew objetos. Para sacar los datos a usarse
 * @returns {HTMLElement} Contenedor con la data añadida
 */
function genCards(gallery, criterio, arreglo) {
  const fragment = document.createDocumentFragment();
  if (["pelicula", "tendencia"].includes(criterio)) {
    arreglo.forEach((peli) => fragment.appendChild(buildCardPelicula(peli)));
    gallery.appendChild(fragment);
  } else if (criterio === "persona") {
    arreglo.forEach((actor) => fragment.appendChild(buildCardPersona(actor)));
    gallery.appendChild(fragment);
  }
}

/**
 * Arma el "card" correspondiente a la pelicula
 * @param {Object} peli JSON con los datos para crear el card de la pelicula
 * @param {Number} posicion Opcional: puesto en la sección "Top 10" (1-10). Sin puesto, no se pinta rank.
 * @returns {HTMLElement} <div> con el card con datos
 */
function buildCardPelicula(peli, posicion = 0) {
  const card = document.createElement("div");
  card.setAttribute("data-id", "P" + peli.id);
  card.classList.add("card");
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  const titulo = peli.title || peli.original_title || "";
  card.setAttribute("aria-label", `Ver detalle de ${titulo}`);
  const urlImagen = peli.poster_path
    ? `${IMG_URL}${peli.poster_path}`
    : `./assets/imgs/no-image-placeholder.png`;
  const anyo = `${peli.release_date ? peli.release_date.trim().slice(0, 4) : "(Sin info)"}`;
  const listaDeGeneros = `${getGeneros(peli.genre_ids)}`;
  const valoracion = `${peli.vote_average?.toFixed(1) || "(Sin info)"}`;
  const rank =
    posicion > 0
      ? `<span class="rank" aria-hidden="true">${String(posicion).padStart(2, "0")}</span>`
      : "";
  card.innerHTML = `
            ${rank}
            <figure>
                <img src="${urlImagen}" alt="${escapeHTML(titulo)}">
            </figure>
            <div class="glass">
            <h3>${escapeHTML(titulo)}</h3>
                <p><strong>Año: </strong>${escapeHTML(anyo)}</p>
                <p><strong>Géneros: </strong>${escapeHTML(listaDeGeneros)}</p>
                <p><strong>Valoración: </strong>${medidorEstrellas(valoracion)}</p>
            </div>
`;
  return card;
}

/**
 * Arma el hero de portada con la película destacada en cartelera.
 * @param {Object} lista Respuesta de "now_playing" de TMDB.
 * @returns {HTMLElement|null} <article> con el hero, o null si no hay backdrop disponible.
 */
function buildHero(lista) {
  const peli = (lista?.results ?? []).find((item) => item.backdrop_path);
  if (!peli) return null;

  const hero = document.createElement("article");
  hero.className = "card hero";
  hero.setAttribute("data-id", "P" + peli.id);
  hero.setAttribute("tabindex", "0");
  hero.setAttribute("role", "button");

  const titulo = peli.title || peli.original_title || "";
  hero.setAttribute("aria-label", `Ver detalle de ${titulo}`);

  const anyo = peli.release_date ? peli.release_date.trim().slice(0, 4) : "";
  const generos = getGeneros(peli.genre_ids);
  const meta = [anyo, generos].filter(Boolean).join(" · ");
  const sinopsis = peli.overview
    ? `<p class="hero-sinopsis">${escapeHTML(peli.overview)}</p>`
    : "";

  hero.innerHTML = `
            <img class="hero-fondo" src="${IMG_URL}${peli.backdrop_path}" alt="" aria-hidden="true">
            <div class="hero-velo" aria-hidden="true"></div>
            <div class="hero-contenido">
                <h2 class="hero-titulo">${escapeHTML(titulo)}</h2>
                ${meta ? `<p class="hero-meta">${escapeHTML(meta)}</p>` : ""}
                ${sinopsis}
                <span class="hero-cta">Ver detalle</span>
            </div>
`;
  return hero;
}

/**
 * Arma el "card" correspondiente a la pelicula
 * @param {Object} peli JSON con los datos para crear el card de la pelicula
 * @returns {HTMLElement} <div> con el card con datos
 */
function buildCardPersona(actor) {
  const card = document.createElement("div");
  card.setAttribute("data-id", "A" + actor.id);
  card.classList.add("card");
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  const nombrePersona = `${actor.name}`;
  card.setAttribute("aria-label", `Ver perfil de ${nombrePersona}`);
  const urlImagen = actor.profile_path
    ? `${IMG_URL}${actor.profile_path}`
    : `./assets/imgs/no-image-placeholder.png`;
  card.innerHTML = `
            <figure>
                <img src="${urlImagen}" alt="${escapeHTML(nombrePersona)}">
            </figure>
            <div class="glass">
            <h3>${escapeHTML(nombrePersona)}</h3>
            </div>
`;
  return card;
}

/**
 * Devuelve todo el objeto de la API.
 * @param {String} url Cadena de texto que tiene la URL -construida- para poder llamar a la API
 * @returns {Object} Devuelve el objeto completo que se trae desde la API. Si hay error, devuelve null
 */
async function getDatos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Algo salio al cargar las peliculas... ${error}`);
    return null;
  }
}

/**
 * Obtener lista total de géneros de la API
 * @returns {Array} Lista de los géneros. "null" si no se encuentra la información
 */
async function getTotalDeGeneros() {
  try {
    const response = await fetch(GENEROS_PELICULAS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(`Algo salio mal al cargar los generos... ${error}`);
    return null;
  }
}

/**
 * Obtener la clasificación  de géneros de la película.
 * @param {Array} lista de los géneros a buscar
 * @returns {String} Listado de la clasificación de géneros propios de la película, como una sola cadena de texto.
 */
function getGeneros(lista) {
  if (Array.isArray(lista) && lista.length > 0 && todosLosGeneros.length > 0) {
    let listado = [];
    lista.forEach((item) => {
      const nombreDelGenero =
        todosLosGeneros
          .find((elemento) => elemento.id === item)
          ?.name?.trim() ?? "";
      if (nombreDelGenero) {
        listado.push(nombreDelGenero);
      }
    });
    return listado.length > 0 ? listado.join(", ") : "";
  }
  return "";
}

/**
 * Función que lee los datos, genera los contenedores y los cards de la pantalla de bienvenida (por defecto).
 * @param {HTMLElement} gallery - Contenedor donde se insertarán los divs y cards
 */
async function genCardsBienvenida(gallery) {
  const fragment = document.createDocumentFragment();

  mostrarAviso("Cargando la sala…");

  const [listaNowPlaying, listaUpcomings, listaPopulares, listaTopRated] =
    await Promise.all([
      getDatosCacheado(API_PELI_NOW_PLAYING, "now_playing"),
      getDatosCacheado(API_PELI_UPCOMING, "upcoming"),
      getDatosCacheado(API_PELI_POPULAR, "popular"),
      getDatosCacheado(API_PELI_TOP_RATED, "top_rated"),
    ]);

  if (
    !listaNowPlaying &&
    !listaUpcomings &&
    !listaPopulares &&
    !listaTopRated
  ) {
    mostrarAviso("No se pudo cargar la cartelera. Revisa tu conexión.", {
      retry: () => genCardsBienvenida(gallery),
    });
    return;
  }

  const hero = buildHero(listaNowPlaying);
  if (hero) fragment.appendChild(hero);

  const secciones = [
    { titulo: "Top 10 · En cartelera", lista: listaNowPlaying },
    { titulo: "Top 10 · Próximos Estrenos", lista: listaUpcomings },
    { titulo: "Top 10 · Populares", lista: listaPopulares },
    { titulo: "Top 10 · Mejores Calificados", lista: listaTopRated },
  ];

  const tracks = [];
  secciones.forEach(({ titulo, lista }) => {
    if (!lista?.results?.length) return;
    const h2 = document.createElement("h2");
    h2.textContent = titulo;
    h2.classList.add("seccion");
    const div = document.createElement("div");
    div.classList.add("contenedor");
    const env = envolverCarrusel(div);
    tracks.push(div);

    fragment.appendChild(h2);
    fragment.appendChild(env);

    if (lista?.results?.length > 0) {
      lista.results.slice(0, 10).forEach((peli, i) => {
        div.appendChild(buildCardPelicula(peli, i + 1));
      });
    }
  });

  gallery.innerHTML = "";
  gallery.appendChild(fragment);
  tracks.forEach((track) => actualizarFlechas(track));
  limpiarAviso();
}

/**
 * Actualiza innerHTML del contenedor modal; tanto para peliculas como para actor/actriz
 *
 * @param {String} id Axxxx / Pxxxx Donde la primera letra indica si es "A"ctor/"A"ctriz o "P"elícula.
 * El id corresponde al identificador dado por la API.
 */
async function genModal(id) {
  const tipo = id[0].toUpperCase();
  const idBuscado = id.slice(1);

  if (tipo === "A") {
    const ficha = await getActor(idBuscado);
    if (!ficha) {
      mostrarAviso("No se pudo cargar la información del actor/actriz.", {
        retry: () => genModal(id),
      });
      return;
    }

    const urlImgFondo = ficha.profile_path
      ? `${IMG_URL}${ficha.profile_path}`
      : "";
    miModal.style.setProperty(
      "--backdrop",
      urlImgFondo ? `url(${urlImgFondo})` : "none",
    );

    const urlPoster = ficha.profile_path
      ? `${IMG_URL}${ficha.profile_path}`
      : "";

    const peliculas = ordenarPorFechaLanzamiento(ficha.movie_credits?.cast);

    miModal.innerHTML = `
            <button id="btn-cerrar-modal" type="button" aria-label="Cerrar">X</button>
            <div id="contenido-modal">
            <h2 id="titulo-modal">${escapeHTML(ficha.name)}</h2>
            ${urlPoster ? `<img class="poster-modal" src="${urlPoster}" alt="${escapeHTML(ficha.name)}">` : ""}
            <p><strong>Biografía:</strong></p>
            <div class="texto-ampliable"><p class="biografia">${escapeHTML(ficha.biography) || "(Sin datos para mostrar)"}</p></div>
            <p><strong>Lugar de Nacimiento:</strong></p>
             <p>${escapeHTML(ficha.place_of_birth) || "(Sin datos para mostrar)"}</p>
             <p><strong>Fecha de Nacimiento:</strong></p>
             <p>${escapeHTML(ficha.birthday) || "(Sin datos para mostrar)"}</p>
             <p><strong>Películas:</strong></p>
             <ul class="creditos">${peliculas.map((p) => `<li><a href="#" class="enlace-credito" data-credito-id="P${p.id}" title="${escapeHTML(p.title)}">${escapeHTML(p.title)}</a> <span class="credito-anio">${escapeHTML(p.release_date)}</span></li>`).join("") || "(Sin datos para mostrar)"}</ul>
        </div>
            `;
    if (miModal.open) {
      miModal.focus();
    } else {
      miModal.showModal();
    }
    prepararLeerMas();
    prepararIndicadorScroll();
  } else if (tipo === "P") {
    const ficha = await getPelicula(idBuscado);
    if (!ficha) {
      mostrarAviso("No se pudo cargar la información de la película.", {
        retry: () => genModal(id),
      });
      return;
    }
    const titulo = ficha.title || ficha.original_title || "";
    const valoracion = ficha.vote_average
      ? ficha.vote_average.toFixed(1)
      : "(Sin info)";
    const descripGeneros = (ficha.genres ?? []).map((g) => g.name).join(", ");

    const urlImgFondo = ficha.backdrop_path
      ? `${IMG_URL}${ficha.backdrop_path}`
      : "";
    miModal.style.setProperty(
      "--backdrop",
      urlImgFondo ? `url(${urlImgFondo})` : "none",
    );

    const urlPoster = ficha.poster_path ? `${IMG_URL}${ficha.poster_path}` : "";

    miModal.innerHTML = `
            <button id="btn-cerrar-modal" type="button" aria-label="Cerrar">X</button>
            <div id="contenido-modal">
            <h2 id="titulo-modal">${escapeHTML(titulo)}</h2>
            ${urlPoster ? `<img class="poster-modal" src="${urlPoster}" alt="${escapeHTML(titulo)}">` : ""}
            <p><strong>Sinópsis:</strong></p>
            <div class="texto-ampliable"><p class="sinopsis">${escapeHTML(ficha.overview)}</p></div>
            <p><strong>Fecha Lanzamiento: </strong>${escapeHTML(ficha.release_date)}</p>
            <p><strong>Valoración: </strong>${medidorEstrellas(valoracion)}</p>
             <p><strong>Géneros: </strong>${escapeHTML(descripGeneros)}</p>
             <p><strong>Actores:</strong></p>
             <ul class="creditos">${ficha.credits?.cast?.map((p) => `<li><a href="#" class="enlace-credito" data-credito-id="A${p.id}" title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</a> <span class="credito-anio">${escapeHTML(p.character)}</span></li>`).join("") || "(Sin datos para mostrar)"}</ul>
        </div>
            `;
    if (miModal.open) {
      miModal.focus();
    } else {
      miModal.showModal();
    }
    prepararLeerMas();
    prepararIndicadorScroll();
  } else {
    mostrarAviso("No se reconoce el elemento seleccionado.");
    return;
  }
  document.fonts?.ready?.then(() => {
    prepararLeerMas();
    prepararIndicadorScroll();
  });
}

/**
 * Petición asincrona de la info de película, según el idPelicula solicitado.
 * @param {String} idPelicula
 * @returns {Object} info de la película. Si sucede error, devuelve null.
 */
async function getPelicula(idPelicula) {
  const url = `${API_PELI_ID}${idPelicula}?append_to_response=credits&api_key=${API_KEY}&${API_LANGUAGE}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Algo salio mal al cargar la película ${idPelicula}... ${error}`,
    );
    return null;
  }
}

/**
 * Petición asincrona de la info del actor, según el idActor solicitado.
 * @param {String} idActor
 * @returns {Object} info del actor. Si sucede error, devuelve null.
 */
async function getActor(idActor) {
  const url = `${API_ACTOR_ID}${idActor}?api_key=${API_KEY}&${API_LANGUAGE}&append_to_response=movie_credits`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Algo salio mal al cargar el actor ${idActor}... ${error}`);
    return null;
  }
}
