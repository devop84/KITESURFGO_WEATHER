const tideData = [
  {
    "timestamp": 1682204552,
    "height": -1.7772909106,
    "state": "LOW TIDE",
    "datetime": "2023-04-22T23:02:32+00:00"
  },
  {
    "timestamp": 1682227303,
    "height": 1.5390116396,
    "state": "HIGH TIDE",
    "datetime": "2023-04-23T05:21:43+00:00"
  },
  {
    "timestamp": 1682248693,
    "height": -1.5165860946,
    "state": "LOW TIDE",
    "datetime": "2023-04-23T11:18:13+00:00"
  },
  {
    "timestamp": 1682271166,
    "height": 1.5183191763,
    "state": "HIGH TIDE",
    "datetime": "2023-04-23T17:32:46+00:00"
  },
  {
    "timestamp": 1682204552,
    "height": -1.7772909106,
    "state": "LOW TIDE",
    "datetime": "2023-04-24T01:02:32+00:00"
  }
];

// Get the canvas element
const canvas = document.getElementById('tideChart');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 600;
canvas.height = 400;

// Define the chart properties
const chart = {
minValue: -2, // The minimum value of the chart
maxValue: 2, // The maximum value of the chart
padding: {
  top: 20,
  right: 20,
  bottom: 50,
  left: 50
},
pointRadius: 5, // The radius of the data points
pointColor: '#007bff', // The color of the data points
lineColor: '#007bff', // The color of the chart line
lineWidth: 2, // The width of the chart line
};

// Draw the chart axis
const yRatio = canvas.height / (chart.maxValue - chart.minValue);
const xRatio = canvas.width / (tideData.length - 1);

ctx.beginPath();
ctx.moveTo(chart.padding.left, chart.padding.top);
ctx.lineTo(chart.padding.left, canvas.height - chart.padding.bottom);
ctx.lineTo(canvas.width - chart.padding.right, canvas.height - chart.padding.bottom);
ctx.stroke();

// Draw the chart label and ticks
ctx.font = '12px Arial';
ctx.fillStyle = '#000000';
ctx.textAlign = 'center';

// Draw the y-axis ticks
for (let y = chart.minValue; y <= chart.maxValue; y++) {
const yPos = canvas.height - chart.padding.bottom - (y - chart.minValue) * yRatio;
ctx.beginPath();
ctx.moveTo(chart.padding.left - 5, yPos);
ctx.lineTo(chart.padding.left, yPos);
ctx.stroke();
ctx.fillText(y, chart.padding.left - 20, yPos);
}

// Draw the x-axis label and ticks
ctx.fillText('Time', canvas.width / 2, canvas.height - chart.padding.bottom / 2);

// Draw the x-axis ticks
for (let i = 0; i < tideData.length; i++) {
const xPos = chart.padding.left + i * xRatio;
ctx.beginPath();
ctx.moveTo(xPos, canvas.height - chart.padding.bottom);
ctx.lineTo(xPos, canvas.height - chart.padding.bottom + 5);
ctx.stroke();
const date = new Date(tideData[i].timestamp * 1000);
ctx.fillText(date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2), xPos, canvas.height - chart.padding.bottom + 20);
}

// Draw the chart line and data points
ctx.beginPath();
ctx.strokeStyle = chart.lineColor;

for (let i = 0; i < tideData.length; i++) {
const yPos = canvas.height - chart.padding.bottom - (tideData[i].height - chart.minValue) * yRatio;
const xPos = chart.padding.left + i * xRatio;

// Draw the data point
ctx.fillStyle = chart.pointColor;
ctx.beginPath();
ctx.arc(xPos, yPos, chart.pointRadius, 0, 2 * Math.PI);
ctx.fill();

// Draw the chart line
if (i === 0) {
  ctx.moveTo(xPos, yPos);
} else {
  ctx.lineTo(xPos, yPos);
}
}

ctx.stroke();
