import { searchLocations } from '../api/weatherApi.js';

/**
 * @param {(location: string) => void} onSearch
 */
export function createSearchBar(onSearch) {
  const el = document.createElement('div');
  el.className = 'search-bar';

  el.innerHTML = `
    <form class="search-bar__form" autocomplete="off">
      <span class="search-bar__icon">⟡</span>
      <input
        type="text"
        name="location"
        class="search-bar__input"
        placeholder="Buscar ciudad… (p. ej. Madrid)"
        aria-label="Buscar ciudad"
      />
      <button type="button" class="search-bar__geo" title="Usar mi ubicación">◎</button>
    </form>
    <ul class="search-bar__suggestions" hidden></ul>
  `;

  const form = el.querySelector('.search-bar__form');
  const input = el.querySelector('.search-bar__input');
  const suggestionsList = el.querySelector('.search-bar__suggestions');
  const geoButton = el.querySelector('.search-bar__geo');

  let debounceTimer = null;

  function hideSuggestions() {
    suggestionsList.hidden = true;
    suggestionsList.innerHTML = '';
  }

  function renderSuggestions(results) {
    if (!results.length) {
      hideSuggestions();
      return;
    }
    suggestionsList.innerHTML = results
      .map(
        (r, i) => `
        <li class="search-bar__suggestion" data-index="${i}">
          <span class="search-bar__suggestion-name">${r.name}</span>
          <span class="search-bar__suggestion-region">${r.region ? r.region + ', ' : ''}${r.country}</span>
        </li>`
      )
      .join('');
    suggestionsList.hidden = false;

    suggestionsList.querySelectorAll('.search-bar__suggestion').forEach((li) => {
      li.addEventListener('click', () => {
        const r = results[Number(li.dataset.index)];
        input.value = r.name;
        hideSuggestions();
        onSearch(`${r.lat},${r.lon}`);
      });
    });
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (query.length < 2) {
      hideSuggestions();
      return;
    }
    debounceTimer = setTimeout(async () => {
      const results = await searchLocations(query);
      renderSuggestions(results);
    }, 300);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    hideSuggestions();
    onSearch(query);
  });

  geoButton.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    geoButton.classList.add('is-loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        geoButton.classList.remove('is-loading');
        onSearch(`${pos.coords.latitude},${pos.coords.longitude}`);
      },
      () => {
        geoButton.classList.remove('is-loading');
      }
    );
  });

  document.addEventListener('click', (e) => {
    if (!el.contains(e.target)) hideSuggestions();
  });

  return el;
}
