
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill, ApexGrid,
  ApexLegend, ApexMarkers, ApexPlotOptions, ApexResponsive, ApexStates,
  ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip,
  ApexXAxis, ApexYAxis
} from "ng-apexcharts";

export type ChartOptions={
  series: ApexAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  datalabels: ApexDataLabels;
  fill: ApexFill;
  stroke: ApexStroke;
  xaxis:ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  states: ApexStates;
  tooltip: ApexTooltip;
  colors: string[];
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  annotations: ApexAnnotations;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  markers: ApexMarkers
}
