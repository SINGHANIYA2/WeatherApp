const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const apierror = document.querySelector(".api-error-container");

const API_KEY = "f23fb6ebf13fa4a548d6c93f23813b28"
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active");
            
            
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // checking wheather location permission is granted or not
            getfromSessionStorage();
            
        }
    }
}

userTab.addEventListener('click',() =>{
    switchTab(userTab);
})
searchTab.addEventListener('click',() =>{
    switchTab(searchTab);
})

// checks coordinate of user are there or not
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserweatherInfo(coordinates);

    }
}

async function fetchUserweatherInfo(coordinates){
    const {lat , lon} = coordinates;
    apierror.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
        // hw
    }
}


function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherdesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const humidity = document.querySelector("[data-humidity]");
    const windspeed = document.querySelector("[data-wind]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // handle for error
    const msg = weatherInfo?.message;
    if(msg == "city not found"){
        userInfoContainer.classList.remove("active");
        apierror.classList.add("active");
    }
    else{
        apierror.classList.remove("active");
    // fetch value from data and show on ui
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        const tempC = weatherInfo?.main?.temp - 273.15;
        temp.innerText = `${tempC.toFixed(2)} °C`
        windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    }
    
}



function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        // show alert

    }
}

function showPosition(position){
    const userCoordinate ={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
    fetchUserweatherInfo(userCoordinate);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getlocation);

const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit",(e) =>{

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        // handle hw
    }
}
