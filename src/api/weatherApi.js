const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';


export class WeatherApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'WeatherApiError';
    this.status = status;
  }
}

/**
 * @param {string} location
 * @param {number} days 
 * @returns {Promise<object>}
 */

export async function getForecast(location, days = 8) {
  if (!API_KEY) {
    throw new WeatherApiError(
      'Falta la API Key. Crea un archivo .env con VITE_WEATHER_API_KEY=tu_clave',
      0
    );
  }

  const url = new URL(`${BASE_URL}/forecast.json`);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('q', location);
  url.searchParams.set('days', String(days));
  url.searchParams.set('aqi', 'no');
  url.searchParams.set('alerts', 'no');
  url.searchParams.set('lang', 'es');

  let response;
  try {
    response = await fetch(url.toString());
  } catch (networkError) {
    throw new WeatherApiError('No se ha podido conectar con el servicio del tiempo.', 0);
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Error desconocido al consultar el tiempo.';
    throw new WeatherApiError(message, response.status);
  }

  return data;
}

/**
 * @param {string} query
 * @returns {Promise<Array<{name:string, region:string, country:string, lat:number, lon:number}>>}
 */
export async function searchLocations(query) {
  if (!API_KEY || !query || query.trim().length < 2) return [];

  const url = new URL(`${BASE_URL}/search.json`);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('q', query);
  url.searchParams.set('lang', 'es');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
