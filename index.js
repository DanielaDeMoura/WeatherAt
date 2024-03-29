const apiKey = '7e9bce1c6613684f42c71ee932e5a23a';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const searchForm = $('#search-form');
const searchInput = $('#search-input');
const historyList = $('#history');
const todaySection = $('#today');
const forecastSection = $('#forecast');

// Event listener for the form submission
searchForm.on('submit', function (event) {
  event.preventDefault();
  const cityName = searchInput.val().trim();

  if (cityName !== '') {
    // Clear input field
    searchInput.val('');

    // calling function to get weather data
    getWeatherData(cityName);
  }
});

// Function to get weather data
function getWeatherData(cityName) {
  // call API
  const apiUrlWithParams = `${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(apiUrlWithParams)
    .then(response => response.json())
    .then(data => {
      // Process the API response and update the UI
      displayWeatherData(data);
      // Update search history
      updateSearchHistory(cityName);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      // errors handelling
      alert('Error fetching weather data. Please try again.');
    });
}

// display weather data
function displayWeatherData(data) {
  // extract info
  const city = data.city.name;
  const currentDate = dayjs().format('MMMM D, YYYY');
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
  const iconCode = data.list[0].weather[0].icon;

  // update with todays weather
  todaySection.html(`
    <h2>${city} (${currentDate})</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
  `);

  // Extract forecast data
  const forecastData = data.list.slice(1); // Exclude current day from forecast

  // update the UI for the 5-day forecast
  forecastSection.html('');
  forecastData.forEach(dayData => {
    const date = dayjs(dayData.dt_txt).format('MMMM D, YYYY');
    const iconCode = dayData.weather[0].icon;
    const temperature = dayData.main.temp;
    const humidity = dayData.main.humidity;

    const forecastItem = `
      <div class="col-md-2 forecast-item bg-secondary text-white p-3 m-2">
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;

    forecastSection.append(forecastItem);
  });
}

// Function to update the search history
function updateSearchHistory(cityName) {
  // Update localStorage
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.unshift(cityName);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Update the UI
  displaySearchHistory(searchHistory);
}

// display search history on the userr interface
function displaySearchHistory(history) {
  historyList.empty();

  history.forEach(city => {
    const historyItem = $('<button>').addClass('list-group-item').text(city);
    historyItem.on('click', function () {
      // Call the function to get weather data for the clicked city
      getWeatherData(city);
    });

    historyList.append(historyItem);
  });
}

function init() {
  // Load search history in localStorage
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Display search history
  displaySearchHistory(searchHistory);
}

// load page
$(document).ready(init);
