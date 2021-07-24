const key = 'fd744b8c1586fd9056dc0d3144a803a7';
const searchHistory = [];

const getCurrentWeatherData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentWeather(data);
            });            
        }
        else {
            alert('Error' + response.status);
        };
    });
};

const displayCurrentWeather = (current) => {
    var city = current.name;
    var lat = current.coord.lat;
    var lon = current.coord.lon;
    var currentDate = new Date(currentWeather.dt*1000);
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();




};