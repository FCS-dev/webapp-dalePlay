// Copia este archivo como config.js y reemplaza TU_API_KEY con tu clave real.
export const API_KEY = "TU_API_KEY";

export const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_URL = "https://image.tmdb.org/t/p/w500";

export const GENEROS_PELICULAS_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;

export const API_PELI_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES`;
export const API_PELI_TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es-ES`;
export const API_PELI_NOW_PLAYING = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES`;
export const API_PELI_UPCOMING = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=es-ES`;

export const API_PELI_ID = `https://api.themoviedb.org/3/movie/`;
export const API_ACTOR_ID = `https://api.themoviedb.org/3/person/`;
