// const localTimeZone = Intl.DateTimeFormat(undefined).resolvedOptions().timeZone
import { ICON_SET } from './weather-app-icons.js'
import { CITIES_SET } from './weather-app-cities.js'
import { getCurrentWeather, getWeatherForecast } from './parsing-weather-API.js'

const URL =
  'https://api.open-meteo.com/v1/forecast?daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,apparent_temperature_max,uv_index_max&current_weather=true&timeformat=unixtime'

const citiesSection = document.querySelector('#cities-block')
console.log('Before innerHTML')
citiesSection.innerHTML = ''
console.log('After innerHTML')

const timeRuFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
}) // 22:00
const dateRuFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
}) // пятница, 9 июня
const dayOfTheWeekFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
}) // сб, вс, пн

export function renderCityCards(citiesForRender) {
  citiesForRender.forEach(cityID => {
    let latitude, longitude, timezone, cityName, timeOffset

    function setCityGeoCoords(cityID) {
      cityName = CITIES_SET.get(cityID).city
      latitude = CITIES_SET.get(cityID).latitude
      longitude = CITIES_SET.get(cityID).longitude
      timezone = CITIES_SET.get(cityID).timezone
      timeOffset =
        new Date().getTimezoneOffset() / 60 + CITIES_SET.get(cityID).UTC
    }

    setCityGeoCoords(cityID)

    function getWeather(latitude, longitude, timezone) {
      return fetch(
        `${URL}&latitude=${latitude}&longitude=${longitude}&timezone=${timezone}`
      )
        .then(response => response.json())
        .then(weather => {
          return {
            currentWeather: getCurrentWeather(weather),
            weatherForecast: getWeatherForecast(weather),
          }
        })
    }

    getWeather(latitude, longitude, timezone).then(putWeatherToCard)

    function putWeatherToCard({ currentWeather, weatherForecast }) {
      const cityCardTemplate = document.querySelector('#city-card-template')
      const cityElement = cityCardTemplate.content.cloneNode(true)

      const filledWithCurrentWeatherCityElement = putCurrentWeather(
        currentWeather,
        weatherForecast,
        cityElement
      )
      putWeatherFocast(weatherForecast, filledWithCurrentWeatherCityElement)
      citiesSection.append(filledWithCurrentWeatherCityElement)
    }

    function putCurrentWeather(currentWeather, weatherForecast, cityElement) {
      const sunset = timeRuFormatter.format(
        currentWeather.sunset_time * 1000 + timeOffset * 3600 * 1000
      )
      const currentDate = getDateRuFormated(weatherForecast)

      cityElement.querySelector('.card-weather').dataset.cityId = cityID

      setValue('city-name', cityName, {
        parent: cityElement,
      })
      setValue('current-day', currentDate, {
        parent: cityElement,
      })
      setValue('current-temp', currentWeather.currentTemp, {
        parent: cityElement,
      })
      setValue('max-temp', currentWeather.maxTemp, {
        parent: cityElement,
      })
      setValue('min-temp', currentWeather.minTemp, {
        parent: cityElement,
      })
      setValue('current-sunset', sunset, {
        parent: cityElement,
      })
      setValue('current-wind-speed', currentWeather.windSpeed, {
        parent: cityElement,
      })
      setValue('current-uv', currentWeather.UVindexMax, {
        parent: cityElement,
      })
      setValue('weather-desc', getWeatherDesc(currentWeather.iconCode), {
        parent: cityElement,
      })
      cityElement.querySelector('[data-current-icon]').src = getIconPath(
        currentWeather.iconCode
      )
      return cityElement
    }
  })
}

// Секция прогноза погоды на 4 дня
function putWeatherFocast(
  weatherForecast,
  filledWithCurrentWeatherCityElement
) {
  // Создаем секцию прогноза
  const dailyForcastSection = filledWithCurrentWeatherCityElement.querySelector(
    '#daily-focast-section'
  )
  for (let day = 1; day <= 4; day++) {
    const dailyWeatherTemplate = document.querySelector(
      '#dayoftheweek-card-template'
    )
    const element = dailyWeatherTemplate.content.cloneNode(true)
    setValue('dayoftheweek-temp', weatherForecast[day].maxTemp, {
      parent: element,
    })
    setValue(
      'dayoftheweek',
      getDayOfTheWeekFormated(weatherForecast[day].timestampJS),
      {
        parent: element,
      }
    )
    element.querySelector('[data-dayoftheweek-icon]').src = getIconPath(
      weatherForecast[day].iconCode
    )
    dailyForcastSection.append(element)
  }
}

// ----- Secondary functions -----
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconPath(iconCode) {
  return `images/svg/${ICON_SET.get(iconCode).icon}.svg`
}
function getWeatherDesc(iconCode) {
  return ICON_SET.get(iconCode).weather_desc
}

function getDateRuFormated(weatherForecast) {
  const dateWithSmallFistletter = dateRuFormatter
    .format(weatherForecast[0].timestampJS)
    .replace(/.{8}$/, '')

  const dateWithBigFistletter =
    dateWithSmallFistletter.charAt(0).toUpperCase() +
    dateWithSmallFistletter.slice(1)
  return dateWithBigFistletter
}

function getDayOfTheWeekFormated(timestamp) {
  const daySmallFistletter = dayOfTheWeekFormatter.format(timestamp)

  const dayBigFistletter =
    daySmallFistletter.charAt(0).toUpperCase() + daySmallFistletter.slice(1)
  return dayBigFistletter
}
