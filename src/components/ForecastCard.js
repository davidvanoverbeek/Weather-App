import { formatWeekday, formatDay, isToday, round } from '../utils/helpers.js';

/**
 * @param {object} day
 * @param {boolean} isActive
 * @param {() => void} onClick
 */
export function createForecastCard(day, isActive, onClick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `forecast-card${isActive ? ' is-active' : ''}`;

  const label = isToday(day.date) ? 'Hoy' : formatWeekday(day.date);

  el.innerHTML = `
    <span class="forecast-card__day">${label}</span>
    <span class="forecast-card__date">${formatDay(day.date)}</span>
    <img
      class="forecast-card__icon"
      src="https:${day.day.condition.icon}"
      alt="${day.day.condition.text}"
      width="40"
      height="40"
    />
    <span class="forecast-card__rain">${round(day.day.daily_chance_of_rain)}%</span>
    <span class="forecast-card__temps">
      <span class="forecast-card__max">${round(day.day.maxtemp_c)}°</span>
      <span class="forecast-card__min">${round(day.day.mintemp_c)}°</span>
    </span>
  `;

  el.addEventListener('click', onClick);

  return el;
}
