import { CURRENCY_CODES } from './currency_app_codes.js'
import { formatNumber, toNumber } from './utils/formatNumber.js'

const header = document.querySelector('header')
const inputField = document.querySelectorAll('input')
const currencyCode = document.querySelectorAll('[data-currency-code]')
const countryFlag = document.querySelectorAll('[data-country-flag]')
const errorMessage = document.querySelector('#error')
const gettinDataMessage = document.querySelector('#getting_data')
const button = document.querySelectorAll('[data-popup-button]')
const popupList = [...document.querySelectorAll('[data-popup-list]')]
let exchangeRate = 1

const URL = 'https://api.exchangerate.host'
const options = {
  base: 'USD',
  symbols: 'USD,EUR,RUB,TRY,KZT,CAD,GBP,CHF', // Швейцария - CHF
}

let currencyRatesToday
let currencyRatesForYear

// 1. Set default currencies and the base in options
setCurrencies('USD', 'RUB')

// 2. Загружаем данные с сервера и записываем их в массивы:
// currencyRatesToday и currencyRatesForYear

currencyRatesToday = await getCurrencyToday(options)
currencyRatesForYear = await getCurrencyForYear(options)

// 3. Устанавливаем курсы валют в зивисимости от выбранных валют
// setCurrencyRate()

setCurrencyRate()

inputField[0].addEventListener('input', () => {
  inputField[1].value = formatNumber(
    toNumber(inputField[0].value) * exchangeRate
  )
})

inputField[1].addEventListener('input', () => {
  inputField[0].value = formatNumber(
    toNumber(inputField[1].value) / exchangeRate
  )
})

button[0].addEventListener('click', () => {
  popupList[1].classList.add('hiding')
  popupList[0].classList.toggle('hiding')
  addOrRemoveOverlay()
})

button[1].addEventListener('click', e => {
  popupList[0].classList.add('hiding')
  popupList[1].classList.toggle('hiding')
  addOrRemoveOverlay()
})

document.addEventListener('click', e => {
  if (e.target.matches('[data-new-overlay]')) closeAllPopupsAndOverlay()
})

function addOrRemoveOverlay() {
  if (popupList.every(list => list.classList.contains('hiding'))) {
    header.removeAttribute('data-new-overlay')
  } else {
    header.setAttribute('data-new-overlay', true)
  }
}

function closeAllPopupsAndOverlay() {
  popupList[0].classList.add('hiding')
  popupList[1].classList.add('hiding')
  header.removeAttribute('data-new-overlay')
}

// ----- Additional functions -----

function setCurrencies(currencyOne, currencyTwo) {
  options.base = currencyOne
  currencyCode[0].dataset.currencyCode = currencyOne
  currencyCode[1].dataset.currencyCode = currencyTwo
  currencyCode[0].textContent = currencyOne
  currencyCode[1].textContent = currencyTwo
  currencyCode[0].textContent = currencyOne
  currencyCode[1].textContent = currencyTwo
  countryFlag[0].src = `images/svg/${CURRENCY_CODES[currencyOne]}`
  countryFlag[1].src = `images/svg/${CURRENCY_CODES[currencyTwo]}`
}

function setCurrencyRate() {
  const currencyTwo = currencyCode[1].dataset.currencyCode
  exchangeRate = currencyRatesToday[currencyTwo]
}

// Получение курсов валют на сегодня
async function getCurrencyToday(options) {
  gettinDataMessage.classList.remove('hiding')

  // const url = `${URL}/latest?${params(options)}`

  const url = 'JS/currency_latest.json'

  const currencyRates = await (await fetch(url).catch(handleError)).json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    console.log('Это ошибка с getCurrencyToday')

    errorMessage.classList.remove('hiding')
    return
  }

  return currencyRates.rates
}

// Получение курсов за прошедший год
async function getCurrencyForYear(options) {
  gettinDataMessage.classList.remove('hiding')

  const { startDate, endDate } = datesForDisplayCurrency()
  // const url = `${URL}/timeseries?start_date=${startDate}&end_date=${endDate}${params(
  //   options
  // )}`
  const url = 'JS/currency_timeseries.json'

  const responseFromServer = await fetch(url).catch(handleError)
  const currencyRates = await responseFromServer.json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    console.log('Это ошибка с getCurrencyForYear')
    errorMessage.classList.remove('hiding')
    return
  }

  // console.log(currencyRates.rates)
  return currencyRates.rates
}

function datesForDisplayCurrency() {
  const dateNow = new Date()
  let date = dateNow.getDate()
  let month = dateNow.getMonth()
  const year = dateNow.getFullYear()

  if (date.toString().length === 1) date = '0' + date
  if (month.toString().length === 1) month = '0' + month
  return {
    startDate: `${year - 1}-${month}-${date}`,
    endDate: `${year}-${month}-${date}`,
  }
}

function params(options) {
  return new URLSearchParams({
    // access_key: 'b38bf2ea00fa7b7ccca6cb92a99ca19b',
    ...options,
  })
}

function handleError() {
  const resp = new Response(
    JSON.stringify({
      code: 400,
    })
  )
  return resp
}

// const result = params(options)
// for (const p of result) {
//   console.log(p)
// }
