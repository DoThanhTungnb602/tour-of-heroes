import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarVerticleChartComponent } from '../bar-verticle-chart/bar-verticle-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'app-ngx-charts',
  standalone: true,
  imports: [CommonModule, BarVerticleChartComponent, PieChartComponent],
  templateUrl: './ngx-charts.component.html',
})
export default class NgxChartsComponent {}
