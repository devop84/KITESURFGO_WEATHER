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









// const input = document.querySelector('input[type="text"]');

// // Define a regular expression to validate the input
// const pattern = /^[0-9.,\sa-zA-Z]+$/;

// // Add an event listener to the input element to validate the input when it changes
// input.addEventListener('input', event => {
//   const value = event.target.value;
//   const isValid = pattern.test(value);
  
//   // If the input is not valid, display an error message
//   if (!isValid) {
//     alert('Invalid input! Please enter only numbers, dots, commas, text or whitespace.');
//     // Reset the input value
//     event.target.value = '';
//   }
// });

fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    const inputLocation = document.getElementById('input_location');
    inputLocation.textContent = data.ip;
  })
  .catch(error => console.error(error));

const submitLocation = document.getElementById('submit_location');
const refreshLocation = document.getElementById('refresh_location');

const inputLocation = document.getElementById('input_location');

const handleClick = () => {

  const inputValue = inputLocation.value.trim(); // get the user input value and remove whitespace
  
  // make the API request using fetch
  fetch(`https://api.weatherapi.com/v1/current.json?key=f44e471964df45d79da184125231904&q=${inputValue}`)
    .then(response => response.json()) // convert the response to JSON format
    .then(data => {
      // extract the required data from the JSON response
      const name = data.location.name;
      const lastUpdated = data.current.last_updated;
      const tempC = data.current.temp_c;
      const icon = data.current.condition.icon;
      const windKph = data.current.wind_kph;
      const windDegree = data.current.wind_degree;
      const windDir = data.current.wind_dir;

      const locationName = document.getElementById("location_name");
      locationName.textContent = name;

      const conditionIcon = document.getElementById("condition_icon");
      const path = "http:";
      conditionIcon.src = path + icon;

      const conditionWindDir = document.getElementById("wind_dir");
      conditionWindDir.textContent = windDir;

      const conditionWindKph = document.getElementById("wind_kph");
      conditionWindKph.textContent = windKph;

      const currentLastUpdated = document.getElementById("last_update");
      currentLastUpdated.textContent = lastUpdated;

      // do something with the data, for example, display it on the page
      console.log(name, lastUpdated, tempC, icon, windKph, windDegree, windDir);
    })
    .catch(error => console.error(error));
    selectLocation.classList.remove('display-select-location');
};

handleClick();
submitLocation.addEventListener('click', handleClick);
refreshLocation.addEventListener('click', handleClick);