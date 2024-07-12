import axios from "axios";
import { DateTime } from "luxon";

const API_KEY = "3b7b5907d06cf32052a4cc34807a1c08";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType, searchParams) => {
  const url = BASE_URL + infoType + "?q=" + searchParams + "&appid=" + API_KEY;
  return await axios.get(url);
};

const iconUrlFromCode = (icon) => `http://openweathermap.org/img.wn/${icon}@2x.png`;

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
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime
  };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    const weatherData = await getWeatherData("weather", searchParams);
    const formattedCurrentWeather = formatCurrent(weatherData);
    return formattedCurrentWeather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export default getFormattedWeatherData;
