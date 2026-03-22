const API_KEY = "f3ae7a31352c7eef011d8a9065890ceb";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const cityInput = document.getElementById("cityInput");

/* ---------- WEATHER FETCH ---------- */
async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
        alert("city not found");
        throw new Error("City not found");
    }

    const data = await res.json();
    return data;
}

/* ---------- BUTTON CLICK ---------- */
document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};

/* ---------- UI RENDER ---------- */
function renderWeather(d) {
    document.getElementById("weatherEmpty").style.display = "none";

    weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${d.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind Speed</label><span>${d.wind.speed} m/s</span></div>
    `;
}

/* ---------- SAVE SEARCH HISTORY ---------- */
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");

    history.unshift(city);

    localStorage.setItem("weatherHistory", JSON.stringify(history));

    showHistory();
}

/* ---------- SHOW HISTORY ---------- */
function showHistory() {
    let history = JSON.parse(localStorage.getItem("weatherHistory") || "[]");

    historyBox.innerHTML = "";

    history.forEach(function(city) {
        let btn = document.createElement("button");
        btn.className = "hist-pill";
        btn.textContent = city;
        btn.onclick = function() { search(city); };
        historyBox.appendChild(btn);
    });
}

/* ---------- SEARCH FUNCTION ---------- */
async function search(city) {
    weatherBox.innerHTML = "";

    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
}

/* ---------- ENTER KEY SEARCH ---------- */
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            search(city);
        }
    }
});

/* ---------- INITIAL LOAD ---------- */
showHistory();