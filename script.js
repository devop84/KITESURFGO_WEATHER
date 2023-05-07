const mareatoken = '910c014a-e33d-4bdf-b1cf-6738e8e281b2';

// Get current time of day
const currentTime = new Date();

// Get references to HTML elements
const toggleSelectLocation = document.getElementById('toggle-select-location');
const selectLocation = document.querySelector('.select-location');
const myLocation = document.getElementById('my_location');
const submitLocation = document.getElementById('submit_location');
const refreshLocation = document.getElementById('refresh_location');
const inputLocation = document.getElementById('input_location');
const conditionWindArrow = document.getElementById("wind_arrow");
const locationName = document.getElementById("location_name");
const locationTemp = document.getElementById("location_temp");
const conditionIcon = document.getElementById("condition_icon");
const conditionWindDir = document.getElementById("wind_dir");
const conditionWindPrev = document.getElementById("wind_prev");
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

// Function to determine the wind direction arrow based on the wind degree
function getWindArrow(windDegree) {
  const arrows = ["north", "north_east", "east", "south_east", "south", "south_west", "west", "north_west"];
  const index = Math.round((windDegree % 360) / 45);
  const oppositeIndex = (index + 4) % 8;
  return arrows[oppositeIndex];
}

// Function to fetch weather data from the API
async function fetchAPI() {
  try {
    // Get the user's input and trim whitespace
    inputValue = inputLocation.value.trim();

    // Store the value of myConst in Local Storage
    localStorage.setItem("storedInputValue", inputValue);

    // Fetch data from the API using the user's input
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f44e471964df45d79da184125231904&q=${inputValue}`);
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
    const startofDayUnix = data.forecast.forecastday[0].date_epoch;
    const lastUpdatedEpoch = data.current.last_updated_epoch;

    // Find the first hour in the forecast after the current time
    const hours = data.forecast.forecastday[0].hour;
    const nextHour = hours.find(hour => hour.time_epoch > lastUpdatedEpoch);

    // Extract the wind speed in kph for the next hour
    const nextHourWindKph = nextHour.wind_kph;

    // Convert wind speed from km/h to knots and round to 1 decimal place
    function kphToKnots(kph) {
      return (kph * 0.539956803).toFixed(1);
    }
    const windKn = kphToKnots(windKph);



    // Determine the wind direction arrow based on the wind degree
    const windArrow = getWindArrow(windDegree);

    // Update the HTML elements with the extracted data
    locationName.textContent = name;
    locationTemp.textContent = `${tempC}°C`;
    conditionIcon.src = `http:${icon}`;
    conditionWindDir.textContent = windDir;
    conditionWindKn.textContent = `${windKn} kn`;
    conditionWindArrow.textContent = windArrow;
    currentLastUpdated.textContent = lastUpdated;


    
    if (parseFloat(nextHourWindKph) >= parseFloat(windKph)) {
      conditionWindPrev.textContent = "arrow_drop_up";
      conditionWindPrev.style.color = "greenyellow";
    } else {
      conditionWindPrev.textContent = "arrow_drop_down";
      conditionWindPrev.style.color = "red";
    }

    fetch(`https://corsproxy.io/?https://api.marea.ooo/v2/tides?token=${mareatoken}&latitude=${lat}&longitude=${lon}&timestamp=${startofDayUnix}&interval=1&datum=LAT`)
    .then(response => response.json())
    .then(datamarea => {
      const tideData = datamarea.heights;

      //chart dimension
      const w = document.getElementById('chart-container').offsetWidth;
      const h = document.getElementById('chart-container').offsetHeight;
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
        .curve(d3.curveCatmullRom);
    
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
        .on("mousemove", function (event) {
          const mouseX = event.offsetX || event.layerX; // get the x-coordinate of the mouse pointer
          const newX = Math.max(margin.left, Math.min(w - margin.right, mouseX)); // constrain the bar within the chart area
          bar.attr("x", newX - 1.5); // update the position of the bar
          const newData = tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX))[tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX)).length - 1];
          svg.select("#label").text(`${newData.height.toFixed(2)}m at ${formatDate(xScale.invert(newX))}`);
        })
        .on("touchmove", function (event) {
          const touchX = event.touches[0].clientX - this.getBoundingClientRect().x;
          const newX = Math.max(margin.left, Math.min(w - margin.right, touchX)); // constrain the bar within the chart area
          bar.attr("x", newX - 1.5); // update the position of the bar
          const newData = tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX))[tideData.filter(d => new Date(d.datetime) <= xScale.invert(newX)).length - 1];
          svg.select("#label").text(`${newData.height.toFixed(2)}m at ${formatDate(xScale.invert(newX))}`);
        });
    
      svg.append("path")
        .datum(tideData)
        .attr("d", lineFunc)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
    
      // Get index and values of data points before and after current time
      const index = tideData.findIndex(d => new Date(d.datetime) > currentTime);
      const before = tideData[index - 1];
      const after = tideData[index];
    
      // Calculate percentage between two points for each value
      const percentage = (currentTime - new Date(before.datetime)) / (new Date(after.datetime) - new Date(before.datetime));
      const interpolatedData = {
        datetime: currentTime,
        height: before.height + (after.height - before.height) * percentage,
      };
    
      // Add interpolated data point to data array
      tideData.splice(index, 0, interpolatedData);
    
      // Add vertical bar to chart
      const bar = svg.append("rect")
        .datum(tideData.filter(d => new Date(d.datetime).getTime() == currentTime.getTime())[0])
        .attr("x", d => xScale(new Date(d.datetime)) - 2.5)
        .attr("y", margin.top)
        .attr("width", 2)
        .attr("height", h - margin.top - margin.bottom)
        .style("fill", "red");
    
      // Add label to show bar intersection values
      const formatDate = d3.timeFormat("%H:%M");
      svg.append("text")
        .attr("id", "label")
        .attr("x", w / 2)
        .attr("y", margin.top - 10)
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(`${bar.datum().height.toFixed(2)}m at ${formatDate(bar.datum().datetime)}`);
    
      // Add x-axis grid
      const xAxisGrid = d3.axisBottom(xScale)
        .tickSize(-(h - margin.top - margin.bottom))
        .tickFormat(d3.timeFormat('%H:%M'))
        .ticks(d3.timeHour.every(3));
      svg.append('g')
        .attr('class', 'x-axis-grid')
        .attr('transform', `translate(0,${h - margin.bottom})`)
        .call(xAxisGrid)
    
      // Add vertical lines for each round hour to x-axis grid
      svg.selectAll('.x-axis-grid line')
        .filter(d => d.getMinutes() === 0 && d.getSeconds() === 0)
        .style('stroke', 'rgba(0, 0, 0, 0.3)')
        .style('stroke-width', '1px');
    
      // Add y-axis grid
      const yAxisGrid = d3.axisLeft(yScale)
        .ticks(yScale.ticks().length * 2) // double the number of ticks
        .tickSize(-(w - margin.left - margin.right))
        .tickFormat(d => d.toFixed(1)) // format number to one decimal place
        .ticks(2);
      svg.append('g')
        .attr('class', 'y-axis-grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxisGrid);
    
      // Add y=0 line to y-axis grid
      svg.selectAll('.y-axis-grid line')
        .style('stroke', 'rgba(0, 0, 0, 0.3)')
        .style('stroke-width', '1px');
    
    });

    selectLocation.classList.remove('display-select-location');

  } catch (error) {
    console.error(error);
  }
}

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = `${latitude},${longitude}`;
        inputLocation.value = location;
        resolve(location);
      }, error => reject(error));
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

// // Function to get the user's IP address
async function getIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
  }
}

// Get the last value of myConst from Local Storage
const lastValue = localStorage.getItem("storedInputValue");

// // Call getIpAddress first to get the IP address, then call fetchAPI with the IP address as a parameter
getIpAddress()
  .then(ipAddress => {
    if (lastValue) {
      inputLocation.value = lastValue;
      fetchAPI(lastValue);
    } else if (inputLocation.value.trim() === '') {
      inputLocation.value = ipAddress;
      fetchAPI(ipAddress);
    } else {
      fetchAPI(inputLocation.value.trim());
    }
  });

submitLocation.addEventListener('click', fetchAPI);
refreshLocation.addEventListener('click', fetchAPI);