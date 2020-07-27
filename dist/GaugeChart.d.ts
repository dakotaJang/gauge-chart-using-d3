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
export declare class GaugeChart {
    private svg;
    private scalingFactor;
    private min;
    private minAngle;
    private displayValue;
    constructor(value: number, options: GaugeChartOptions);
    node(): SVGSVGElement;
    update(updatedValue: number): void;
    private angleOfValue;
    private radianToCartesian;
    private updateNeedle;
}
