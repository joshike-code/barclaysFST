const formatObj = (obj) => {
  const newArray = Object.keys(obj).map((key) => key.split(" ")[1]);
  const newObject = newArray.reduce((acc, val) => {
    return { ...acc, [val]: '' };
  }, {});
  const newVal = Object.values(obj);

  newObject.open = newVal[0];
  newObject.high = newVal[1];
  newObject.low = newVal[2];
  newObject.close = newVal[3];
  newObject.x = '1';
  newObject.volume = '4000000';
  return newObject;
};


const fetchData = async () => {
  await fetch(
      `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=ETH&market=USD&interval=1min&apikey=3B6320CYLJ6BDR9Y`,
  )
  .then((response) => response.json())
    .then((responseJson) => {
    // console.log(responseJson);
      const data = Object.values(Object.values(responseJson)[1]);
      const time = Object.keys(Object.values(responseJson)[1]);
      const newData = [];
      data.forEach((obj, i) => {
        newData[i] = formatObj(data[i]);
        newData[i].x = String(i + 1);
      });
      console.log(newData);
      // console.log(time);

      dataArray = [{
        data: newData
      }];

      FusionCharts.ready(function () {
			var chartObj = new FusionCharts({
        type: 'candlestick',
        renderAt: 'chart-container',
        width: '680',
        height: '390',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "theme": "fusion",
                "caption": "Daily Stock Price HRYS",
                "subCaption": "Last 2 months",
                "numberprefix": "$",
                "vNumberPrefix": " ",
                "pyaxisname": "Price",
                "vyaxisname": "Volume (In Millions)",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5"
            },
            "categories": [{
                "category": [{
                    "label": "2 month ago",
                    "x": "1"
                }, {
                    "label": "1 month ago",
                    "x": "31"
                }, {
                    "label": "Today",
                    "x": "40"
                }, {
                    "label": "2 month ago",
                    "x": "60"
                }]
            }],
            "dataset": dataArray
            //Cut
        }
    }
    );
    chartObj.render();
    });
      
  });
};
fetchData();











