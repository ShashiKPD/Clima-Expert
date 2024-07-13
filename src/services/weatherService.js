import axios from "axios";
import { DateTime } from "luxon";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Get Weather Data

const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({...searchParams, appid: API_KEY})
  return await axios.get(url);
};

// Get Forecast Data

const getForecastData = async (infoType, lat, lon) => {
  const url =
    BASE_URL + infoType + "?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY;
  return await axios.get(url);
};

const iconUrlFromCode = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

//format using luxon
const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data.data;

  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
  };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    const weatherData = await getWeatherData("weather", searchParams);
    const formattedCurrentWeather = formatCurrent(weatherData);

    const { dt, lat, lon, timezone } = formattedCurrentWeather;

    const forecastData = await getForecastData("forecast", lat, lon);
    const formattedForecastWeather = formatForecastWeather(
      dt,
      timezone,
      forecastData.data.list
    );

    return { ...formattedCurrentWeather, ...formattedForecastWeather };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const formatForecastWeather = (secs, offset, data) => {
  // hourly
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }))
    .slice(0, 5);

  // daily
  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

export default getFormattedWeatherData;
