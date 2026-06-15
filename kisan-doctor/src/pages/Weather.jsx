import React, { useEffect, useState } from "react";
import styles from "./Weather.module.css";

export default function Weather() {

  const [weather, setWeather] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    
      fetch(`${API_URL}/weather/Karachi`)
    
      .then(res => res.json())
      .then(data => {

        setWeather(data);
        setLoading(false);

      })
      .catch(err => {

        console.error(err);
        setLoading(false);

      });

  }, []);

  if (loading) {

    return <h2>Loading weather...</h2>;

  }

  return (

    <div className={styles.page}>

      <h1>🌦 Weather Advisory</h1>

      <div className={styles.card}>
{weather && weather.main && (
  <h2>{weather.main.temp}°C</h2>
)}

        <p>
  🌡 Temperature: {weather?.main?.temp ?? "--"}°C
</p>

<p>
  💧 Humidity: {weather?.main?.humidity}%
</p>

<p>
  🌬 Wind: {weather?.wind?.speed} m/s
</p>
      </div>

    </div>

  );

}