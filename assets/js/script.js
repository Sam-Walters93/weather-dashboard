var APIKey = "3a86af078e820c30e7a3322768448284";
var arrHistory = []; 

var getWeather = function(city) {

    $("#city-input").val("");
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(apiUrl).then(function(response){

        if(response.ok) {
            response.json().then(function(data) {
            
                displayCurrent(data);
            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

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
    var lat = currentWeather.coord.lat;
    var lon = currentWeather.coord.lon;
    GetUvIndex(lat, lon, cityName);   
};

var GetUvIndex = function (lat, lon, cityName) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
    fetch(apiURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var UVIndex = data.current.uvi;
            
                UVIndexPrint(UVIndex);
                createHistoryLi(cityName);
                forecast(cityName);

            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

var UVIndexPrint = function(index) {
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

var forecast = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data) {;
                displayForecast(data);
            });
        } else {
            alert("Error: " + response.status);
        }
    });
};

var displayForecast = function(forecastWeather) {
    var forecastEl = $(".forecast");
    for (i = 0; i < forecastEl.length; i++) {
        $(forecastEl[i]).empty();
        var index = (i*8) + 7;
        var forecastDate = new Date(forecastWeather.list[index].dt * 1000);
        var forecastDay = forecastDate.getDate();
        var forecastMonth = forecastDate.getMonth() + 1;
        var forecastYear = forecastDate.getFullYear();
        
        $(forecastEl[i]).append("<p class='mt-3 mb-0 fs-6'>" + forecastMonth + "/" + forecastDay + "/" + forecastYear + "</p>");
        $(forecastEl[i]).append("<img src='https://openweathermap.org/img/wn/" + forecastWeather.list[index].weather[0].icon + "@2x.png'></img>");
        $(forecastEl[i]).append("<p> Temp: " + forecastWeather.list[index].main.temp + " &#176F</p>");
        $(forecastEl[i]).append("<p>Humidity: " + forecastWeather.list[index].main.humidity + " %</p>");    
    }
};

var createHistoryLi = function(city) {
    var cityId = city.replace(/ /g, "-");
    $("#history-list").prepend("<li id='" + cityId + "' class='list-group-item'>" + city + "</li>");
    
    arrHistory = $("li").map(function(j, element) { 
        return $(element).text(); 
    }).get();
   
    if (arrHistory.length > 10) {
        arrHistory.length = 10;
        $("li").slice(10).remove();
    }
  
    saveCityHistory(arrHistory);
};


var loadHistory = function() {
    var loadedHistoryArr = JSON.parse(localStorage.getItem("history"));

    for (i = (loadedHistoryArr.length - 1); i >= 0; i--) {
        createHistoryLi(loadedHistoryArr[i]);
    }
};

var saveCityHistory = function(arr) {
    localStorage.setItem("history", JSON.stringify(arr));
};

$("#search-button").on("click", function() {
    var cityInput = $("#city-input").val();
    if (cityInput) {
        getWeather(cityInput);
    } else {
        alert("You must enter a city name to search");
    }
});

$("#clear-history").on("click", function() {
    $("#history-list").empty();
    var emptyArr = [];
    saveCityHistory(emptyArr);
});

$("#history-list").click (function(e) {
    var city = e.target.innerText;
    var cityId = e.target.id;
    $("#" + cityId).remove();
    getWeather(city);
});

loadHistory();