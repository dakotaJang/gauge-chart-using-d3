import GaugeChart from "./index";

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
});

const slider = document.createElement('input');
slider.setAttribute("type", "range");
slider.setAttribute("min", "0");
slider.setAttribute("max", "100");

document.body.appendChild(gauge.node());
document.body.appendChild(slider);
slider.addEventListener('change', () => gauge.update(Number(slider.value)));