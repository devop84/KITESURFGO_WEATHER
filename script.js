const toggleSelectLocation = document.getElementById('toggle-select-location');
const selectLocation = document.querySelector('.select-location');

toggleSelectLocation.addEventListener('click', () => {
  selectLocation.classList.toggle('display-select-location');
});

const myLocation = document.getElementById('my_location');

myLocation.addEventListener('click', getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function setPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const inputField = document.querySelector('input[type="text"]');
  inputField.value = `${latitude},${longitude}`;
}



const submitLocation = document.getElementById('submit_location');
const refreshLocation = document.getElementById('refresh_location');
const inputLocation = document.getElementById('input_location');

inputLocation.addEventListener('focus', () => {
  inputLocation.select();
});

const fetchAPI = () => {



  // MAKE THIS PART SAFER !!!
  const inputValue = inputLocation.value.trim(); // get the user input value and remove whitespace 

  fetch(`https://api.weatherapi.com/v1/current.json?key=f44e471964df45d79da184125231904&q=${inputValue}`)
    .then(response => response.json())
    .then(data => {
      const name = data.location.name;
      const lastUpdated = data.current.last_updated;
      const tempC = data.current.temp_c;
      const icon = data.current.condition.icon;
      const windKph = data.current.wind_kph;
      const windDegree = data.current.wind_degree;
      const windDir = data.current.wind_dir;

      const windKn = (windKph * 0.539957).toFixed(1);

      function getWindArrow(windDegree) {
        const arrows = [
          "north",
          "north_east",
          "east",
          "south_east",
          "south",
          "south_west",
          "west",
          "north_west"
        ];
        
        const index = Math.round((windDegree % 360) / 45);
        const oppositeIndex = (index + 4) % 8;
        
        return arrows[oppositeIndex];
      }
      const windArrow = getWindArrow(windDegree);
      const conditionWindArrow = document.getElementById("wind_arrow");
      conditionWindArrow.textContent = windArrow;

      const locationName = document.getElementById("location_name");
      locationName.textContent = name;

      const conditionIcon = document.getElementById("condition_icon");
      const path = "http:";
      conditionIcon.src = path + icon;

      const conditionWindDir = document.getElementById("wind_dir");
      conditionWindDir.textContent = windDir;

      const conditionWindKn = document.getElementById("wind_kn");
      conditionWindKn.textContent = windKn + " kn";

      const currentLastUpdated = document.getElementById("last_update");
      currentLastUpdated.textContent = lastUpdated;
    })
    .catch(error => console.error(error));
    selectLocation.classList.remove('display-select-location');
};

fetchAPI();

submitLocation.addEventListener('click', fetchAPI);
refreshLocation.addEventListener('click', fetchAPI);

