const numberFormater = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  maximumFractionDigits: 2,
})

export function formatNumber(amount) {
  return numberFormater.format(amount)
}

export function toNumber(string) {
  // убаляем пробелы, заменяем запятую на точку, преобразуем троку в число
  const re = /\s/g
  string = string.replace(',', '.').replace(re, '')
  return +string
}
