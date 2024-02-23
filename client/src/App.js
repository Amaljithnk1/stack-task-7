import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AllRoutes from "./AllRoutes";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 760) {
      setSlideIn(false);
    }
  }, []);

  const handleSlideIn = () => {
    if (window.innerWidth <= 760) {
      setSlideIn((state) => !state);
    }
  };

  // Function to update theme based on time
  const updateTheme = () => {
    const currentHour = new Date().getHours();
    const body = document.body;

    if (currentHour >= 6 && currentHour < 18) {
      body.classList.remove("dark-mode", "rainy-mode");
      body.classList.add("light-mode");
    } else {
      body.classList.remove("light-mode", "rainy-mode");
      body.classList.add("dark-mode");
    }
  };

  // Function to update theme based on weather
  const updateThemeBasedOnWeather = (weather) => {
    const body = document.body;

    // You can customize this based on weather conditions
    if (weather.includes("Rain") || weather.includes("Thunderstorm")) {
      body.classList.remove("light-mode", "dark-mode");
      body.classList.add("rainy-mode");
    } else {
      body.classList.remove("light-mode", "rainy-mode");
      body.classList.add("dark-mode");
    }
  };

  // Get user's location and fetch weather information
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;

          // Use OpenWeatherMap API to get weather information
          const apiKey = "b1bbd8b3263f772003ed78cea79bfdef"; // Replace with your actual API key
          const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

          axios.get(weatherApiUrl)
            .then(response => {
              const weatherDescription = response.data.weather[0].description;
              updateThemeBasedOnWeather(weatherDescription);
            })
            .catch(error => console.error("Error fetching weather:", error));
        },
        function (error) {
          console.error("Error getting location:", error);
        }
      );
    }

    // Update theme based on time
    updateTheme();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Call the updateTheme function to handle theme changes
  updateTheme();

  return (
    <div className="App">
      <Router>
        <Navbar handleSlideIn={handleSlideIn} />
        <AllRoutes slideIn={slideIn} handleSlideIn={handleSlideIn} />
      </Router>
    </div>
  );
}

export default App;
