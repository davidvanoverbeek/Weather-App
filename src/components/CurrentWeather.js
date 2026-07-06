import { round, dayProgress } from '../utils/helpers.js';

/**
 * @returns {{ el: HTMLElement, update: (data: object) => void, showLoading: () => void, showError: (msg: string) => void }}
 */
export function createCurrentWeather() {
  const el = document.createElement('section');
  el.className = 'current-weather';
  el.innerHTML = `<div class="current-weather__skeleton">Cargando previsión…</div>`;

  function showLoading() {
    el.innerHTML = `<div class="current-weather__skeleton">Consultando la atmósfera…</div>`;
  }

  function showError(message) {
    el.innerHTML = `
      <div class="current-weather__error">
        <p class="current-weather__error-title">No se ha podido leer el cielo</p>
        <p class="current-weather__error-msg">${message}</p>
      </div>`;
  }

  function update(forecastData) {
    const { location, current, forecast } = forecastData;
    const today = forecast.forecastday[0];
    const progress = dayProgress(today.astro.sunrise, today.astro.sunset);

    el.innerHTML = `
      <div class="current-weather__top">
        <div>
          <p class="current-weather__place">${location.name}${
      location.region ? ', ' + location.region : ''
    }</p>
          <p class="current-weather__country">${location.country}</p>
        </div>
        <img
          class="current-weather__icon"
          src="https:${current.condition.icon}"
          alt="${current.condition.text}"
          width="80"
          height="80"
        />
      </div>

      <div class="current-weather__main">
        <span class="current-weather__temp">${round(current.temp_c)}°</span>
        <div class="current-weather__meta">
          <p class="current-weather__condition">${current.condition.text}</p>
          <p class="current-weather__feels">Sensación de ${round(current.feelslike_c)}°</p>
        </div>
      </div>

      <div class="sky-strip" title="Recorrido del sol de hoy">
        <div class="sky-strip__track">
          <div class="sky-strip__fill" style="width:${progress * 100}%"></div>
          <div class="sky-strip__marker" style="left:${progress * 100}%"></div>
        </div>
        <div class="sky-strip__labels">
          <span>${today.astro.sunrise}</span>
          <span>${today.astro.sunset}</span>
        </div>
      </div>

      <dl class="readout">
        <div class="readout__item">
          <dt>Viento</dt>
          <dd>${round(current.wind_kph)} km/h ${current.wind_dir}</dd>
        </div>
        <div class="readout__item">
          <dt>Humedad</dt>
          <dd>${current.humidity}%</dd>
        </div>
        <div class="readout__item">
          <dt>Presión</dt>
          <dd>${round(current.pressure_mb)} mb</dd>
        </div>
        <div class="readout__item">
          <dt>UV</dt>
          <dd>${current.uv}</dd>
        </div>
        <div class="readout__item">
          <dt>Máx. hoy</dt>
          <dd>${round(today.day.maxtemp_c)}°</dd>
        </div>
        <div class="readout__item">
          <dt>Mín. hoy</dt>
          <dd>${round(today.day.mintemp_c)}°</dd>
        </div>
      </dl>
    `;
  }

  return { el, update, showLoading, showError };
}
