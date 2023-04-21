const url = 'https://www.worldtides.info/api/v3?heights&date=2023-04-21&lat=-2.5173892&lon=-44.2194533&key=c9d913ab-11f3-46c6-8a63-0c299af24f47';

// -2.5173892,-44.2194533
// lat=-2.5173892&lon=-44.2194533

fetch(url)
  .then(response => response.json())
  .then(data => {
    const times = data.heights.map(d => new Date(d.date).toLocaleTimeString());
    const heights = data.heights.map(d => d.height);

    const canvas = document.getElementById('my-chart');
    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: times,
        datasets: [{
          label: 'Height',
          data: heights,
          borderColor: 'blue',
          borderWidth: 1,
          pointRadius: 0,
          showLine: true,
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          }
        },
        scales: {
          x: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              display: false
            },
            grid: {
              display: false,
            },
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },

    });

    const dragBar = document.querySelector('.drag-bar');
    const infoDiv = document.getElementById('info');
    let isDragging = false;

    dragBar.addEventListener('mousedown', function (event) {
      isDragging = true;
    });

    document.addEventListener('mousemove', function (event) {
      if (isDragging) {
        const containerWidth = document.querySelector('.chart-container').offsetWidth;
        const barWidth = dragBar.offsetWidth;
        const barHalfWidth = barWidth / 2;
        const chartLeft = canvas.getBoundingClientRect().left;
        const chartRight = canvas.getBoundingClientRect().right;
        let barLeft = event.clientX - chartLeft - barHalfWidth;
        barLeft = Math.max(barLeft, 0);
        barLeft = Math.min(barLeft, containerWidth - barWidth);
        dragBar.style.left = barLeft + 'px';
        const dataIndex = Math.round((barLeft + barHalfWidth) / containerWidth * (data.heights.length - 1));
        const time = data.heights[dataIndex].date;
        const height = data.heights[dataIndex].height;
        infoDiv.innerHTML = `${time}: ${height.toFixed(2)}m`;
      }
    });

    document.addEventListener('mouseup', function (event) {
      isDragging = false;
    });

    
  })
  .catch(error => console.error(error));
