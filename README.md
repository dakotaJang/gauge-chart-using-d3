# gauge-chart-using-d3
Gauge chart using D3

## Usage
```ts
import GaugeChart from "gauge-chart-using-d3";
const gauge = new GaugeChart(50, {
  min: 0,
  max: 100,
  sections: [
    { color:'#0f0', min: 0, max: 40 },
    { color:'#ff0', min: 40, max: 70 },
    { color:'#f00', min: 70, max: 100 },
  ],
  majorTickStep: 10,
  minorTickStep: 2,
  // ...options,
});
document.body.appendChild(gauge.node());
```

## Demo
First clone repo then run following commands
```sh
# install dependencies
npm i

# start demo
npm start
```