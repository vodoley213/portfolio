let latitude, longitude, timezone, cityName
const cityID = 14

import { ICON_SET } from './weather-app-icons.js'
import { CITIES_SET } from './weather-app-cities.js'
import { getCurrentWeather, getWeatherForecast } from './parsing-weather-API.js'

// console.log(CITIES_SET.get(1))

function setCityCoordinates(cityID) {
  cityName = CITIES_SET.get(cityID).city
  latitude = CITIES_SET.get(cityID).latitude
  longitude = CITIES_SET.get(cityID).longitude
  timezone = CITIES_SET.get(cityID).timezone
}

setCityCoordinates(cityID)

const URL =
  'https://api.open-meteo.com/v1/forecast?daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,apparent_temperature_max,uv_index_max&current_weather=true&timeformat=unixtime'

const localTimeZone = Intl.DateTimeFormat(undefined).resolvedOptions().timeZone

const timeRuFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
}) // 22:00
const dateRuFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
}) // пятница, 9 июня
const dayOfTheWeekFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
}) // сб, вс, пн

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
// function getCurrentWeather({ current_weather, daily }) {
//   const {
//     temperature: currentTemp,
//     windspeed: windSpeed,
//     weathercode: iconCode,
//   } = current_weather
//   const {
//     temperature_2m_max: [maxTemp],
//     temperature_2m_min: [minTemp],
//     uv_index_max: [UVindexMax],
//     sunset: [sunset_time],
//   } = daily

//   return {
//     currentTemp: Math.round(currentTemp),
//     maxTemp: Math.round(maxTemp),
//     minTemp: Math.round(minTemp),
//     windSpeed: Math.round(windSpeed),
//     iconCode,
//     UVindexMax,
//     sunset_time,
//   }
// }
// function getWeatherForecast({ daily }) {
//   return daily.time.map((time, index) => {
//     return {
//       timestampJS: time * 1000,
//       iconCode: daily.weathercode[index],
//       maxTemp: Math.round(daily.temperature_2m_max[index]),
//     }
//   })
// }

const citySection = document.querySelector('#cities-block')
const cityCardTemplate = document.querySelector('#city-card-template')
citySection.innerHTML = ''
const cityElement = cityCardTemplate.content.cloneNode(true)

getWeather(latitude, longitude, timezone).then(putWeatherToCard)

function putWeatherToCard({ currentWeather, weatherForecast }) {
  putCurrentWeather(currentWeather, weatherForecast)
  putWeatherFocast(weatherForecast)
}

function putCurrentWeather(currentWeather, weatherForecast) {
  const timeOffset =
    new Date().getTimezoneOffset() / 60 + CITIES_SET.get(cityID).UTC
  const sunset = timeRuFormatter.format(
    currentWeather.sunset_time * 1000 + timeOffset * 3600 * 1000
    //   const sunset = timeRuFormatter.format(
    // currentWeather.sunset_time * 1000 + timeOffset * 3600 * 1000
  )
  const currentDate = getDateRuFormated(weatherForecast)

  setValue('city-name', cityName)
  setValue('current-day', currentDate)
  setValue('current-temp', currentWeather.currentTemp)
  setValue('max-temp', currentWeather.maxTemp)
  setValue('min-temp', currentWeather.minTemp)
  setValue('current-sunset', sunset)
  setValue('current-wind-speed', currentWeather.windSpeed)
  setValue('current-uv', currentWeather.UVindexMax)
  setValue('weather-desc', getWeatherDesc(currentWeather.iconCode))
  document.querySelector('[data-current-icon]').src = getIconPath(
    currentWeather.iconCode
  )
}

citySection.append(cityElement)

const dailyForcastSection = document.querySelector('#daily-focast-section')
const dailyWeatherTemplate = document.querySelector(
  '#dayoftheweek-card-template'
)

// Секция прогноза погоды на 4 дня
function putWeatherFocast(weatherForecast) {
  dailyForcastSection.innerHTML = ''
  for (let day = 1; day <= 4; day++) {
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
    // console.log(day, getIconPath(weatherForecast[day].iconCode))
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
