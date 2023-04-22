    // // Fetch data from api.marea.ooo

    // const proxyUrl = "https://api.allorigins.win/get?url=";
    // const apiUrl = `https://api.marea.ooo/v2/tides?token=46d1e2c4-61de-40d6-b662-e07154962079&latitude=44.414&longitude=-2.097`;
    // const apiUrlWithProxy = `${proxyUrl}${encodeURIComponent(apiUrl)}`;

    // fetch(apiUrlWithProxy)
    //   .then(response => response.json())
    //   .then(datamarea => {
    //     // Do something with the data here
    //     const dataMarea = JSON.parse(datamarea.contents);
    //     const extremes = dataMarea.extremes;
    //     console.log(extremes);

    //   })
    //   .catch(error => console.error(error));



    function getTideHeight(tideData, datetimeStr) {
        const datetime = new Date(datetimeStr);
        for (let i = 0; i < tideData.length - 1; i++) {
          const currentTide = tideData[i];
          const nextTide = tideData[i + 1];
          const currentTideTime = new Date(currentTide.datetime);
          const nextTideTime = new Date(nextTide.datetime);
          if (currentTideTime <= datetime && datetime < nextTideTime) {
            // Interpolate tide height using a sinusoidal function between two neighboring tides
            const timeDiff = nextTideTime - currentTideTime;
            const heightDiff = nextTide.height - currentTide.height;
            const timeSinceLastTide = datetime - currentTideTime;
            const fractionOfTime = timeSinceLastTide / timeDiff;
            const tideHeight = currentTide.height + heightDiff * (Math.sin(Math.PI * fractionOfTime - Math.PI / 2) + 1) / 2;
            return tideHeight;
          }
        }
        // If the datetime is after the last tide, return the height of the last tide
        return tideData[tideData.length - 1].height;
      }
      

      
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
        }
      ];
      
      const height = getTideHeight(tideData, "2023-04-23T07:30:00+00:00");
      console.log(height);
      

      