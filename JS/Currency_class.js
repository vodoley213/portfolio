export default class Currency {
  constructor(
    inputField,
    currencyCode,
    countryFlag,
    errorMessage,
    gettinDataMessage
  ) {
    this.inputField = inputField
    this.currencyCode = currencyCode
    this.countryFlag = countryFlag
    this.errorMessage = errorMessage
    this.gettinDataMessage = gettinDataMessage
  }
  #exchangeRateNunmber = 1
  currencyRatesToday = {}
  currencyRatesForYear = {}
  #currencyOneIso = 'USD'
  #currencyTwoIso = 'RUB'
  #CURRENCY_CODES = {
    USD: 'flag_usa.svg',
    EUR: 'flag_eu.svg',
    RUB: 'flag_rus.svg',
    TRY: 'flag_tur.svg',
    KZT: 'flag_kaz.svg',
    CAD: 'flag_can.svg',
    GBP: 'flag_gb.svg',
    CHF: 'flag_swiss.svg',
  }
  get exchangeRate() {
    return this.#exchangeRateNunmber
  }
  set exchangeRate(value) {
    this.#exchangeRateNunmber = value
  }

  get currencyOne() {
    return this.#currencyOneIso
  }
  set currencyOne(value) {
    this.#currencyOneIso = value
  }

  get currencyTwo() {
    return this.#currencyTwoIso
  }
  set currencyTwo(value) {
    this.#currencyTwoIso = value
  }

  get options() {
    return {
      symbols: 'USD,EUR,RUB,TRY,KZT,CAD,GBP,CHF',
      base: 'USD',
    }
  }

  get URL() {
    return 'https://api.exchangerate.host'
  }

  #params(options) {
    return new URLSearchParams({ ...options })
  }

  #handleError() {
    const resp = new Response(
      JSON.stringify({
        code: 400,
      })
    )
    return resp
  }

  setNumberInputField0() {
    this.inputField[0].value = formatNumber(
      toNumber(this.inputField[1].value) / this.exchangeRate
    )
  }

  setNumberInputField1() {
    this.inputField[1].value = formatNumber(
      toNumber(this.inputField[0].value) * this.exchangeRate
    )
  }

  setCurrencies() {
    this.options.base = this.currencyOne
    this.currencyCode[0].dataset.currencyCode = this.currencyOne
    this.currencyCode[1].dataset.currencyCode = this.currencyTwo
    this.currencyCode[0].textContent = this.currencyOne
    this.currencyCode[1].textContent = this.currencyTwo
    this.countryFlag[0].src = `images/svg/${
      this.#CURRENCY_CODES[this.currencyOne]
    }`
    this.countryFlag[1].src = `images/svg/${
      this.#CURRENCY_CODES[this.currencyTwo]
    }`
  }

  setCurrencyRate() {
    // console.log(this.currencyTwo)
    // console.log(this.currencyOne)
    this.exchangeRate =
      this.currencyRatesToday[this.currencyTwo] /
      this.currencyRatesToday[this.currencyOne]
    // console.log(this.exchangeRate)
  }

  async fetchTodayData() {
    this.gettinDataMessage.classList.remove('hiding')

    const url = `${this.URL}/latest?${this.#params(this.options)}`

    const currencyRates = await (
      await fetch(url).catch(this.#handleError)
    ).json()

    this.gettinDataMessage.classList.add('hiding')
    if (currencyRates.code === 400) {
      this.errorMessage.classList.remove('hiding')

      const localUrl = 'JS/currency_latest.json'

      const savedCurrencyRates = await (await fetch(localUrl)).json()
      this.currencyRatesToday = savedCurrencyRates.rates
    }
    this.currencyRatesToday = currencyRates.rates
  }

  async fetchYearlyData() {
    this.gettinDataMessage.classList.remove('hiding')

    const { startDate, endDate } = this.datesForDisplayCurrency
    const url = `${
      this.URL
    }/timeseries?start_date=${startDate}&end_date=${endDate}&${this.#params(
      this.options
    )}`

    const responseFromServer = await fetch(url).catch(this.#handleError)
    const currencyRates = await responseFromServer.json()

    this.gettinDataMessage.classList.add('hiding')
    if (currencyRates.code === 400) {
      this.errorMessage.classList.remove('hiding')

      const localUrl = 'JS/currency_timeseries.json'
      const savedCurrencyRates = await (await fetch(localUrl)).json()
      this.currencyRatesForYear = savedCurrencyRates.rates
    }
    this.currencyRatesForYear = currencyRates.rates
  }

  get datesForDisplayCurrency() {
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
}

const numberFormater = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  maximumFractionDigits: 2,
})

function formatNumber(amount) {
  return numberFormater.format(amount)
}

function toNumber(string) {
  // убаляем пробелы, заменяем запятую на точку, преобразуем троку в число
  const re = /\s/g
  string = string.replace(',', '.').replace(re, '')
  return +string
}
