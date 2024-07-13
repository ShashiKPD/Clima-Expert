import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import { useEffect, useState } from "react";
import getFormattedWeatherData from "./services/weatherService";

const App = () => {
  const [query, setQuery] = useState("Kolkata");
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await getFormattedWeatherData({q:query, units});
      setWeather(response);
    } catch (error) {
      console.error("Error fetching data in App component:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return 'from-bg-cyan-600 to-blue-700';
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700";
    return "from-yellow-600 to-orange-700"
  }

  return (
    <div
      className={`mx-auto max-w-screen-lg mt-4 
    py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery}/>
      <Inputs />
      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} />
          <Forecast title="3 hour step forecast" data={weather.hourly} />
          <Forecast title="Daily Forecast" data={weather.daily} />
        </>
      )}
    </div>
  );
};

export default App;
