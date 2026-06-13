// OpenWeatherMap API Key (Free tier)
const API_KEY = '8d5cacf50f1f3e8a250f87e67ebc6834'; // Replace with your own key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const hourlySection = document.getElementById('hourlySection');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const recentList = document.getElementById('recentList');

// Event Listeners
searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch(searchInput.value);
});
locationBtn.addEventListener('click', () => getUserLocation());

// Initialize
window.addEventListener('load', () => {
    displayRecentSearches();
    // Try to load weather for default city
    handleSearch('London');
});

// Handle Search
function handleSearch(city) {
    if (!city.trim()) {
        showError('Please enter a city name');
        return;
    }

    showLoading(true);
    clearError();

    // Fetch current weather
    fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
            addToRecentSearches(data.name);
            showLoading(false);
        })
        .catch(error => {
            showError('Failed to fetch weather data. ' + error.message);
            showLoading(false);
        });
}

// Get User Location
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showError('Unable to get your location: ' + error.message);
            showLoading(false);
        }
    );
}

// Fetch Weather by Coordinates
function fetchWeatherByCoords(lat, lon) {
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(lat, lon);
            addToRecentSearches(data.name);
            showLoading(false);
        })
        .catch(error => {
            showError('Failed to fetch weather data');
            showLoading(false);
        });
}

// Fetch Forecast
function fetchForecast(lat, lon) {
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
            displayHourlyForecast(data);
        })
        .catch(error => console.error('Forecast error:', error));
}

// Display Current Weather
function displayCurrentWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, feels_like, humidity, pressure },
        weather: [{ main, description, icon }],
        wind: { speed },
        clouds: { all: cloudiness },
        visibility,
        dt
    } = data;

    const cityName = `${name}, ${country}`;
    const dateTime = new Date(dt * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('cityName').textContent = cityName;
    document.getElementById('dateTime').textContent = dateTime;
    document.getElementById('temperature').textContent = Math.round(temp) + '°';
    document.getElementById('weatherDesc').textContent = description;
    document.getElementById('feelsLike').textContent = Math.round(feels_like) + '°C';
    document.getElementById('humidity').textContent = humidity + '%';
    document.getElementById('windSpeed').textContent = (speed * 3.6).toFixed(1) + ' km/h';
    document.getElementById('pressure').textContent = pressure + ' mb';
    document.getElementById('visibility').textContent = (visibility / 1000).toFixed(1) + ' km';
    document.getElementById('clouds').textContent = cloudiness + '%';

    // Set weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;

    currentWeatherSection.classList.remove('hidden');
    searchInput.value = '';
}

// Display 5-Day Forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    // Group by day (one forecast per day at noon)
    const dailyForecasts = {};

    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString();

        // Keep noon forecast or closest to noon
        if (!dailyForecasts[day] || Math.abs(date.getHours() - 12) < 6) {
            dailyForecasts[day] = forecast;
        }
    });

    // Display up to 5 days
    Object.values(dailyForecasts).slice(1, 6).forEach(forecast => {
        const {
            dt,
            main: { temp_max, temp_min },
            weather: [{ icon, main, description }],
            wind: { speed },
            pop
        } = forecast;

        const date = new Date(dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img src="${iconUrl}" alt="${description}" class="forecast-icon">
            <div class="forecast-temp">${Math.round(temp_max)}°</div>
            <div class="forecast-desc">${Math.round(temp_min)}°</div>
            <div class="forecast-extra">
                <div>💨 ${(speed * 3.6).toFixed(0)} km/h</div>
                <div>🌧️ ${Math.round(pop * 100)}%</div>
            </div>
        `;

        forecastContainer.appendChild(forecastCard);
    });

    forecastSection.classList.remove('hidden');
}

// Display Hourly Forecast
function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = '';

    // Display next 24 hours (every 3 hours)
    data.list.slice(0, 8).forEach(forecast => {
        const {
            dt,
            main: { temp, feels_like },
            weather: [{ icon, description }],
            wind: { speed },
            pop
        } = forecast;

        const date = new Date(dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const hourlyCard = document.createElement('div');
        hourlyCard.className = 'hourly-card';
        hourlyCard.innerHTML = `
            <div class="hourly-time">${time}</div>
            <img src="${iconUrl}" alt="${description}" class="hourly-icon">
            <div class="hourly-temp">${Math.round(temp)}°</div>
            <div class="hourly-desc">${description}</div>
            <div class="forecast-extra">
                <div>💧 ${Math.round(pop * 100)}%</div>
            </div>
        `;

        hourlyContainer.appendChild(hourlyCard);
    });

    hourlySection.classList.remove('hidden');
}

// Recent Searches Management
function addToRecentSearches(city) {
    // Remove if already exists
    recentSearches = recentSearches.filter(item => item !== city);
    
    // Add to beginning
    recentSearches.unshift(city);
    
    // Keep only last 10
    recentSearches = recentSearches.slice(0, 10);
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

function displayRecentSearches() {
    recentList.innerHTML = '';

    if (recentSearches.length === 0) {
        recentList.innerHTML = '<span class="no-searches">No recent searches</span>';
        return;
    }

    recentSearches.forEach(city => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.textContent = city;
        item.addEventListener('click', () => handleSearch(city));
        recentList.appendChild(item);
    });
}

// Utility Functions
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        currentWeatherSection.classList.add('hidden');
        forecastSection.classList.add('hidden');
        hourlySection.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 4000);
}

function clearError() {
    errorMessage.classList.remove('show');
}

// Get default API key notice
console.log('Weather Dashboard loaded. For best performance, get your own free API key from openweathermap.org');