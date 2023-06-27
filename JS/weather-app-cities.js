export const CITIES_SET = new Map([
  [
    0,
    {
      city: 'Москва',
      latitude: '55.75',
      longitude: '37.62',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    1,
    {
      city: 'Санкт-Петербург',
      latitude: '59.94',
      longitude: '30.31',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    2,
    {
      city: 'Новосибирск',
      latitude: '55.04',
      longitude: '82.93',
      timezone: 'Asia/Novosibirsk',
      UTC: 7,
    },
  ],
  [
    3,
    {
      city: 'Екатеринбург',
      latitude: '56.85',
      longitude: '60.61',
      timezone: 'Asia/Yekaterinburg',
      UTC: 5,
    },
  ],
  [
    4,
    {
      city: 'Нижний Новгород',
      latitude: '56.33',
      longitude: '44.00',
      timezone: 'Europe%2FMoscow',
      UTC: 3,
    },
  ],
  [
    5,
    {
      city: 'Самара',
      latitude: '53.20',
      longitude: '50.15',
      timezone: 'Europe/Samara',
      UTC: 4,
    },
  ],
  [
    6,
    {
      city: 'Омск',
      latitude: '54.99',
      longitude: '73.37',
      timezone: 'Asia/Omsk',
      UTC: 6,
    },
  ],
  [
    7,
    {
      city: 'Казань',
      latitude: '55.79',
      longitude: '49.12',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    8,
    {
      city: 'Челябинск',
      latitude: '55.15',
      longitude: '61.43',
      timezone: 'Asia/Yekaterinburg',
      UTC: 5,
    },
  ],
  [
    9,
    {
      city: 'Ростов-на-Дону',
      latitude: '47.23',
      longitude: '39.72',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    10,
    {
      city: 'Уфа',
      latitude: '54.74',
      longitude: '55.97',
      timezone: 'Asia/Yekaterinburg',
      UTC: 5,
    },
  ],
  [
    11,
    {
      city: 'Волгоград',
      latitude: '48.72',
      longitude: '44.50',
      timezone: 'Europe/Volgograd',
      UTC: 3,
    },
  ],
  [
    12,
    {
      city: 'Красноярск',
      latitude: '56.02',
      longitude: '92.87',
      timezone: 'Asia/Krasnoyarsk',
      UTC: 7,
    },
  ],
  [
    13,
    {
      city: 'Краснодар',
      latitude: '45.04',
      longitude: '38.98',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    14,
    {
      city: 'Воронеж',
      latitude: '51.67',
      longitude: '39.18',
      timezone: 'Europe/Moscow',
      UTC: 3,
    },
  ],
  [
    15,
    {
      city: 'Пермь',
      latitude: '58.01',
      longitude: '56.25',
      timezone: 'Asia/Yekaterinburg',
      UTC: 5,
    },
  ],
])

export const allCityesArray = []
for (let i = 0; i < CITIES_SET.size; i++) allCityesArray[i] = i
