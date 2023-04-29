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

//__________________________________________________________________________________________


    // Get start of the day in Unix (utc)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startofDayUnix = startOfDay.getTime() / 1000;

    const token = '910c014a-e33d-4bdf-b1cf-6738e8e281b2';
    // const lat = '-2.5643194097356137';
    // const lon = '-42.744428410495985';

    const proxyUrl = "https://corsproxy.io/?";
    const apiUrl = `https://api.marea.ooo/v2/tides?token=${token}&latitude=${lat}&longitude=${lon}&timestamp=${startofDayUnix}&interval=30`;

    fetch (proxyUrl + apiUrl)
    .then(response => response.json())
    .then(datamarea => {
      console.log(datamarea)
      const tideExtremes = datamarea.extremes;
      const tideData = datamarea.heights;
      console.log(tideExtremes)

function getDivWidth(id) {
return document.getElementById(id).offsetWidth;
}
function getDivHeight(id) {
return document.getElementById(id).offsetHeight;
}

var w = getDivWidth('chart-container');
var h = getDivHeight('chart-container');

const margin = { top: 32, right: 16, bottom: 16, left: 16 };

const xScale = d3.scaleTime()
.domain(d3.extent(tideData, d => new Date(d.datetime)))
.range([margin.left, w - margin.right]);

const yScale = d3.scaleLinear()
.domain(d3.extent(tideData, d => d.height))
.range([h - margin.bottom, margin.top]);

const lineFunc = d3.line()
.x(d => xScale(new Date(d.datetime)))
.y(d => yScale(d.height))
.curve(d3.curveCatmullRom.alpha(0.5));

// Select the SVG element by its ID
const svgold = d3.select("#chart-container svg");

// Check if the SVG element exists
if (!svgold.empty()) {
  // If the SVG element exists, remove it
  svgold.remove();
}


const svg = d3.select("#chart-container").append("svg")
.attr("id", "chart")
.attr("width", w)
.attr("height", h)
.on("mousemove", function(event) {
const mouseX = event.offsetX || event.layerX; // get the x-coordinate of the mouse pointer
const newX = Math.max(margin.left, Math.min(w - margin.right, mouseX)); // constrain the bar within the chart area
bar.attr("x", newX - 1.5); // update the position of the bar
const newData = tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX))[tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX)).length-1];
svg.select("#label").text(`${newData.height.toFixed(2)}m at ${formatDate(xScale.invert(newX))}`);
})
svg.on("touchmove", function(event) {
const touchX = event.touches[0].clientX - this.getBoundingClientRect().x;
const newX = Math.max(margin.left, Math.min(w - margin.right, touchX)); // constrain the bar within the chart area
bar.attr("x", newX - 1.5); // update the position of the bar
const newData = tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX))[tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX)).length-1];
svg.select("#label").text(`${newData.height.toFixed(2)}m at ${formatDate(xScale.invert(newX))}`);
});

svg.append("path")
.datum(tideData)
.attr("d", lineFunc)
.attr("fill", "none")
.attr("stroke", "steelblue")
.attr("stroke-width", 2);


// Get current time of day
const currentTime = new Date();


// Get index and values of data points before and after current time
const index = tideData.findIndex(d => new Date(d.datetime) > currentTime);
const before = tideData[index - 1];
const after = tideData[index];

// Calculate percentage between two points for each value
const percentage = (currentTime - new Date(before.datetime)) / (new Date(after.datetime) - new Date(before.datetime));
const interpolatedData = {
datetime: currentTime,
height: before.height + (after.height - before.height) * percentage,
// add other properties here if applicable
};

// Add interpolated data point to data array
tideData.splice(index, 0, interpolatedData);

// Create a variable to store the dragged bar
let draggedBar = null;


// Add vertical bar to chart
const bar = svg.append("rect")
.datum(tideData.filter(d => new Date(d.datetime).getTime() == currentTime.getTime())[0])
.attr("x", d => xScale(new Date(d.datetime)) - 2.5)
.attr("y", margin.top)
.attr("width", 3)
.attr("height", h - margin.top - margin.bottom)
.style("fill", "red");

// Add label to bar
const formatDate = d3.timeFormat("%H:%M");
svg.append("text")
  .attr("id", "label")
  .attr("x", w / 2)
  .attr("y", margin.top - 5)
  .style("text-anchor", "middle")
  .style("fill", "white")
  .text(`${bar.datum().height.toFixed(2)}m at ${formatDate(bar.datum().datetime)}`);


// Add x-axis grid
const xAxisGrid = d3.axisBottom(xScale)
.tickSize(-(h - margin.top - margin.bottom))
.tickFormat('')
.ticks(d3.timeHour.every(1));
svg.append('g')
.attr('class', 'x-axis-grid')
.attr('transform', `translate(0,${h - margin.bottom})`)
.call(xAxisGrid)

// Add y-axis grid
const yAxisGrid = d3.axisLeft(yScale)
.tickSize(-(w - margin.left - margin.right))
.tickFormat('')
.ticks(1);
svg.append('g')
.attr('class', 'y-axis-grid')
.attr('transform', `translate(${margin.left},0)`)
.call(yAxisGrid);


// Add y=0 line to y-axis grid
svg.select('.y-axis-grid')
.select('line')
.style('stroke', 'rgba(0, 0, 0, 0.3)')
.style('stroke-width', '1px');

// Add horizontal lines for each round hour to x-axis grid
svg.selectAll('.x-axis-grid line')
.filter(d => d.getMinutes() === 0 && d.getSeconds() === 0)
.style('stroke', 'rgba(0, 0, 0, 0.3)')
.style('stroke-width', '1px');


});



//__________________________________________________________________________________________




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