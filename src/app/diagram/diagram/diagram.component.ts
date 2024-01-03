import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDiagramModule } from 'devextreme-angular';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [CommonModule, DxDiagramModule],
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.css',
})
export default class DiagramComponent {

}
