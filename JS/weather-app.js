import { renderCityCards } from './weather-app-render-card.js'
import { CITIES_SET, allCityesArray } from './weather-app-cities.js'
import { primaryHeader } from '../script.js'

export const citiesNav = document.querySelector('#cities-navigation')
const addCities = document.querySelector('[data-add-city]')

const STORAGE_PREFIX = 'WEATHER_APP'
const CITIES_STORAGE_KEY = `${STORAGE_PREFIX}-CITIES`
const DEFAULT_CITIES = [0, 1, 2, 4]

const citiesForRender = loadCitiesFromLS()

const ul = document.querySelector('#cities-list')
renderCitiesListForPopup()

renderCityCards(citiesForRender)

saveCitiesToLS()

// ----- AddEventListeners -----

addCities.addEventListener('click', () => {
  // citiesNav.hasAttribute('data-visible')
  //   ? citiesNav.setAttribute('aria-expanded', false)
  //   : citiesNav.setAttribute('aria-expanded', true)
  citiesNav.dataset.visible = ''
  primaryHeader.dataset.overlay = ''
})

// Add cityCard to page
citiesNav.addEventListener('click', e => {
  if (e.target.matches('[data-city-id-nav]')) {
    const cityId = +e.target.dataset.cityIdNav
    citiesForRender.push(cityId)
    renderCityCards([cityId])
    renderCitiesListForPopup()

    citiesNav.removeAttribute('data-visible')
    primaryHeader.removeAttribute('data-overlay')
  }
})

// Remove cityCard from page
document.addEventListener('click', e => {
  if (e.target.matches('#x-close')) {
    const cityCardForClose = e.target.closest('.card-weather')
    const cityCardForCloseId = +cityCardForClose.dataset.cityId
    const indexOfcityForClose = citiesForRender.indexOf(cityCardForCloseId)
    citiesForRender.splice(indexOfcityForClose, 1)

    cityCardForClose.remove()
    renderCitiesListForPopup()
  }
})

document.addEventListener('click', e => {
  if (e.target.matches('.primary-header')) {
    citiesNav.removeAttribute('data-visible')
  }
})

if ('geolocation' in navigator) {
  console.log(/* местоположение доступно */)
} else {
  console.log(/* местоположение НЕ доступно */)
}

// --- Additional functions ---
function loadCitiesFromLS() {
  const cities = localStorage.getItem(CITIES_STORAGE_KEY)
  return JSON.parse(cities) ?? DEFAULT_CITIES
}
function saveCitiesToLS() {
  localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(citiesForRender))
}
function citiesForPopupList(allCityesArray, citiesForRender) {
  return allCityesArray.filter(cityID => !citiesForRender.includes(cityID))
}

function renderCitiesListForPopup() {
  const arrayOfCityID = citiesForPopupList(allCityesArray, citiesForRender)
  ul.innerHTML = ''
  arrayOfCityID.forEach(cityID => {
    const li = document.createElement('li')
    li.innerText = CITIES_SET.get(cityID).city
    li.dataset.cityIdNav = cityID
    ul.appendChild(li)
  })
  const li = document.createElement('li')
  li.innerText = 'Моё местонахождение'
  ul.appendChild(li)
}
