var APIKey = "3a86af078e820c30e7a3322768448284";
var arrHistory = []; 

// function to get current weather by city 
var getWeather = function(city) {
    // clear value in input
    $("#city-input").val("");
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(apiUrl).then(function(response){
        // request was succesful
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                // call current weather display function
                displayCurrent(data);
            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

// function to display current weather
var displayCurrent = function(currentWeather) {
    var cityName = currentWeather.name;
    var currentDate = new Date(currentWeather.dt*1000);
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    $("#city-name").text(cityName + " " + month + "/" + day + "/" + year);
    $("#current-icon").attr("src", "http://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + "@2x.png");
    $("#temperature").text("Temperature: " + currentWeather.main.temp + " \xB0F");
    $("#humidity").text("Humidity: " + currentWeather.main.humidity + " %");
    $("#wind-speed").text("Wind Speed: " + currentWeather.wind.speed + " MPH");
    // getting lat and lon to call a different API for UV index
    var lat = currentWeather.coord.lat;
    var lon = currentWeather.coord.lon;
    // call fucntion to get UV index
    GetUvIndex(lat, lon, cityName);
        
};
// function to get UV index API
var GetUvIndex = function (lat, lon, cityName) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
    fetch(apiURL).then(function(response) {
        // request was succesful
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                var UVIndex = data.current.uvi;
                // call UV index print, create element in history and forecast weather functions
                UVIndexPrint(UVIndex);
                createHistoryLi(cityName);
                forecast(cityName);

            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

// function to print UV index and show different collors depending if UV index (favorable-green moderate-yellow or severe-red)
var UVIndexPrint = function(index) {
    // clear any previous span on #UV-index p
    $("#UV-index").empty();
    $("#UV-index").text("UV Index: ");
    $("#UV-index").append("<span id='index' class='badge p-1 fs-6'></span>");
    $("#index").text(index);
    if (index <= 2) {
        $("#index").addClass("bg-success text-light");
    }
    if ((index > 2) && (index <=5)) {
        $("#index").addClass("bg-warning text-dark");
    }
    if (index > 5) {
        $("#index").addClass("bg-danger text-light");
    }
};

// Forecast by city
var forecast = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(apiUrl).then(function(response){
        // request was succesful
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                displayForecast(data);
            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

// Display forecast function
var displayForecast = function(forecastWeather) {
    var forecastEl = $(".forecast");
    for (i = 0; i < forecastEl.length; i++) {
        // clean any previous data
        $(forecastEl[i]).empty();
        // position index on 7, 15, 23, 31 and 39 to get all 5 days forecast
        var index = (i*8) + 7;
        // get date for the forecast day
        var forecastDate = new Date(forecastWeather.list[index].dt * 1000);
        var forecastDay = forecastDate.getDate();
        var forecastMonth = forecastDate.getMonth() + 1;
        var forecastYear = forecastDate.getFullYear();
        // add date, image, temperature and humidity to html element
        $(forecastEl[i]).append("<p class='mt-3 mb-0 fs-6'>" + forecastMonth + "/" + forecastDay + "/" + forecastYear + "</p>");
        $(forecastEl[i]).append("<img src='https://openweathermap.org/img/wn/" + forecastWeather.list[index].weather[0].icon + "@2x.png'></img>");
        $(forecastEl[i]).append("<p> Temp: " + forecastWeather.list[index].main.temp + " &#176F</p>");
        $(forecastEl[i]).append("<p>Humidity: " + forecastWeather.list[index].main.humidity + " %</p>");    
    }
};

// Function to create element on history list 
var createHistoryLi = function(city) {
    var cityId = city.replace(/ /g, "-");
    $("#history-list").prepend("<li id='" + cityId + "' class='list-group-item'>" + city + "</li>");
    
    // convert li elements text content into an array 
    arrHistory = $("li").map(function(j, element) { 
        return $(element).text(); 
    }).get();
    // cut the array at a max of 10 and eliminate the extra elements
    if (arrHistory.length > 10) {
        arrHistory.length = 10;
        $("li").slice(10).remove();
    }
    // save history
    saveCityHistory(arrHistory);
};

// load history from localstorage
var loadHistory = function() {
    var loadedHistoryArr = JSON.parse(localStorage.getItem("history"));
    // display history cities on starting from oldest search so the most recent shows on top
    for (i = (loadedHistoryArr.length - 1); i >= 0; i--) {
        createHistoryLi(loadedHistoryArr[i]);
    }
};

// save history to localstorage
var saveCityHistory = function(arr) {
    localStorage.setItem("history", JSON.stringify(arr));
};

// click on search button. Get city name and pass to getWeather
$("#search-button").on("click", function() {
    var cityInput = $("#city-input").val();
    if (cityInput) {
        getWeather(cityInput);
    } else {
        alert("You must enter a city name to search");
    }
});

// Clear History button was click
$("#clear-history").on("click", function() {
    $("#history-list").empty();
    var emptyArr = [];
    saveCityHistory(emptyArr);
});

// city on history was clicked
$("#history-list").click (function(e) {
    var city = e.target.innerText;
    var cityId = e.target.id;
    // remove element clicked from list and run getweather function
    $("#" + cityId).remove();
    getWeather(city);
});

loadHistory();