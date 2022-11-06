
const spike = document.getElementById('spike');
const spikeBtn = document.getElementById('spike-btn');
const closeSpike = document.getElementById('close-spike');
const lastPrice = document.getElementById('last-price');
const mainHigh = document.getElementById('main-high');
const mainLow = document.getElementById('main-low');
const mainChange = document.getElementById('main-change');
const mainVolume = document.getElementById('main-volume');
const pricePanel = document.querySelector('.price-panel');
const bigPrice = document.querySelector('.big-price');
const bigChange = document.querySelector('.big-change');
const bigPercent = document.querySelector('.big-percent');
const openI = document.querySelector('.open-i span');
const highI = document.querySelector('.high-i span');
const lowI = document.querySelector('.low-i span');
const closeI = document.querySelector('.close-i span');
const bigPairName = document.querySelector('.big-pair-name');
const bigPairFull = document.querySelector('.big-pair-full');
const eurUsd = document.querySelector('.eur-usd');
const gbpUsd = document.querySelector('.gbp-usd');
const eurGbp = document.querySelector('.eur-gbp');
const usdJpy = document.querySelector('.usd-jpy');
const usdCad = document.querySelector('.usd-cad');
const usdInr = document.querySelector('.usd-inr');
const usdZar = document.querySelector('.usd-zar');

const pairs = [
  [eurUsd, 'EUR USD', 'Euro / U.S. Dollar', 'https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC&market=USD&interval=1min&apikey=3B6320CYLJ6BDR9Y'],
  [gbpUsd, 'GBP USD', 'Pounds / U.S. Dollar', 'https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=GBP&market=USD&interval=1min&apikey=3B6320CYLJ6BDR9Y']
];


const colorChange = (valChng, el) => {
  if (valChng > 0) {
    el.classList.remove('crypt-down');
    el.classList.add('crypt-up');
  } else {
    el.classList.remove('crypt-up');
    el.classList.add('crypt-down');
  };
};

const borderChange = (valChng, el) => {
  if (valChng > 0) {
    el.classList.remove('border-down');
    el.classList.add('border-up');
  } else {
    el.classList.remove('border-up');
    el.classList.add('border-down');
  };
};

const changeRate = (newData, oldData) => rate = ((newData / oldData) - 1) * 100;



function loadTradePair(pair) {
  const pairId = pair[0];
  const pairName = pair[1];
  const pairNameFull = pair[2];
  const pairApi = pair[3];
  pairId.addEventListener('click', function () {
    const api = pairApi;
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
      newObject.x = '';
      newObject.volume = newArray[4] ? String(newVal[4]) : '';
      return newObject;
    };


    const fetchData = async () => {
      let url = api;
      try {
        let res = await fetch(url);
        let responseJson = await res.json();
        let oldData = Object.values(Object.values(responseJson)[1]);
        let time = Object.keys(Object.values(responseJson)[1]);
        let newData = [];
        oldData.forEach((obj, i) => {
          newData[i] = formatObj(oldData[i]);
          newData[i].x = String(i + 1);
        });
        return [newData, time];
      } catch (error) {
        console.log(error);
      }
    };


    const renderChart = async () => {
      let allData = await fetchData();
      let newData = allData[0];
      let timeData = allData[1];
      
      const schema = [{
      name: "Date",
      type: "date",
      format: "%m/%d/%Y, %I:%M:%S %p"
      }, {
        "name": "Open",
        "type": "number"
      }, {
        "name": "High",
        "type": "number"
      }, {
        "name": "Low",
        "type": "number"
      }, {
        "name": "Close",
        "type": "number"
      }, {
        "name": "Volume",
        "type": "number"
        }];
      
      

      const fd = (d) => {
        return d.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
      };

      function utcTimeFormat(time) {
        // const br = time.split(', ');
        // const h = br[1].split(":")
        // let n = (parseInt(h[0]) + 1) % 24;
        // // if (n.length = 1){
        // //   n = "0" + n;
        // // }
        // const utcPlusOne = n + ":" + h[1] + ":" + h[2];
        // const dateTime = [br[0], utcPlusOne].join(', ');
        // return dateTime;
        return time;
      };

      console.log(fd(new Date(timeData[0])));
      console.log(utcTimeFormat(fd(new Date(timeData[0]))));


      let data = [];
      newData.forEach((d, i) => {
        data[i] = ["" + utcTimeFormat(fd(new Date(timeData[i]))), Number(newData[i].open), Number(newData[i].high), Number(newData[i].low), Number(newData[i].close), Number(newData[i].volume)];
      });
      data.reverse();
      console.log(data);

      let dataStore = new FusionCharts.DataStore();

      let realtimeChart = new FusionCharts({
        type: "timeseries",
        renderAt: "chart-container",
        width: "100%",
        height: "500",
        dataSource: {
          chart: {
            showValues: '1',
            theme: "fusion"
          },
          extensions: {
            "standardRangeSelector": {
              "enabled": "0"
            },
            "customRangeSelector": {
              "enabled": "0"
            }
          },
          data: dataStore.createDataTable(data, schema),
          caption: {
            text: "Microsoft Corporation Stock Price"
          },
          subcaption: {
            text: "Real-time live data: NASDAQ MSFT"
          },
          yaxis: [{
            plot: {
              value: {
                open: "Open",
                high: "High",
                low: "Low",
                close: "Close"
              },
              type: "candlestick"
            },
            format: {
              prefix: "$"
            },
            title: "Stock Value"
          }]
        }
      });

      realtimeChart.addEventListener("renderComplete", function (_ref) {
        let realtimeChart = _ref.sender;
        let spikeData = [];

        //Demo
        // spikeData = [['11/05/2022, 2:58:00 PM', 21320], ['11/05/2022, 2:50:00 PM', 21340], ['11/05/2022, 8:11:00 PM', 2500]];

        spikeBtn.addEventListener('click', function () {
          // spikeData.push([fd(new Date(new Date(Date.now()).setSeconds(0))), Number(spike.value)]);
          spikeData.push(['11/06/2022, 1:25:00 PM', Number(spike.value)]);
          console.log(fd(new Date(new Date(Date.now()).setSeconds(0))), Number(spike.value))
        });

        realtimeChart.lastInterval = setInterval(updateChart, 5000);
        
        async function updateChart() {
          let allUpd = await fetchData();
          let updData = allUpd[0];
          let updTime = allUpd[1];
          const priceData = Number(updData[0].close);
          closeSpike.innerHTML = `Close: ${priceData}`;
          console.log(spikeData, spikeData.length);
          if (realtimeChart.feedData) {
            const populateData = [];
            let rendData = [];
            let wantedData;
            newData.forEach((d, i) => {
                populateData[i] = ["" + utcTimeFormat(fd(new Date(updTime[i]))), Number(updData[i].open), Number(updData[i].high), Number(updData[i].low), Number(updData[i].close), Number(updData[i].volume)];
              });
            populateData.reverse();
            if (spikeData.length > 0) {
              spikeData.forEach((spike, i) => {
                wantedData = populateData.find(el => el[0] === spikeData[i][0]);
                if (wantedData) {
                  wantedData?.splice(4, 1, spikeData[i][1]);
                  // console.log(populateData.indexOf(wantedData));
                  populateData.splice(populateData.indexOf(wantedData), 1, wantedData);
                  console.log('replacing with spiked data');
                };
              });
            };
            rendData = populateData;
            console.log(rendData);
            realtimeChart.feedData(rendData);
            rendData.reverse();
            const open = Number(rendData[0][1]).toFixed(2);
            const openChange = Number(rendData[0][1]) - Number(rendData[1][1]);
            colorChange(openChange, openI);
            const high = Number(rendData[0][2]).toFixed(2);
            const highChange = Number(rendData[0][2]) - Number(rendData[1][2]);
            colorChange(highChange, mainHigh);
            colorChange(highChange, highI);
            const low = Number(rendData[0][3]).toFixed(2);
            const lowChange = Number(rendData[0][3]) - Number(rendData[1][3]);
            colorChange(lowChange, mainLow);
            colorChange(lowChange, lowI);
            const close = Number(rendData[0][4]).toFixed(2);
            const closeChange = Number(rendData[0][4]) - Number(rendData[1][4]);
            const priceRate = changeRate(Number(rendData[0][4]), Number(rendData[1][4]));
            colorChange(closeChange, mainChange);
            colorChange(closeChange, closeI);
            colorChange(closeChange, bigPrice);
            colorChange(closeChange, lastPrice);
            colorChange(closeChange, bigChange);
            colorChange(closeChange, bigPercent);
            borderChange(closeChange, pricePanel);
            const volume = Math.trunc(Number(rendData[0][5]));

            openI.innerHTML = open;
            highI.innerHTML = high;
            lowI.innerHTML = low;
            closeI.innerHTML = close;
            lastPrice.innerHTML = close;
            bigPrice.innerHTML = close;
            mainHigh.innerHTML = high;
            mainLow.innerHTML = low;
            mainVolume.innerHTML = volume;
            mainChange.innerHTML = `${closeChange.toFixed(3) > 0 ? '+' + closeChange.toFixed(3) : closeChange.toFixed(3)} ${priceRate.toFixed(5)}%`;
            bigChange.innerHTML = Math.abs(closeChange.toFixed(5));
            bigPercent.innerHTML = `(${Math.abs(priceRate.toFixed(3))}%)`;
            bigPairName.innerHTML = pairName;
            bigPairFull.innerHTML = pairNameFull;
            pairId.classList.add('acting');
          }
        };
        updateChart();
      });

      realtimeChart.addEventListener("disposed", function(eventObj){
          var chartRef = eventObj;
          console.log('dispose fired');
          clearInterval(chartRef.lastInterval);
      });

      realtimeChart.render();
    }
    renderChart();
  });
};
pairs.forEach(pair => loadTradePair(pair));























