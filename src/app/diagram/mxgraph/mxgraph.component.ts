import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import * as mxgraph from 'mxgraph';

type Block = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

const blocks = [
  {
    id: 'block-1',
    label: 'Block 1',
    x: 20,
    y: 150,
    width: 80,
    height: 30,
  },
  {
    id: 'block-2',
    label: 'Block 2',
    x: 200,
    y: 150,
    width: 80,
    height: 30,
  },
  {
    id: 'block-3',
    label: 'Block 3',
    x: 400,
    y: 150,
    width: 80,
    height: 30,
  },
];

const edges = [
  {
    id: 'edge-1',
    source: 'block-1',
    target: 'block-2',
    label: 'Connection 1',
  },
];

@Component({
  selector: 'app-mxgraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mxgraph.component.html',
  styleUrl: './mxgraph.component.css',
})
export default class MxgraphComponent {
  @ViewChild('graphContainer') containerElementRef!: ElementRef;

  get container() {
    return this.containerElementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    mxEvent.disableContextMenu(this.container);
    const graph = new mxGraph(this.container);
    const keyHandler = new mxgraph.mxKeyHandler(graph);
    graph.setCellsEditable(false);
    graph.isCellMovable = (cell) => !cell.isEdge();
    graph.isLabelMovable = () => false;
    graph.setConnectable(true);
    new mxRubberband(graph);
    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      const blocksMap = blocks.reduce((acc, block) => {
        const { id, label, x, y, width, height } = block;
        const vertex = graph.insertVertex(
          parent,
          id,
          label,
          x,
          y,
          width,
          height
        );
        acc[id] = vertex;
        return acc;
      }, {} as Record<string, mxCell>);

      keyHandler.bindKey(46, function (evt) {
        // 46 is the key code for the 'delete' key
        if (graph.isEnabled()) {
          const cells = graph.getSelectionCells();
          const edges = cells.filter((cell) => cell.isEdge());
          graph.removeCells(cells, edges);
        }
      });

      graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
        const cell = evt.getProperty('cell');
        if (cell) {
          console.log(cell);
        }
      });

      graph.addListener(mxEvent.CELL_CONNECTED, (sender, evt) => {
        const edge = evt.getProperty('edge');
        const terminal = evt.getProperty('terminal');
        const source = evt.getProperty('source');

        if (edge != null) {
          console.log('Edge with id: ' + edge.id + ' has changed.');
          if (terminal) {
            if (source) {
              console.log('New source cell id: ' + terminal.id);
            } else {
              console.log('New target cell id: ' + terminal.id);
            }
          }
        }
      });

      graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
        const cells = evt.getProperty('cells');
        const dx = evt.getProperty('dx');
        const dy = evt.getProperty('dy');

        cells.forEach(function (cell) {
          const geometry = cell.getGeometry();
          console.log('Cell with id: ' + cell.id + ' has moved.');
          console.log('Change in x-coordinate: ' + dx);
          console.log('Change in y-coordinate: ' + dy);
          console.log('New x-coordinate: ' + geometry.x);
          console.log('New y-coordinate: ' + geometry.y);
        });
      });

      edges.forEach((edge) => {
        const { id, label, source, target } = edge;
        graph.insertEdge(
          parent,
          id,
          label,
          blocksMap[source],
          blocksMap[target]
        );
      });
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }
}
