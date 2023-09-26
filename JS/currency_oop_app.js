import Currency from './Currency_class.js'

const header = document.querySelector('header')

const inputField = document.querySelectorAll('input')
const currencyCode = document.querySelectorAll('[data-currency-code]')
const countryFlag = document.querySelectorAll('[data-country-flag]')
const errorMessage = document.querySelector('#error')
const gettinDataMessage = document.querySelector('#getting_data')

const button = document.querySelectorAll('[data-popup-button]')
const popupList = [...document.querySelectorAll('[data-popup-list]')]

// *****           Описание свойств и методов класса Currency            *****
// ***** Обменные пункты и графики для валют USD RUB TRY KZT CAD GBP CHF *****
//
// currencyOne - выбранная валюта N1
// currencyTwo -выбранная валюта N2
// currencyRatesToday - данные курсов валют на сегодня
// currencyRatesForYear - данные курсов валют за прошедший год с сегодняшней даты
// exchangeRate - обменный курс на сегодня для двух выбранных валют
// fetchTodayData() - получение актуальных курсов валют в виде объекта {CAD: 1.353848, CHF: 0.892547...}
// fetchYearlyData() - получение курсов за прошедший с даты год в виде объекта:
//                     {2022-08-14: {CAD: 1.310153, CHF: 0.96612...}...}
//                     {2022-08-15: {CAD: 1.311864, CHF: 0.96255...}...}
// setCurrencies() - устанавливает знаки валют и флаги стран в поля input выбора валют
// setCurrencyRate() - устанавливает обменный курс на сегодня для двух выбранных валют
// setNumberInputField0() - установка значения в поле Input 0
// setNumberInputField1() - установка значения в поле Input 1

// *****           Описание свойств и методов класса Currency            *****

const exchangeOffice = new Currency(
  inputField,
  currencyCode,
  countryFlag,
  errorMessage,
  gettinDataMessage
)

exchangeOffice.setCurrencies()

await exchangeOffice.fetchTodayData()

exchangeOffice.setCurrencyRate()

await exchangeOffice.fetchYearlyData()

const currencyDataForYear = Object.values(exchangeOffice.currencyRatesForYear)

// График курса валют для дефолтных USD и RUB
let currencyChart
drawChart()

inputField[0].addEventListener(
  'input',
  exchangeOffice.setNumberInputField1.bind(exchangeOffice)
)
inputField[1].addEventListener(
  'input',
  exchangeOffice.setNumberInputField0.bind(exchangeOffice)
)

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

// Слушатель закрытия оверлея
document.addEventListener('click', e => {
  if (e.target.matches('[data-new-overlay]')) closeAllPopupsAndOverlay()
})

// Слушатели смены валют
popupList[0].addEventListener('click', e => {
  const isClickedLi = e.target.closest('li')
  if (isClickedLi) {
    exchangeOffice.currencyOne = isClickedLi.dataset.currency
    exchangeOffice.setCurrencies()
    exchangeOffice.setCurrencyRate()
    exchangeOffice.setNumberInputField1()
    // Обновление годового чарта:
    updateValuesForChart()
    currencyChart.update()
  }
})

popupList[1].addEventListener('click', e => {
  const isClickedLi = e.target.closest('li')
  if (isClickedLi) {
    exchangeOffice.currencyTwo = isClickedLi.dataset.currency
    exchangeOffice.setCurrencies()
    exchangeOffice.setCurrencyRate()
    exchangeOffice.setNumberInputField0()
    // Обновление годового чарта:
    updateValuesForChart()
    currencyChart.update()
  }
})

// ----- Additional functions -----

function drawChart() {
  const daysDataForYear = Object.keys(exchangeOffice.currencyRatesForYear)
  const days = daysDataForYear.map(formatDate)
  const rates = setValuesForChart()

  const ctx = document.getElementById('annual_course')

  Chart.defaults.font.size = 18
  Chart.defaults.color = '#ccced0'

  const data = {
    labels: days,
    datasets: [
      {
        label: `Курс ${exchangeOffice.currencyOne} / ${exchangeOffice.currencyTwo}`,
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

function setValuesForChart() {
  return currencyDataForYear.map(dailyRate => {
    return (
      dailyRate[exchangeOffice.currencyTwo] /
      dailyRate[exchangeOffice.currencyOne]
    ).toFixed(2)
  })
}

function updateValuesForChart() {
  currencyChart.data.datasets[0].data = setValuesForChart()
  currencyChart.data.datasets[0].label = `Курс ${exchangeOffice.currencyOne} / ${exchangeOffice.currencyTwo}`
}

function formatDate(dayUnformatted) {
  return new Intl.DateTimeFormat().format(Date.parse(dayUnformatted))
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
