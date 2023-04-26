// Get start of the day in Unix (utc)
const now = new Date();
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startofDayUnix = startOfDay.getTime() / 1000;

const token = '46d1e2c4-61de-40d6-b662-e07154962079';
const lat = '-2.5643194097356137';
const lon = '-42.744428410495985';

const proxyUrl = "https://api.allorigins.win/get?url=";
const apiUrl = `https://api.marea.ooo/v2/tides?token=${token}&latitude=${lat}&longitude=${lon}&timestamp=${startofDayUnix}`;
const apiUrlWithProxy = `${proxyUrl}${encodeURIComponent(apiUrl)}`;


fetch(apiUrlWithProxy)
.then(response => response.json())

.then(datamarea => {
  const dataMarea = JSON.parse(datamarea.contents);
  const tideData = dataMarea.heights;
  console.log(tideData);

  // Convert datetime into local time
  const tideDataLocal = tideData.map((data) => {
    const datetimeLocal = new Date(data.datetime).toLocaleString();
    return {...data, datetimeLocal: datetimeLocal};
  });

  function createChart(data) {
    // Extract datetime and height values from the data array
    const datetimeValues = data.map(entry => entry.datetimeLocal);
    const heightValues = data.map(entry => entry.height);
  
    // Create a new Chart object and specify the chart type and data
    const chart = new Chart(document.getElementById('myChart'), {
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
        }]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Height'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Datetime'
            }
          }
        }
      }
    });
  }
  createChart(tideDataLocal);
})
.catch(error => console.error(error));

