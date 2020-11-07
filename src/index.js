//location date & time
let now = new Date();
let date = now.getDate();
let hours = now.toLocaleString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

let year = now.getFullYear();

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

let dateElement = document.querySelector("#current-date-time");
dateElement.innerHTML = `${month} ${date}, ${day} ${hours}`;


//displaying city name in HTML 
function searchCity(city) {
  let apiKey = "f902315c1bb8b7c1ac10cb7eaa68c265";
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

//Search engine bar
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city); 
}

let form = document.querySelector("#search-bar");
form.addEventListener("submit", handleSubmit);

// Displaying search city temperature and weather details in search bar
function showWeather(response) {
  console.log(response); 
  document.querySelector("#city-input").innerHTML = response.data.name;
  document.querySelector("#main-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#feels-like").innerHTML = Math.round(response.data.main.feels_like);
  let temperature = response.data.main.feels_like;
  document.querySelector("#feels-like-fahrenheit").innerHTML = Math.round((temperature * 9) / 5 + 32);
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
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

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", locate);

// Conversion of celsius and fahrenheit
function celsius(event) {
  event.preventDefault();
  let temperatureCelsius = document.querySelector("#main-temperature");
  let celsius = temperatureCelsius.innerHTML;
  temperatureCelsius.innerHTML = Math.round(((celsius - 32) * 5) / 9);
}
let celsiusClick = document.querySelector("#celsius-link");
celsiusClick.addEventListener("click", celsius);

function converttoFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#main-temperature");
  let temperature = temperatureElement.innerHTML;
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
}
let fahrenheitClick = document.querySelector("#fahrenheit-link");
fahrenheitClick.addEventListener("click", converttoFahrenheit);

searchCity("Aberdeen"); 