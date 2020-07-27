import {range} from 'd3-array';
import {arc, PieArcDatum} from 'd3-shape';
import {create, Selection} from 'd3-selection';

export interface GaugeChartSection {
  color: string;
  max: number;
  min: number;
}

export interface GaugeChartOptions {
  /**
   * minimum value of the gauge
   */
  min: number;
  /**
   * maximum value of the gauge
   */
  max: number;
  /**
   * background color gauge section
   */
  backgroundSectionColor?: string;
  /**
   * display labels for major tick marks
   * `default: false`
   */
  displayMajorTickLabels?: boolean;
  /**
   * display value of the gauge
   * `default: true`
   */
  displayValue?: boolean;
  /**
   * minimum angle (rad) on the gauge (where top of the chart is 0 and positive clockwise)
   * `default: - PI * 3 / 4`
   */
  minAngle?: number;
  /**
   * maximum angle (rad) on the gauge (where top of the chart is 0 and positive clockwise)
   * `default: PI * 3 / 4`
   */
  maxAngle?: number;
  /**
   * inner radius of the gauge
   * `default: 0.7 * width / 2`
   */
  innerRadius?: number;
  /**
   * outer radius of the gauge
   * `default: width / 2`
   */
  outerRadius?: number;
  /**
   * sections of gauge to indicate different ranges using color
   */
  sections?: GaugeChartSection[];
  /**
   * value between minor ticks
   */
  minorTickStep?: number;
  /**
   * value between major ticks
   */
  majorTickStep?: number;
  /**
   * height of the major tick mark
   * `default: 10`
   */
  majorTickHeight?: number;
  /**
   * height of the minor tick mark
   * `default: 5`
   */
  minorTickHeight?: number;
  /**
   * width of the major tick mark
   * `default: 3`
   */
  majorTickWidth?: number;
  /**
   * width of the minor tick mark
   * `default: 1`
   */
  minorTickWidth?: number;
  /**
   * color of the needle
   * `default: black`
   */
  needleColor?: string;
  /**
   * color of the needle pin (center circle)
   * `default: black`
   */
  needlePinColor?: string;
  /**
   * radius where the needle would point (length of needle)
   * `default: 0.9 * width / 2`
   */
  needleRadius?: number;
  /**
   * color of tick on the gauge
   * `default: black`
   */
  tickColor?: string;
  /**
   * direction of the tick marks from tickRadius
   * `default: "in"`
   */
  tickDirection?: 'in' | 'out';
  /**
   * font size of the tick label
   */
  tickLabelFontSize?: number;
  /**
   * radius where tick labels are aligned
   * `default: innerRadius - tickLabelFontSize`
   */
  tickLabelRadius?: number;
  /**
   * radius where the tick marks are aligned
   * `default: width / 2`
   */
  tickRadius?: number;
  /**
   * font size of the value label
   */
  valueLabelFontSize?: number;
  /**
   * width of the chart
   * `default: 200`
   */
  width?: number;
}

export class GaugeChart {
  private svg: Selection<SVGSVGElement, undefined, null, undefined>;
  private scalingFactor: number;
  private min: number;
  private minAngle: number;
  private displayValue: boolean;

  constructor(value: number, options: GaugeChartOptions) {
    this.angleOfValue = this.angleOfValue.bind(this);
    this.updateNeedle = this.updateNeedle.bind(this);

    const width = options.width ? options.width : 200;
    const { innerRadius, tickLabelFontSize } = {
      tickLabelFontSize: 16,
      innerRadius: 0.7 * width / 2,
      ...options,
    }
    const {
      min, max,
      sections, backgroundSectionColor,
      displayMajorTickLabels, displayValue,
      minAngle, maxAngle, outerRadius,
      needleRadius, needleColor, needlePinColor,
      minorTickStep, majorTickStep, tickDirection,
      majorTickHeight, minorTickHeight, majorTickWidth, minorTickWidth,
      tickColor, tickRadius, tickLabelRadius,
      valueLabelFontSize,
    }: GaugeChartOptions = {
      sections: [] as GaugeChartSection[],
      minAngle: - Math.PI * 3 / 4,
      maxAngle: Math.PI * 3 / 4,
      tickColor: '#000',
      needleColor: '#000',
      needlePinColor: '#000',
      needleRadius: 0.9 * width / 2,
      outerRadius: width / 2,
      majorTickHeight: 10,
      minorTickHeight: 5,
      majorTickWidth: 3,
      minorTickWidth: 1,
      tickDirection: 'in',
      tickRadius: width / 2,
      tickLabelRadius: innerRadius - tickLabelFontSize,
      displayValue: true,
      valueLabelFontSize: 16,
      width: 200,
      ...options,
    };
    const height = width;

    const gaugeArc = arc<PieArcDatum<GaugeChartSection>>().innerRadius(innerRadius).outerRadius(outerRadius);

    this.scalingFactor = (maxAngle - minAngle) / (max - min);
    this.min = min;
    this.minAngle = minAngle;
    this.displayValue = displayValue;

    const arcs = sections.map(data => {
      const [startAngle, endAngle] = [data.min, data.max].map(this.angleOfValue);
      return { data, startAngle, endAngle } as PieArcDatum<GaugeChartSection>;
    });

    const groupTicks = (min: number, max: number, step: number) => {
      return range(min, max + step, step).map(x => {
        return {angle: this.angleOfValue(x)};
      });
    }

    this.svg = create("svg")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(' '))
      .attr("width", width);

    // color sections
    if (backgroundSectionColor) {
      this.svg.append("g").selectAll("path")
        .data([{
          startAngle: minAngle,
          endAngle: maxAngle,
        } as PieArcDatum<GaugeChartSection>])
        .join("path")
          .attr("fill", backgroundSectionColor)
          .attr("d", gaugeArc)
    }

    this.svg.append("g").selectAll("path")
      .data(arcs)
      .join("path")
        .attr("fill", d => d.data.color)
        .attr("d", gaugeArc);

    if (minorTickStep) {
      // add minor ticks
      this.svg.append("g")
        .selectAll("g")
        .data(groupTicks(min, max, minorTickStep))
        .join("g")
          .attr("transform", d => `rotate(${(tickDirection === 'in' ? 0 : 180) + (d.angle * 180 / Math.PI)}) translate(0,${tickDirection === 'in' ? '-' : ''}${tickRadius})`)
        .append("line")
          .attr("stroke", tickColor)
          .attr("stroke-width", minorTickWidth)
          .attr("y2", minorTickHeight);
    }

    if (majorTickStep) {
      // add major ticks
      this.svg.append("g")
        .selectAll("g")
        .data(groupTicks(min, max, majorTickStep))
        .join("g")
          .attr("transform", d => `rotate(${(tickDirection === 'in' ? 0 : 180) + (d.angle * 180 / Math.PI)}) translate(0,${tickDirection === 'in' ? '-' : ''}${tickRadius})`)
        .append("line")
          .attr("stroke", tickColor)
          .attr("stroke-width", majorTickWidth)
          .attr("y2", majorTickHeight);
    }

    // add tick labels
    let tickLabels = majorTickStep && displayMajorTickLabels ?
      range(min, max + majorTickStep, majorTickStep) :
      [min, max];
    this.svg.append("g")
      .selectAll("text")
      .data(tickLabels)
      .join("text")
        .attr("transform", d => {
          const {x,y} = this.radianToCartesian(this.angleOfValue(d), tickLabelRadius);
          return `translate(${x},${y})`;
        })
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("font-size", `${tickLabelFontSize}px`)
        .text(d => d);

    if (!value && value !== 0) {
      value = (min + max) / 2;
    }

    if (displayValue) {
      // add value label
      this.svg.append('text')
        .attr("id", "value-label")
        .attr("transform", `translate(0,${innerRadius})`)
        .attr("text-anchor", "middle")
        .attr("font-size", valueLabelFontSize)
        .text(value);
    }

    // add needle
    this.svg.append("g")
        .attr("id", "needle")
        .attr("style", "transition-duration:0.3s;")
      .append("path")
        .attr('fill', needleColor)
        .attr("d", `M-4,0h8l-3,-${needleRadius}h-2Z`);

    this.svg.append("circle")
      .attr("r","7.5")
      .attr("fill", needlePinColor);

    this.updateNeedle(value);
  }

  public node() {
    return this.svg.node()!;
  }

  public update(updatedValue: number) {
    this.updateNeedle(updatedValue);
    if (this.displayValue) {
      this.svg.select('#value-label')
        .text(updatedValue);
    }
  }

  private angleOfValue (x: number) {
    return ((x - this.min) * this.scalingFactor) + this.minAngle;
  }

  private radianToCartesian (theta:number, r: number) {
    const t = theta - (Math.PI / 2);
    return {
      x: Math.cos(t) * r,
      y: Math.sin(t) * r,
    };
  }

  private updateNeedle(value: number) {
    this.svg.select('#needle')
      .attr("transform", `rotate(${(this.angleOfValue(value)) * 180 / Math.PI})`);
  }
}
