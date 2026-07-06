import './style.css';
import { getForecast, WeatherApiError } from './api/weatherApi.js';
import { createSearchBar } from './components/SearchBar.js';
import { createCurrentWeather } from './components/CurrentWeather.js';
import { createForecastList } from './components/ForecastList.js';

const DEFAULT_LOCATION = 'Madrid';

function renderShell() {
  const app = document.getElementById('app');

  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <h1 class="app-header__title"><span>•</span>WeatherApp<span>•</span></h1>
  `;

  app.appendChild(header);
  return app;
}

async function loadWeather(location, { currentWeather, forecastList }) {
  currentWeather.showLoading();
  try {
    const data = await getForecast(location, 8);
    currentWeather.update(data);
    forecastList.update(data.forecast.forecastday);
  } catch (error) {
    const message =
      error instanceof WeatherApiError
        ? error.message
        : 'Ha ocurrido un error inesperado.';
    currentWeather.showError(message);
  }
}

function init() {
  const app = renderShell();

  const currentWeather = createCurrentWeather();
  const forecastList = createForecastList();

  const searchBar = createSearchBar((location) => {
    loadWeather(location, { currentWeather, forecastList });
  });

  app.appendChild(searchBar);
  app.appendChild(currentWeather.el);
  app.appendChild(forecastList.el);

  loadWeather(DEFAULT_LOCATION, { currentWeather, forecastList });
}

init();
