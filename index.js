
const apiKey = '6addef4aa4d6aacc4a813506e4afcb86';
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
  const apiUrlWithParams = `${apiUrl}?q=${cityName}&appid=${apiKey}`;

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
    <p>Temperature: ${temperature}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
  `);

  // 5-day forecast
  forecastSection.html(`
  `);
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
