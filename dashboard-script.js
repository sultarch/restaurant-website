// Time Zones Data
const timeZonesData = [
    { name: 'New York', timezone: 'America/New_York', emoji: '🗽' },
    { name: 'London', timezone: 'Europe/London', emoji: '🇬🇧' },
    { name: 'Paris', timezone: 'Europe/Paris', emoji: '🇫🇷' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', emoji: '🗻' },
    { name: 'Sydney', timezone: 'Australia/Sydney', emoji: '🦘' },
    { name: 'Dubai', timezone: 'Asia/Dubai', emoji: '🏖️' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', emoji: '🇮🇳' },
    { name: 'Singapore', timezone: 'Asia/Singapore', emoji: '🌴' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', emoji: '🎎' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', emoji: '🇹🇭' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', emoji: '🕌' },
    { name: 'Moscow', timezone: 'Europe/Moscow', emoji: '🇷🇺' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', emoji: '🌊' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', emoji: '🌮' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', emoji: '🇦🇷' },
    { name: 'Toronto', timezone: 'America/Toronto', emoji: '🍁' },
    { name: 'Cairo', timezone: 'Africa/Cairo', emoji: '🐫' },
    { name: 'Auckland', timezone: 'Pacific/Auckland', emoji: '🇳🇿' },
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
const WEATHER_API_KEY = '8d5cacf50f1f3e8a250f87e67ebc6834';

// Initialize
window.addEventListener('load', () => {
    initializeDashboard();
    loadTheme();
    renderTimezones();
    updateAllTimezones();
    setInterval(updateAllTimezones, 1000);
    renderTasks();
    updateDashboardStats();
    setInterval(updateDashboardStats, 60000);
});

// Initialize Dashboard
function initializeDashboard() {
    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });

    // Setup theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Setup tasks
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Setup weather
    document.getElementById('weatherBtn').addEventListener('click', searchWeather);
    document.getElementById('weatherSearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    document.getElementById('locationWeatherBtn').addEventListener('click', getWeatherLocation);

    // Setup timezone search
    document.getElementById('tzSearch').addEventListener('input', filterTimezones);

    // Setup settings
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    });
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}-content`).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    updatePageTitle(tabName);
}

function updatePageTitle(tabName) {
    const titles = {
        dashboard: 'Dashboard',
        restaurant: '🍽️ Restaurant Info',
        timezones: '🌍 Time Zones',
        weather: '🌤️ Weather',
        tasks: '✓ Tasks',
        settings: '⚙️ Settings'
    };

    document.getElementById('pageTitle').textContent = titles[tabName];
    document.getElementById('pageSubtitle').textContent = `View and manage ${titles[tabName].toLowerCase()}`;
}

// Time Zones
function renderTimezones() {
    const grid = document.getElementById('timezonesGrid');
    grid.innerHTML = '';

    timeZonesData.forEach(tz => {
        const card = document.createElement('div');
        card.className = 'timezone-card';
        card.dataset.timezone = tz.timezone;
        card.innerHTML = `
            <div class="timezone-name">${tz.emoji} ${tz.name}</div>
            <div class="timezone-time" id="time-${tz.timezone}">--:--:--</div>
            <div class="timezone-offset" id="offset-${tz.timezone}">UTC</div>
        `;
        grid.appendChild(card);
    });
}

function updateAllTimezones() {
    timeZonesData.forEach(tz => updateTimezone(tz));
}

function updateTimezone(tzData) {
    try {
        const now = new Date();
        const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tzData.timezone }));
        const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const offsetMs = tzTime - utcTime;
        const offsetHours = Math.floor(offsetMs / (1000 * 60 * 60));
        const offsetMinutes = Math.floor((Math.abs(offsetMs) % (1000 * 60 * 60)) / (1000 * 60));
        const offsetSign = offsetHours >= 0 ? '+' : '-';

        const hours = String(tzTime.getHours()).padStart(2, '0');
        const minutes = String(tzTime.getMinutes()).padStart(2, '0');
        const seconds = String(tzTime.getSeconds()).padStart(2, '0');

        const timeEl = document.getElementById(`time-${tzData.timezone}`);
        const offsetEl = document.getElementById(`offset-${tzData.timezone}`);

        if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        if (offsetEl) offsetEl.textContent = `UTC ${offsetSign}${Math.abs(offsetHours)}:${String(offsetMinutes).padStart(2, '0')}`;
    } catch (e) {
        console.error('Error updating timezone:', e);
    }
}

function filterTimezones() {
    const search = document.getElementById('tzSearch').value.toLowerCase();
    document.querySelectorAll('.timezone-card').forEach(card => {
        const name = card.querySelector('.timezone-name').textContent.toLowerCase();
        card.style.display = name.includes(search) ? 'block' : 'none';
    });
}

// Tasks
function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('taskCategory').value;
    const text = input.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text,
        category,
        completed: false,
        date: new Date().toLocaleDateString()
    };

    tasks.unshift(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    input.value = '';
    renderTasks();
    updateDashboardStats();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateDashboardStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateDashboardStats();
    }
}

function renderTasks() {
    const list = document.getElementById('tasksList');
    const recentList = document.getElementById('recentTasksList');
    list.innerHTML = '';
    recentList.innerHTML = '';

    const filtered = tasks.filter(t => {
        if (currentFilter === 'completed') return t.completed;
        if (currentFilter === 'pending') return !t.completed;
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-message">No tasks. Add one to get started!</p>';
        recentList.innerHTML = '<p class="empty-message">No tasks yet</p>';
        return;
    }

    filtered.forEach(task => {
        const item = createTaskItem(task);
        list.appendChild(item);
    });

    // Show recent tasks on dashboard
    tasks.slice(0, 3).forEach(task => {
        const item = createTaskItem(task);
        recentList.appendChild(item);
    });
}

function createTaskItem(task) {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    item.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
            onchange="toggleTask(${task.id})">
        <div class="task-content">
            <div class="task-title">${task.text}</div>
            <span class="task-category">${task.category}</span>
        </div>
        <button class="task-delete" onclick="deleteTask(${task.id})">🗑️</button>
    `;
    return item;
}

// Weather
function searchWeather() {
    const city = document.getElementById('weatherSearch').value.trim();
    if (!city) return;
    fetchWeather(city);
}

function getWeatherLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`)
            .then(r => r.json())
            .then(data => displayWeather(data));
    });
}

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
        .then(r => {
            if (!r.ok) throw new Error('City not found');
            return r.json();
        })
        .then(data => displayWeather(data))
        .catch(e => {
            document.getElementById('weatherContent').innerHTML = `<p class="empty-message">Error: ${e.message}</p>`;
        });
}

function displayWeather(data) {
    const { name, main, weather, wind, clouds } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    document.getElementById('weatherContent').innerHTML = `
        <div style="text-align: center;">
            <h3>${name}</h3>
            <img src="${icon}" alt="${weather[0].main}" style="width: 100px;">
            <p style="font-size: 2rem; color: var(--primary);"><strong>${Math.round(main.temp)}°C</strong></p>
            <p>${weather[0].description}</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 20px;">
                <div><strong>Feels Like</strong><p>${Math.round(main.feels_like)}°C</p></div>
                <div><strong>Humidity</strong><p>${main.humidity}%</p></div>
                <div><strong>Wind</strong><p>${wind.speed} m/s</p></div>
            </div>
        </div>
    `;

    // Update dashboard weather
    document.getElementById('currentTemp').textContent = Math.round(main.temp) + '°';
}

// Dashboard Stats
function updateDashboardStats() {
    const today = new Date().toLocaleDateString();
    const todayTasks = tasks.filter(t => t.date === today);
    const todayReservations = Math.floor(Math.random() * 8) + 4;
    const totalGuests = todayReservations * 2;

    document.getElementById('todayReservations').textContent = todayReservations;
    document.getElementById('totalGuests').textContent = totalGuests;
    document.getElementById('tasksToday').textContent = todayTasks.length;
}

// Theme
function toggleTheme() {
    const html = document.documentElement;
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

function setTheme(theme) {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('theme', theme);
    document.querySelector(`input[value="${theme}"]`).checked = true;

    // Update theme icon
    const icon = theme === 'light' ? '🌙' : '☀️';
    document.querySelector('.theme-icon').textContent = icon;
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    setTheme(theme);
}

// Data Management
function exportData() {
    const data = {
        tasks,
        theme: localStorage.getItem('theme'),
        exportDate: new Date().toLocaleString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function clearData() {
    if (confirm('Are you sure you want to clear all data?')) {
        tasks = [];
        localStorage.clear();
        location.reload();
    }
}