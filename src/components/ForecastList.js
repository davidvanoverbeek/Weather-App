import { createForecastCard } from './ForecastCard.js';
import { formatWeekday, isToday, round } from '../utils/helpers.js';

export function createForecastList() {
  const el = document.createElement('section');
  el.className = 'forecast';
  el.innerHTML = `
    <h2 class="forecast__title">Próximos días</h2>
    <div class="forecast__cards"></div>
    <div class="forecast__detail"></div>
  `;

  const cardsContainer = el.querySelector('.forecast__cards');
  const detailContainer = el.querySelector('.forecast__detail');

  let days = [];
  let activeIndex = 0;

  function renderDetail(day) {
    detailContainer.innerHTML = `
      <div class="day-detail">
        <p class="day-detail__title">
          ${isToday(day.date) ? 'Hoy' : formatWeekday(day.date, { full: true })}
          · ${day.day.condition.text}
        </p>
        <div class="day-detail__grid">
          <div><dt>Prob. lluvia</dt><dd>${round(day.day.daily_chance_of_rain)}%</dd></div>
          <div><dt>Viento máx.</dt><dd>${round(day.day.maxwind_kph)} km/h</dd></div>
          <div><dt>Humedad</dt><dd>${round(day.day.avghumidity)}%</dd></div>
          <div><dt>UV</dt><dd>${day.day.uv}</dd></div>
          <div><dt>Amanecer</dt><dd>${day.astro.sunrise}</dd></div>
          <div><dt>Atardecer</dt><dd>${day.astro.sunset}</dd></div>
        </div>
      </div>
    `;
  }

  function renderCards() {
    cardsContainer.innerHTML = '';
    days.forEach((day, index) => {
      const card = createForecastCard(day, index === activeIndex, () => {
        activeIndex = index;
        renderCards();
        renderDetail(days[activeIndex]);
      });
      cardsContainer.appendChild(card);
    });
  }

  function update(forecastDays) {
    days = forecastDays;
    activeIndex = 0;
    renderCards();
    if (days.length) renderDetail(days[0]);
  }

  return { el, update };
}
