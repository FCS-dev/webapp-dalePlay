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
} from "../config.js";

// elementos del HTML para definir la busqueda
const formulario = document.querySelector("#formulario");
const inputTexto = document.querySelector("#texto");
const selectTipo = document.querySelector("#tipo");
const btnRegresar = document.querySelector("#regresar");
const divContenedor = document.querySelector("#principal");
const menu = document.querySelector(".material-symbols-outlined");

const todosLosGeneros = (await getTotalDeGeneros()) ?? [];

// Anular evento submit
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  realizarBusqueda();
});

divContenedor.innerHTML = "";
await genCardsBienvenida(divContenedor);

// Escuchador para abrir menu + limpiar pantalla y para ocultar formulario + mostrar Binvenida
menu.addEventListener("click", async () => {
  formulario.reset();
  formulario.classList.toggle("novisible");
  divContenedor.innerHTML = "";
  if (formulario.classList.contains("novisible")) {
    await genCardsBienvenida(divContenedor);
  }
});

// Escuchador para regresar a la pantalla principal
btnRegresar.addEventListener("click", async () => {
  formulario.reset();
  formulario.classList.add("novisible");
  divContenedor.innerHTML = "";
  await genCardsBienvenida(divContenedor);
});

// Escuchador para empezar al filtrar
async function realizarBusqueda() {
  const criterio = selectTipo.value;
  const textoABuscar = inputTexto.value.trim().toLowerCase();

  if (criterio !== "tendencia") {
    if (!textoABuscar) {
      alert("Defina el filtro para hacer la busqueda");
      return;
    }
  } else {
    inputTexto.value = "";
  }

  const url = criteriaDisponible(criterio, textoABuscar);
  if (url === null) return;

  const data = await getDatos(url);
  if (data === null) return;

  divContenedor.innerHTML = "";

  const div_filtro = document.createElement("div");
  const h2_filtro = document.createElement("h2");
  div_filtro.classList.add("contenedor");

  if (criterio !== "tendencia") {
    const cantidad = data.results?.length ?? 0;
    h2_filtro.textContent = `${criterio}: "${textoABuscar}" -> ${cantidad} resultados.`;
  } else {
    h2_filtro.textContent = `Hoy, son tendencia:`;
  }

  divContenedor.appendChild(h2_filtro);
  divContenedor.appendChild(div_filtro);

  if (data.results?.length > 0) {
    genCards(div_filtro, criterio, data.results);
  }
}

// Añadiendo evento para mostrar info adicional con ventana modal
document.addEventListener("click", (e) => {
  const elementoClickado = e.target;
  const card = elementoClickado.closest(".card");

  if (card) {
    const id = card.dataset.id;
    genModal(id);
  }
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
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[caracter]));
}

/**
 *
 * @param {String} criteria Cadena de texto que contiene el criterio de busqueda solicitado por el usuario.
 * @param {String} texto Cadena de texto a buscar.
 * @returns {String} URL armado para utilizar segun el criterio y constantes de la API. Si no encuentra el criterio, devuelve null.
 */
const criteriaDisponible = (criteria, texto) => {
  const opciones = {
    pelicula: `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${texto}`,
    persona: `${BASE_URL}/search/person?api_key=${API_KEY}&language=es-ES&query=${texto}`,
    tendencia: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=es-ES`,
  };

  if (!Object.keys(opciones).includes(criteria)) {
    alert("Criterio o la URL no esta definido(a)");
    return null;
  }
  return opciones[criteria] ? opciones[criteria] : null;
};

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
 * @returns {HTMLElement} <div> con el card con datos
 */
function buildCardPelicula(peli) {
  const card = document.createElement("div");
  card.setAttribute("data-id", "P" + peli.id);
  card.classList.add("card");
  const urlImagen = peli.poster_path
    ? `${IMG_URL}${peli.poster_path}`
    : `./assets/imgs/no-image-placeholder.png`;
  const tituloOriginal = `${peli.original_title}`;
  const anyo = `${peli.release_date ? peli.release_date.trim().slice(0, 4) : "(Sin info)"}`;
  const listaDeGeneros = `${getGeneros(peli.genre_ids)}`;
  card.innerHTML = `
            <figure>
                <img src="${urlImagen}" alt="${escapeHTML(tituloOriginal)}">
            </figure>
            <div class="glass">
            <h3>${escapeHTML(tituloOriginal)}</h3>
                <p><strong>Año: </strong>${escapeHTML(anyo)}</p>
                <strong>Géneros: </strong>${escapeHTML(listaDeGeneros)}
            </div>
`;
  return card;
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
  const urlImagen = actor.profile_path
    ? `${IMG_URL}${actor.profile_path}`
    : `./assets/imgs/no-image-placeholder.png`;
  const nombrePersona = `${actor.name}`;
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
    console.error(`Algo salio mal al los generos... ${error}`);
    return null;
  }
}

/**
 * Obtener la clasificación  de generos de la película.
 * @param {Array} lista de los generos a buscar
 * @returns {String} Listado de la clasificación de generos propios de la pelicula, como una sola cadena de texto.
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

  const listaPopulares = await getDatos(API_PELI_POPULAR);
  const listaTopRated = await getDatos(API_PELI_TOP_RATED);
  const listaNowPlaying = await getDatos(API_PELI_NOW_PLAYING);
  const listaUpcomings = await getDatos(API_PELI_UPCOMING);

  const secciones = [
    { titulo: "Top 10: En cartelera", lista: listaNowPlaying },
    { titulo: "Top 10: Próximos Estrenos", lista: listaUpcomings },
    { titulo: "Top 10: Populares", lista: listaPopulares },
    { titulo: "Top 10: Mejores Calificados", lista: listaTopRated },
  ];

  secciones.forEach(({ titulo, lista }) => {
    const h2 = document.createElement("h2");
    h2.textContent = titulo;
    const div = document.createElement("div");
    div.classList.add("contenedor");

    fragment.appendChild(h2);
    fragment.appendChild(div);

    if (lista?.results?.length > 0) {
      lista.results.slice(0, 10).forEach((peli) => {
        div.appendChild(buildCardPelicula(peli));
      });
    }
  });

  gallery.innerHTML = "";
  gallery.appendChild(fragment);
}

/**
 * Actualiza innerHTML del contenedor modal; tanto para peliculas como para actor/actriz
 *
 * @param {String} id Axxxx / Pxxxx Donde la primera letra indica si es "A"ctor/"A"ctriz o "P"elícula.
 * El id corresponde al identificador dado por la API.
 */
async function genModal(id) {
  const miModal = document.querySelector("#mi-modal");

  const tipo = id[0].toUpperCase();
  const idBuscado = id.slice(1);

  if (tipo === "A") {
    const ficha = await getActor(idBuscado);
    if (!ficha) {
      alert("No se pudo cargar la información del actor/actriz.");
      return;
    }

    const urlImgFondo = ficha.profile_path
      ? `${IMG_URL}${ficha.profile_path}`
      : "";
    if (urlImgFondo) {
      miModal.style.backgroundImage = `url(${urlImgFondo})`;
      miModal.style.backgroundSize = "cover";
      miModal.style.backgroundPosition = "center";
      miModal.style.backgroundRepeat = "no-repeat";
    } else {
      miModal.style.backgroundImage = "";
    }

    miModal.innerHTML = `
            <div id="contenido-modal">
            <h2>${escapeHTML(ficha.name)}</h2>
            <p><strong>Biografía:</strong></p>
            <p  class="biografia">${escapeHTML(ficha.biography) || "(Sin datos para mostrar)"}</p>
            <p><strong>Lugar de Nacimiento:</strong></p>
             <p>${escapeHTML(ficha.place_of_birth) || "(Sin datos para mostrar)"}</p>
             <p><strong>Fecha de Nacimiento:</strong></p>
             <p>${escapeHTML(ficha.birthday) || "(Sin datos para mostrar)"}</p>
            <form method="dialog">
                <button id="btn-cerrar-modal">X</button>
            </form>
        </div>
            `;
    miModal.showModal();
  } else if (tipo === "P") {
    const ficha = await getPelicula(idBuscado);
    if (!ficha) {
      alert("No se pudo cargar la información de la película.");
      return;
    }
    const descripGeneros = (ficha.genres ?? [])
      .map((g) => g.name)
      .join(", ");

    const urlImgFondo = ficha.backdrop_path
      ? `${IMG_URL}${ficha.backdrop_path}`
      : "";
    if (urlImgFondo) {
      miModal.style.backgroundImage = `url(${urlImgFondo})`;
      miModal.style.backgroundSize = "cover";
      miModal.style.backgroundPosition = "center";
      miModal.style.backgroundRepeat = "no-repeat";
    } else {
      miModal.style.backgroundImage = "";
    }

    miModal.innerHTML = `
            <div id="contenido-modal">
            <h2>${escapeHTML(ficha.original_title)}</h2>
            <p><strong>Sinópsis:</strong></p>
            <p class="sinopsis">${escapeHTML(ficha.overview)}</p>
            <p><strong>Fecha Lanzamiento: </strong>${escapeHTML(ficha.release_date)}</p>
             <p><strong>Géneros: </strong>${escapeHTML(descripGeneros)}</p>
            <form method="dialog">
                <button id="btn-cerrar-modal">X</button>
            </form>
        </div>
            `;
    miModal.showModal();
  } else {
    alert("data-id desconocido");
    return;
  }
}

/**
 * Petición asincrona de la info de pelicula, según el idPelicula solicitado.
 * @param {String} idPelicula
 * @returns {Object} info de la pelicula. Si sucede error, devuelve null.
 */
async function getPelicula(idPelicula) {
  const url = `${API_PELI_ID}${idPelicula}?api_key=${API_KEY}&language=es-ES`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Algo salio al cargar la pelicula ${idPelicula}... ${error}`);
    return null;
  }
}

/**
 * Petición asincrona de la info del actor, según el idActor solicitado.
 * @param {String} idActor
 * @returns {Object} info del actor. Si sucede error, devuelve null.
 */
async function getActor(idActor) {
  const url = `${API_ACTOR_ID}${idActor}?api_key=${API_KEY}&language=es-ES`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Algo salio al cargar la pelicula ${idActor}... ${error}`);
    return null;
  }
}
