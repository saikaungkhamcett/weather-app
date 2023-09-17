import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from '../Assets/search.png';
import humidity_icon from '../Assets/humidity.png';
import wind_icon from '../Assets/wind.png';
import d01 from '../Assets/01d.svg';
import n01 from '../Assets/01n.svg';
import d02 from '../Assets/02d.svg';
import n02 from '../Assets/02n.svg';
import d03 from '../Assets/03d.svg';
import n03 from '../Assets/03n.svg';
import d04 from '../Assets/04d.svg';
import n04 from '../Assets/04n.svg';
import d09 from '../Assets/09d.svg';
import n09 from '../Assets/09n.svg';
import d10 from '../Assets/10d.svg';
import n10 from '../Assets/10n.svg';
import d11 from '../Assets/11d.svg';
import n11 from '../Assets/11n.svg';
import d13 from '../Assets/13d.svg';
import n13 from '../Assets/13n.svg';
import d50 from '../Assets/50d.svg';
import n50 from '../Assets/50n.svg';

const config = {
  api_key: 'a1771e43fc64b6c768e2167add5db658',
  geo_api_key: 'd4c4d6789f154c83adf969f4bb579bc4',
};

export const WeatherApp = () => {
  const [wicon, setWicon] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the user's current location and set the city state
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async function fetchData(position) {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Reverse geocode to get the city from coordinates
            const geo_api_url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${config.geo_api_key}`;

            const response = await fetch(geo_api_url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.results.length > 0) {
              const foundCity = data.results[0].components.town;
              setCity(foundCity);
              updateWeatherData(foundCity);
            }
          } catch (error) {
            setError('Error fetching weather data.');
          }
        },
        function (error) {
          setError('Error fetching geolocation data.');
        }
      );
    } else {
      setError('Geolocation is not supported in your browser');
    }
  }, []);

  const updateWeatherData = async (cityName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${config.api_key}&units=Imperial`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Update the weather information and icon
      const humidity = Math.round(data.main.humidity) + '%';
      const windSpeed = Math.round(data.wind.speed) + ' mph';

      if (data.weather[0].icon==="01d") setWicon(d01);
      else if (data.weather[0].icon==="01n") setWicon(n01);
      else if (data.weather[0].icon==="02d") setWicon(d02);
      else if (data.weather[0].icon==="02n") setWicon(n02);
      else if (data.weather[0].icon==="03d") setWicon(d03);
      else if (data.weather[0].icon==="03n") setWicon(n03);
      else if (data.weather[0].icon==="04d") setWicon(d04);
      else if (data.weather[0].icon==="04n") setWicon(n04);
      else if (data.weather[0].icon==="09d") setWicon(d09);
      else if (data.weather[0].icon==="09n") setWicon(n09);
      else if (data.weather[0].icon==="10d") setWicon(d10);
      else if (data.weather[0].icon==="10n") setWicon(n10);
      else if (data.weather[0].icon==="11d") setWicon(d11);
      else if (data.weather[0].icon==="11n") setWicon(n11);
      else if (data.weather[0].icon==="13d") setWicon(d13);
      else if (data.weather[0].icon==="13n") setWicon(n13);
      else if (data.weather[0].icon==="50d") setWicon(d50);
      else if (data.weather[0].icon==="50n") setWicon(n50);

      // Update the weather data in the UI
      document.querySelector('.humidity-percent').textContent = humidity;
      document.querySelector('.wind-speed').textContent = windSpeed;
      document.querySelector('.weather-temp').textContent = Math.round(data.main.temp) + '°F';
      document.querySelector('.weather-location').textContent = data.name;
    } catch (error) {
      setError('Unable to find the city.');
    }
  };

  const search = async (event) => {
    event.preventDefault(); // Prevent form submission

    const element = document.querySelector('.city-input');

    if (element.value === '') {
      return;
    }

    updateWeatherData(element.value);
  };

  return (
    <div className='container'>
      <form onSubmit={search}>
        <div className='top-bar'>
          <input
            type='text'
            className='city-input'
            placeholder='Search'
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                search(event);
              }
            }}
          />
          <div className='search-icon'>
            <img src={search_icon} alt='' onClick={search} />
          </div>
        </div>
      </form>
      <div className='weather-image'>
        <img src={wicon} alt='' />
      </div>
      <div className='weather-temp'> N/A </div>
      <div className='weather-location'>{city || 'N/A'}</div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidity_icon} alt='' className='icon' />
          <div className='data'>
            <div className='humidity-percent'>N/A</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={wind_icon} alt='' className='icon' />
          <div className='data'>
            <div className='wind-speed'>N/A</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
      {error && <div className='error-message'>{error}</div>}
    </div>
  );
};