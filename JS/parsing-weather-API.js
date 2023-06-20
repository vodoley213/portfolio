export function getCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    uv_index_max: [UVindexMax],
    sunset: [sunset_time],
  } = daily

  return {
    currentTemp: Math.round(currentTemp),
    maxTemp: Math.round(maxTemp),
    minTemp: Math.round(minTemp),
    windSpeed: Math.round(windSpeed),
    iconCode,
    UVindexMax,
    sunset_time,
  }
}
export function getWeatherForecast({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestampJS: time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
    }
  })
}
