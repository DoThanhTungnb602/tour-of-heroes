import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { single } from './data';

@Component({
  selector: 'app-bar-vertical-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './bar-verticle-chart.component.html',
})
export class BarVerticleChartComponent {
  single!: any[];
  multi!: any[];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme: string | Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  } as string | Color;

  constructor() {
    Object.assign(this, { single });
  }

  onSelect(event) {
    console.log(event);
  }
}
