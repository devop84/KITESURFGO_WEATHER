
var data = {
  labels: ["2023-04-22T23:02:32+00:00", "2023-04-23T05:21:43+00:00", "2023-04-23T11:18:13+00:00", "2023-04-23T17:32:46+00:00"],
  datasets: [{
      label: "Height",
      data: [-1.7772909106, 1.5390116396, -1.5165860946, 1.5183191763],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      lineTension: 0.1
  }]
};

var options = {
scales: {
  xAxes: [{
      type: 'time',
      time: {
          displayFormats: {
              hour: 'h:mm a'
          },
          display: false // add this line
      },
      scaleLabel: {
          display: false,
          labelString: 'Time'
      }
  }],
  yAxes: [{
      scaleLabel: {
          display: true,
          labelString: 'Height',
      }
  }]
},
plugins: {
  legend: {
      display:false,
  }
}
};