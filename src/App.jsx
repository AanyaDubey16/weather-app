import { useState, useEffect } from "react";
import { Search, MapPin, Droplets, Wind } from "lucide-react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [darkMode, setDarkMode] = useState(false);

  const [weather, setWeather] = useState({
    city: "Bhopal",
    country: "India",
    temp: 29,
    condition: "Partly Cloudy",
    humidity: 68,
    wind: 12,
    icon: "02d",
    sunrise: "--",
    sunset: "--",
  });

  // 🌤️ SEARCH WEATHER
  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        setError("City not found");
        setLoading(false);
        return;
      }

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      });

    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  // 📍 CURRENT LOCATION
  const getCurrentLocationWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getCurrentLocationWeather(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => console.error(error)
    );
  }, []);

 const bgClass =
  weather.condition?.includes("Rain")
    ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
    : weather.condition?.includes("Cloud")
    ? "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500"
    : weather.condition?.includes("Clear")
    ? "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400"
    : darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400";

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>

  <div className={`w-full max-w-md bg-white/15 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 ${darkMode ? "text-white" : "text-gray-900"}`}>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/30 p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}


<div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold">Weather App</h2>

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-white/20 px-3 py-1 rounded-xl text-sm"
  >
    {darkMode ? "☀ Light" : "🌙 Dark"}
  </button>
</div>


        {/* SEARCH */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 rounded-xl bg-black/20 placeholder-black outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-black/20 p-3 rounded-xl"
          >
            <Search size={22} />
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10">⏳ Loading...</div>
        ) : (
          <>
            {/* WEATHER ICON */}
            <div className="text-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                className="mx-auto"
                alt="weather"
              />

              <h1 className="text-5xl font-bold">
                {weather.temp}°
              </h1>

              <p className="text-lg opacity-90">
                {weather.condition}
              </p>

              <div className="flex items-center justify-center gap-1 mt-2">
                <MapPin size={16} />
                <span>
                  {weather.city}, {weather.country}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-black/20 rounded-2xl p-4 text-center">
                <Droplets className="mx-auto mb-2" />
                <p>Humidity</p>
                <h2 className="text-xl font-semibold">
                  {weather.humidity}%
                </h2>
              </div>

              <div className="bg-black/10 rounded-2xl p-4 text-center">
                <Wind className="mx-auto mb-2" />
                <p>Wind Speed</p>
                <h2 className="text-xl font-semibold">
                  {weather.wind} km/h
                </h2>
              </div>
            </div>

            {/* SUNRISE / SUNSET */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-black/10 rounded-2xl p-4 text-center">
                <p>🌅 Sunrise</p>
                <h2>{weather.sunrise}</h2>
              </div>

              <div className="bg-black/10 rounded-2xl p-4 text-center">
                <p>🌇 Sunset</p>
                <h2>{weather.sunset}</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}