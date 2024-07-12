import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import { useEffect } from "react";
import getFormattedWeatherData from "./services/weatherService";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormattedWeatherData("London");
        console.log(response);
      } catch (error) {
        console.error("Error fetching data in App component:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="mx-auto max-w-screen-lg mt-4 
    py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 
    from bg-cyan-600 to-blue-700"
    >
      <TopButtons />
      <Inputs />
      <TimeAndLocation />
      <TempAndDetails />
      <Forecast />
      <Forecast />
    </div>
  );
};

export default App;
