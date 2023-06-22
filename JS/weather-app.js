import { renderCityCards } from './weather-app-render-card.js'

const STORAGE_PREFIX = 'WEATHER_APP'
const CITIES_STORAGE_KEY = `${STORAGE_PREFIX}-CITIES`
const DEFAULT_CITIES = [0, 1, 2, 4,6,8]

const citiesForRender = loadCitiesFromLS()

renderCityCards(citiesForRender)

saveCitiesToLS()

// --- Additional functions ---
function loadCitiesFromLS() {
  const cities = localStorage.getItem(CITIES_STORAGE_KEY)
  return JSON.parse(cities) ?? DEFAULT_CITIES
}
function saveCitiesToLS() {
  localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(citiesForRender))
}
