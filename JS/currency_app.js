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
  symbols: 'USD,EUR,RUB,TRY,KZT,CAD,GBP,CHF',
  base: 'USD',
}

let currencyRatesToday, currencyRatesForYear

// 1. Set default currencies and the base in options
let currencyOne = 'USD'
let currencyTwo = 'RUB'
setCurrencies(currencyOne, currencyTwo)

// 2. Загружаем данные с сервера и записываем их в объекты:
// currencyRatesToday и currencyRatesForYear

currencyRatesToday = await getCurrencyToday(options)
currencyRatesForYear = await getCurrencyForYear(options)
const currencyDatesForYear = Object.values(currencyRatesForYear)

// 3. Устанавливаем курсы валют в зивисимости от выбранных валют
// setCurrencyRate()

setCurrencyRate()

// 4. График курса валют для дефолтных USD и RUB
let currencyChart
drawChart()

inputField[0].addEventListener('input', setNumberInputField1)
inputField[1].addEventListener('input', setNumberInputField0)

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

// Закрытие оверлея
document.addEventListener('click', e => {
  if (e.target.matches('[data-new-overlay]')) closeAllPopupsAndOverlay()
})

// Смена валют
popupList[0].addEventListener('click', e => {
  const isClickedLi = e.target.closest('li')
  if (isClickedLi) {
    currencyOne = isClickedLi.dataset.currency
    setCurrencies(currencyOne, currencyTwo)
    setCurrencyRate()
    setNumberInputField1()
    updateValuesForChart()
    currencyChart.update()
  }
})

popupList[1].addEventListener('click', e => {
  const isClickedLi = e.target.closest('li')
  if (isClickedLi) {
    currencyTwo = isClickedLi.dataset.currency
    setCurrencies(currencyOne, currencyTwo)
    setCurrencyRate()
    setNumberInputField0()
    updateValuesForChart()
    currencyChart.update()
  }
})

// ----- Additional functions -----

function drawChart() {
  const daysUnformatted = Object.keys(currencyRatesForYear)
  const days = daysUnformatted.map(formatDate)
  const rates = setValuesForChart()

  const ctx = document.getElementById('annual_course')

  Chart.defaults.font.size = 18
  Chart.defaults.color = '#ccced0'

  const data = {
    labels: days,
    datasets: [
      {
        label: `Курс ${currencyOne} / ${currencyTwo}`,
        data: rates,
        backgroundColor: 'rgba(245, 192, 41, 0.3)',
        borderColor: '#f5c029',
        borderWidth: 1,
        fill: true,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        ticks: {
          callback: function (value, index, values) {
            if (index % 45 === 0 || index === data.length - 1)
              return data.labels[index]
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        displayColors: false,
        padding: 12,
      },
    },
  }

  currencyChart = new Chart(ctx, {
    type: 'line',
    data,
    options,
  })
}

function updateValuesForChart() {
  currencyChart.data.datasets[0].data = setValuesForChart()
  currencyChart.data.datasets[0].label = `Курс ${currencyOne} / ${currencyTwo}`
}

function setValuesForChart() {
  return currencyDatesForYear.map(dailyRate => {
    return (dailyRate[currencyTwo] / dailyRate[currencyOne]).toFixed(2)
  })
}

function formatDate(dayUnformatted) {
  return new Intl.DateTimeFormat().format(Date.parse(dayUnformatted))
}

function setCurrencies(currencyOne, currencyTwo) {
  options.base = currencyOne
  currencyCode[0].dataset.currencyCode = currencyOne
  currencyCode[1].dataset.currencyCode = currencyTwo
  currencyCode[0].textContent = currencyOne
  currencyCode[1].textContent = currencyTwo
  countryFlag[0].src = `images/svg/${CURRENCY_CODES[currencyOne]}`
  countryFlag[1].src = `images/svg/${CURRENCY_CODES[currencyTwo]}`
}

function setCurrencyRate() {
  exchangeRate =
    currencyRatesToday[currencyTwo] / currencyRatesToday[currencyOne]
}

function setNumberInputField1() {
  inputField[1].value = formatNumber(
    toNumber(inputField[0].value) * exchangeRate
  )
}

function setNumberInputField0() {
  inputField[0].value = formatNumber(
    toNumber(inputField[1].value) / exchangeRate
  )
}

// Получение курсов валют на сегодня
async function getCurrencyToday(options) {
  gettinDataMessage.classList.remove('hiding')

  const url = `${URL}/latest?${params(options)}`

  const currencyRates = await (await fetch(url).catch(handleError)).json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    errorMessage.classList.remove('hiding')
    console.log('Error from getCurrencyToday')

    const localUrl = 'JS/currency_latest.json'
    const savedCurrencyRates = await (await fetch(localUrl)).json()
    return savedCurrencyRates.rates
  }
  return currencyRates.rates
}

// Получение курсов за прошедший год
async function getCurrencyForYear(options) {
  gettinDataMessage.classList.remove('hiding')

  const { startDate, endDate } = datesForDisplayCurrency()
  const url = `${URL}/timeseries?start_date=${startDate}&end_date=${endDate}&${params(
    options
  )}`

  const responseFromServer = await fetch(url).catch(handleError)
  const currencyRates = await responseFromServer.json()

  gettinDataMessage.classList.add('hiding')
  if (currencyRates.code === 400) {
    errorMessage.classList.remove('hiding')
    console.log('Error from getCurrencyForYear')

    const localUrl = 'JS/currency_timeseries.json'
    const savedCurrencyRates = await (await fetch(localUrl)).json()
    return savedCurrencyRates.rates
  }
  return currencyRates.rates
}

function datesForDisplayCurrency() {
  const dateNow = new Date()

  let date = dateNow.getDate()
  let month = dateNow.getMonth() + 1
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
