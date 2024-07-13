import React from "react";

const TimeAndLocation = (weather) => {
  const formattedLocalTime =
    weather.weather.formattedCurrentWeather.formattedLocalTime;
  const name = weather.weather.formattedCurrentWeather.name;
  const country = weather.weather.formattedCurrentWeather.country;

  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">{formattedLocalTime}</p>
      </div>

      <div className="flex items-center justify-center my-3">
        <p className="text-3xl font-medium">{`${name}, ${country}`}</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
