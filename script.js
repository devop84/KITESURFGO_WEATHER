// Get references to HTML elements
const toggleSelectLocation = document.getElementById('toggle-select-location');
const selectLocation = document.querySelector('.select-location');
const myLocation = document.getElementById('my_location');
const submitLocation = document.getElementById('submit_location');
const refreshLocation = document.getElementById('refresh_location');
const inputLocation = document.getElementById('input_location');
const conditionWindArrow = document.getElementById("wind_arrow");
const locationName = document.getElementById("location_name");
const conditionIcon = document.getElementById("condition_icon");
const conditionWindDir = document.getElementById("wind_dir");
const conditionWindKn = document.getElementById("wind_kn");
const currentLastUpdated = document.getElementById("last_update");

// Declare a variable to store the user's input
let inputValue;

// Event listener for toggling the display of the location selector
toggleSelectLocation.addEventListener('click', () => {
  selectLocation.classList.toggle('display-select-location');
});

// Event listener for getting the user's location
myLocation.addEventListener('click', getLocation);

// Event listener for selecting the input field text when it's clicked
inputLocation.addEventListener('focus', () => {
  inputLocation.select();
});

// Function to get the user's IP address
async function getIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
  }
}

// Function to determine the wind direction arrow based on the wind degree
function getWindArrow(windDegree) {
  // An array of CSS class names for the wind direction arrows
  const arrows = ["north","north_east","east","south_east","south","south_west","west","north_west"];
  
  // Calculate the index of the arrow to use based on the wind degree
  const index = Math.round((windDegree % 360) / 45);
  // Calculate the index of the opposite arrow
  const oppositeIndex = (index + 4) % 8;
  
  // Return the CSS class name of the opposite arrow
  return arrows[oppositeIndex];
}

// Function to fetch weather data from the API
async function fetchAPI() {
  try {
    // Get the user's input and trim whitespace
    inputValue = inputLocation.value.trim();

    // Fetch data from the API using the user's input
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=f44e471964df45d79da184125231904&q=${inputValue}`);
    const data = await response.json();

    // Extract relevant data from the API response
    const name = data.location.name;
    const lat = data.location.lat;
    const lon = data.location.lon;
    const lastUpdated = data.location.localtime;
    const tempC = data.current.temp_c;
    const icon = data.current.condition.icon;
    const windKph = data.current.wind_kph;
    const windDegree = data.current.wind_degree;
    const windDir = data.current.wind_dir;

    // Convert wind speed from km/h to knots and round to 1 decimal place
    const windKn = (windKph * 0.539957).toFixed(1);
    // Determine the wind direction arrow based on the wind degree
    const windArrow = getWindArrow(windDegree);

    // Update the HTML elements with the extracted data
    locationName.textContent = name;
    conditionIcon.src = `http:${icon}`;
    conditionWindDir.textContent = windDir;
    conditionWindKn.textContent = `${windKn} kn`;
    conditionWindArrow.textContent = windArrow;
    currentLastUpdated.textContent = lastUpdated;
    
// GET TIDES DATA

      // Get start of the day in Unix (utc)
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startofDayUnix = startOfDay.getTime() / 1000;

      const token = '46d1e2c4-61de-40d6-b662-e07154962079';
      // const lat = '-2.5643194097356137';
      // const lon = '-42.744428410495985';

      const proxyUrl = "https://api.allorigins.win/get?url=";
      const apiUrl = `https://api.marea.ooo/v2/tides?token=${token}&latitude=${lat}&longitude=${lon}&timestamp=${startofDayUnix}&interval=1`;
      const apiUrlWithProxy = `${proxyUrl}${encodeURIComponent(apiUrl)}`;


      fetch(apiUrlWithProxy)
      .then(response => response.json())

      .then(datamarea => {
        const dataMarea = JSON.parse(datamarea.contents);
        const tideData = dataMarea.heights;

        // Convert datetime into local time
        const tideDataLocal = tideData.map((data) => {
          const datetimeLocal = new Date(data.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          return {...data, datetimeLocal: datetimeLocal};
        });

        const nowhhmm = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});


        function createChart(data) {

          // Extract datetime and height values from the data array
          const datetimeValues = data.map(entry => entry.datetimeLocal);
          const heightValues = data.map(entry => entry.height);

          // Destroy existing Chart object if it exists
          const existingChart = Chart.getChart('myChart');
          if (existingChart) {
            existingChart.destroy();
          }
          // Create a new Chart object and specify the chart type and data
          const newchart = new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
              labels: datetimeValues,
              datasets: [{
                label: 'Height',
                data: heightValues,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                lineTension: 0.4,
                pointHitRadius:10,
              }]
            },
            options: {
              plugins: {
                legend: {
                  display:false,
                },
                annotation: {
                  annotations: [{
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'x',
                    value: nowhhmm, // Replace with the date where you want to add the vertical bar
                    borderColor: 'black',
                    borderWidth: 1,
                    label: {
                      enabled: true,
                      position: 'top',
                      content: 'Vertical Bar',
                    },
                  }]
                }
              },
              scales: {
                x: {
                  // type: 'time',
                  grid: {
                    display: false,
                  }
                },
                y: {
                  ticks: {
                    display: false,
                  }
                }
              }
            }
          });
        }
        
        createChart(tideDataLocal);
      })
      .catch(error => console.error(error));



    selectLocation.classList.remove('display-select-location');
  } catch (error) {
    console.error(error);
  }
}
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
async function setPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const inputField = document.getElementById('input_location');
    inputField.value = `${latitude},${longitude}`;
  }

// Call getIpAddress first to get the IP address, then call fetchAPI with the IP address as a parameter
getIpAddress()
  .then(ipAddress => {
    if (inputLocation.value.trim() === '') {
      inputLocation.value = ipAddress;
      fetchAPI(ipAddress);
    } else {
      fetchAPI(inputLocation.value.trim());
    }
  });

submitLocation.addEventListener('click', fetchAPI);
refreshLocation.addEventListener('click', fetchAPI);