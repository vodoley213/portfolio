import { renderCityCards } from './weather-app-render-card.js'
import { CITIES_SET, allCityesArray } from './weather-app-cities.js'
import { primaryHeader } from '../script.js'

export const citiesNav = document.querySelector('#cities-navigation')
const addCities = document.querySelector('[data-add-city]')

const STORAGE_PREFIX = 'WEATHER_APP'
const CITIES_STORAGE_KEY = `${STORAGE_PREFIX}-CITIES`
const YOUR_DESTINATION_KEY = `${STORAGE_PREFIX}-YOU`
const DEFAULT_CITIES = [0, 1, 2, 4]

// localStorage.removeItem(CITIES_STORAGE_KEY)
// localStorage.removeItem(YOUR_DESTINATION_KEY)

if (localStorage.getItem(YOUR_DESTINATION_KEY) !== null) {
  const youDestitationCoords = JSON.parse(
    localStorage.getItem(YOUR_DESTINATION_KEY)
  )
  CITIES_SET.set(16, {
    city: youDestitationCoords.city,
    latitude: youDestitationCoords.latitude,
    longitude: youDestitationCoords.longitude,
    timezone: youDestitationCoords.timezone,
    UTC: youDestitationCoords.UTC,
  })

  // console.log(CITIES_SET)
}

const citiesForRender = loadCitiesFromLS()

const ul = document.querySelector('#cities-list')
renderCitiesListForPopup()

renderCityCards(citiesForRender)

saveCitiesToLS()

// ----- AddEventListeners -----

addCities.addEventListener('click', () => {
  citiesNav.hasAttribute('data-visible')
    ? citiesNav.setAttribute('aria-expanded', false)
    : citiesNav.setAttribute('aria-expanded', true)
  citiesNav.dataset.visible = ''
  primaryHeader.dataset.overlay = ''
})

// Add cityCard to page
citiesNav.addEventListener('click', async e => {
  if (e.target.matches('[data-city-id-nav]')) {
    const cityId = +e.target.dataset.cityIdNav
    citiesForRender.push(cityId)

    if (cityId === 16) {
      try {
        const result = await setYourLocation()
        console.log('Что пришло из функции через return result: ', result)
      } catch (error) {
        console.log('Что пришло из функции через return result: ', error)
      }
    }

    // setTimeout(() => {
    // console.log('cityId: ', cityId)
    // console.log(CITIES_SET.get(cityId))
    // }, 1)

    renderCityCards([cityId])
    renderCitiesListForPopup()
    saveCitiesToLS()

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

    if (cityCardForCloseId === 16) localStorage.removeItem(YOUR_DESTINATION_KEY)

    cityCardForClose.remove()
    renderCitiesListForPopup()
    saveCitiesToLS()
  }
})

document.addEventListener('click', e => {
  if (e.target.matches('.primary-header')) {
    citiesNav.removeAttribute('data-visible')
  }
})

function setYourLocation() {
  return new Promise((resolve, reject) => {
    function geo_success(position) {
      const { latitude, longitude } = position.coords
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const UTC = new Date().getTimezoneOffset() / -60

      CITIES_SET.set(16, {
        city: 'Моё местонахождение',
        latitude: String(latitude.toFixed(2)),
        longitude: String(longitude.toFixed(2)),
        timezone: timezone,
        UTC: UTC,
      })

      localStorage.setItem(
        YOUR_DESTINATION_KEY,
        JSON.stringify(CITIES_SET.get(16))
      )

      // console.log(CITIES_SET.get(15))
      // console.log(CITIES_SET.get(16))
      // isGeoAvailable = true
    }

    function geo_error() {
      console.log('Данные о местоположении недоступны')
      // isGeoAvailable = false
    }

    const geo_options = {
      enableHighAccuracy: true,
      maximumAge: 3600000,
      timeout: 720000,
    }

    navigator.geolocation.getCurrentPosition(
      geo_success,
      geo_error,
      geo_options
    )
    setTimeout(() => {
      resolve(true)
    }, 10000)
    // reject(false)
  })
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
  // const li = document.createElement('li')
  // li.innerText = 'Моё местонахождение'
  // li.dataset.cityIdNav = 16
  // ul.appendChild(li)
}

// function citiesSet16() {
//   CITIES_SET.set(16, {
//     latitude: String(latitude.toFixed(2)),
//     longitude: String(longitude.toFixed(2)),
//     timezone: timezone,
//     UTC: UTC,
//   })
// }
