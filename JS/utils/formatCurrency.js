const currencyFormater = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
})
export function formatCurrency(amount) {
  return currencyFormater.format(amount)
}
