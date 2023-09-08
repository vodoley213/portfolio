import { CURRENCY_CODES } from './currency_app_codes.js'

const inputField = document.querySelectorAll('input')
const currencyCode = document.querySelectorAll('[data-currency-code]')
const countryFlag = document.querySelectorAll('[data-country-flag]')
const errorMessage = document.querySelector('#error')
const gettinDataMessage = document.querySelector('#getting_data')

const URL = 'https://api.exchangerate.host'
const options = {
  base: 'USD',
  symbols: 'EUR,RUB,TRY,KZT,CAD,GBP,CHF', // Швейцария - CHF
}

let currencyRatesToday
let currencyRatesForYear

// Set default currencies
setCurrencies('USD', 'RUB')

// 2. Загружаем данные с сервера и записываем их в массивы:
// currencyRatesToday и currencyRatesForYear

getCurrencyForYear(options)
getCurrencyToday(options)

// console.log(currencyRatesToday)
// console.log(currencyRatesForYear)

// setCurrencyRates()

function setCurrencies(currencyOne, currencyTwo) {
  currencyCode[0].dataset.currencyCode = currencyOne
  currencyCode[1].dataset.currencyCode = currencyTwo
  currencyCode[0].textContent = currencyOne
  currencyCode[1].textContent = currencyTwo
  currencyCode[0].textContent = currencyOne
  currencyCode[1].textContent = currencyTwo
  countryFlag[0].src = `images/svg/${CURRENCY_CODES[currencyOne]}`
  countryFlag[1].src = `images/svg/${CURRENCY_CODES[currencyTwo]}`
}

// function setCurrencyRates(){
//   const currencyOne =
// }

// const result = params(options)
// https://currencyapi.com/pricing/
// for (const p of result) {
//   console.log(p)
// }

inputField[0].addEventListener('input', () => {
  inputField[1].value = inputField[0].value
})

inputField[1].addEventListener('input', () => {
  inputField[0].value = inputField[1].value
})

async function getCurrencyToday(options) {
  gettinDataMessage.classList.remove('hiding')

  const url = `${URL}/latest?${params(options)}`

  // const url = 'http://'

  const currencyRates = await (await fetch(url).catch(handleError)).json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    console.log('Это ошибка с getCurrencyToday')

    errorMessage.classList.remove('hiding')
    return
  }
  console.log(currencyRates.rates)
}

async function getCurrencyForYear(options) {
  gettinDataMessage.classList.remove('hiding')

  const { startDate, endDate } = datesForDisplayCurrency()
  const url = `${URL}/timeseries?start_date=${startDate}&end_date=${endDate}${params(
    options
  )}`

  const responseFromServer = await fetch(url).catch(handleError)
  const currencyRates = await responseFromServer.json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    console.log('Это ошибка с getCurrencyForYear')
    errorMessage.classList.remove('hiding')
    return
  }

  console.log(currencyRates.rates)
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
