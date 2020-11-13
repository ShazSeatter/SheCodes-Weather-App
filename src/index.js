//location date & time
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let month = months[now.getMonth()];
  return `${month} ${date}, ${day} </br> <span class="last-updated">Last updated at:</span> ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  return `${hours}`;
}

//displaying city name in HTML
function searchCity(city) {
  let apiKey = "f902315c1bb8b7c1ac10cb7eaa68c265";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

//Search engine bar
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

// Displaying search city temperature and weather details in search bar
function showWeather(response) {
  console.log(response.data); 
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#current-date-time").innerHTML = formatDate(
    response.data.dt * 1000 + (response.data.timezone * 1000
  ));
  document.querySelector("#city-input").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#main-temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  let temperature = response.data.main.feels_like;
  document.querySelector("#feels-like-fahrenheit").innerHTML = Math.round(
    (temperature * 9) / 5 + 32
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}

// Hourly forecast
function displayForecast(response) {
  console.log(response.data.list[0].pop);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null; 
  let forecast = null; 

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    precipitation = response.data.list[index].pop * 100;

    forecastElement.innerHTML += `
    <div class="col-2">
      <h5> ${formatHours(
        forecast.dt * 1000 + (response.data.city.timezone * 1000
      ))} </h5> 
        <div class="card">
          <img src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png" class="card-img-top" alt="">
              <div class="card-body">
              <div class="shadow">
          <p class="card-text"> <strong>${Math.round(
            forecast.main.temp_max
          )}°</strong> | <span class="low-temp"><strong>${Math.round(
      forecast.main.temp_min
    )}°</strong></span></p>
        </div>
        </div>
      </div>
      <li class="precipitation"><i class="fas fa-umbrella"></i> ${Math.round(precipitation)}%</li> 
    </div>
  `;
  }
}

function showCurrentPosition(position) {
  let units = "metric";
  let apiKey = "f902315c1bb8b7c1ac10cb7eaa68c265";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function locate(event) {
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

// Conversion of celsius and fahrenheit
function displayCelsius(event) {
  event.preventDefault();
  document.querySelector("#main-temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function displayFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#main-temperature").innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let form = document.querySelector("#search-bar");
form.addEventListener("submit", handleSubmit);

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", locate);

searchCity("Aberdeen");
