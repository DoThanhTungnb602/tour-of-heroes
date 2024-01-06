import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { v4 as uuidv4 } from 'uuid';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GraphComponent } from './graph/graph.component';
import {
  NzNotificationPlacement,
  NzNotificationService,
} from 'ng-zorro-antd/notification';

import * as mxgraph from 'mxgraph';
import _ from 'lodash';

export type Block = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Edge = {
  id: string;
  label: string;
  source: string;
  target: string;
  x: number;
  y: number;
};

export type Graph = {
  blocks: Block[];
  edges: Edge[];
};

@Component({
  selector: 'app-mxgraph',
  standalone: true,
  imports: [CommonModule, NzButtonComponent, NzIconModule, GraphComponent],
  templateUrl: './mxgraph.component.html',
  styleUrl: './mxgraph.component.css',
})
export default class MxgraphComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);

  @ViewChild('graphContainer') containerElementRef!: ElementRef;

  private graph!: mxGraph;
  private graphData!: Graph;
  private parent!: any;
  public selectedCells: mxCell[] = [];

  constructor(private notification: NzNotificationService) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/graphData').subscribe((data) => {
      this.graphData = data as Graph;
      if (this.graphData.blocks.length > 0 || this.graphData.edges.length > 0) {
        this.graph.getModel().beginUpdate();
        try {
          const cells = this.graph.getChildCells(this.parent);
          this.graph.removeCells(cells);

          const blocksMap = this.graphData.blocks.reduce((acc, block) => {
            const { id, label, x, y, width, height } = block;
            const vertex = this.graph.insertVertex(
              this.parent,
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
          this.setBlockBackground();
          this.graphData.edges.forEach((edge) => {
            const { id, label, source, target } = edge;
            const geometry = new mxGeometry();
            geometry.points = [new mxPoint(edge.x, edge.y)];
            const newEdge = this.graph.insertEdge(
              this.parent,
              id,
              label,
              blocksMap[source],
              blocksMap[target]
            );
            this.graph.getModel().setGeometry(newEdge, geometry);
          });
        } finally {
          this.graph.getModel().endUpdate();
        }
      }
    });
  }

  get container() {
    return this.containerElementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.setUpGraph();
    this.addEventListeners();
  }

  onCellDoubleClicked(cell: mxCell) {
    console.log('Cell double clicked: ', cell);
  }

  onCellsMoved(cells: mxCell[], dx: number, dy: number) {}

  onNewEdgeConnected(edge: mxCell) {
    const id = uuidv4();
    edge.setId(id);
    this.syncGraphData();
  }

  onEdgeChanged(edge: any) {
    // if (edge.source != null && edge.target != null) {
    // const graphData = _.cloneDeep(this.graphData);
    // const index = graphData.edges.findIndex((edge) => edge.id === edge.id);
    // if (index > -1) {
    //   graphData.edges[index] = {
    //     id: edge.id,
    //     label: edge.value,
    //     source: edge.source.id,
    //     target: edge.target.id,
    //   };
    // }
    // this.graphData = graphData;
    // }
  }

  setUpGraph() {
    mxEvent.disableContextMenu(this.container);

    this.graph = new mxGraph(this.container);

    this.graph.setCellsEditable(false);
    this.graph.isCellMovable = (cell) => !cell.isEdge();
    this.graph.isLabelMovable = () => false;
    this.graph.setConnectable(true);
    new mxRubberband(this.graph);
    this.parent = this.graph.getDefaultParent();
    this.setEdgeLableFontColor(this.graph, '#334155');
    mxEdgeHandler.prototype.curved = true;
    let style = this.graph.getStylesheet().getDefaultEdgeStyle();
    style['edgeStyle'] = mxEdgeStyle.ElbowConnector;
    style['rounded'] = true;
    this.addBlock('Start', 0, 0, 80, 30);
    this.addBlock('End', 0, 0, 80, 30);
  }

  addEventListeners() {
    const connectionHandler = this.graph.connectionHandler;

    connectionHandler.addListener(mxEvent.END, (sender, evt) => {
      const edge = evt.getProperty('cell');
      if (edge) {
        if (edge.source === null || edge.target === null) {
          this.graph.removeCells([edge]);
        } else {
          this.onNewEdgeConnected(edge);
        }
      }
    });

    this.graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
      const cell = evt.getProperty('cell');
      if (cell) {
        this.onCellDoubleClicked(cell);
      }
    });

    this.graph.addListener(mxEvent.CELL_CONNECTED, (sender, evt) => {
      const edge = evt.getProperty('edge');
      const terminal = evt.getProperty('terminal');
      const source = evt.getProperty('source');
      const target = evt.getProperty('target');

      if (edge != null && !source && terminal == undefined) {
        this.graph.removeCells([edge]);
      } else if (edge != null && !target && terminal == undefined) {
        this.graph.removeCells([edge]);
      }
    });

    this.graph.getModel().addListener(mxEvent.CHANGE, (sender, evt) => {
      this.syncGraphData();
    });

    this.graph.addListener(mxEvent.CELLS_MOVED, (sender, evt) => {
      this.syncGraphData();
    });

    this.graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender) => {
      const cells = this.graph.getSelectionCells();
      this.selectedCells = cells;
    });

    this.graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
      const cells = evt.getProperty('cells');
      const dx = evt.getProperty('dx');
      const dy = evt.getProperty('dy');

      this.onCellsMoved(cells, dx, dy);
    });
  }

  syncGraphData() {
    const cells = this.graph.getModel().cells;
    const graphData: Graph = {
      blocks: [],
      edges: [],
    };
    for (const key in cells) {
      const cell = cells[key];
      if (cell.vertex) {
        graphData.blocks.push({
          id: cell.id,
          label: cell.value,
          x: cell.geometry.x,
          y: cell.geometry.y,
          width: cell.geometry.width,
          height: cell.geometry.height,
        });
      }
      if (cell.edge) {
        if (cell.geometry.points != null) {
          graphData.edges.push({
            id: cell.id,
            label: cell.value,
            source: cell.source.id,
            target: cell.target.id,
            x: cell.geometry.points[0].x,
            y: cell.geometry.points[0].y,
          });
        }
      }
    }
    this.graphData = graphData;
  }

  setBlockBackground() {
    const startBlock = this.graph.getModel().getCell('start');
    this.graph.setCellStyle('shape=ellipse;fillColor=#86efac', [startBlock]);
    const endBlock = this.graph.getModel().getCell('end');
    this.graph.setCellStyle('shape=ellipse;fillColor=#fca5a5', [endBlock]);
  }

  setEdgeLableFontColor(graph: mxGraph, color: string) {
    const style = graph.getStylesheet().getDefaultEdgeStyle();
    style['fontColor'] = color;
    graph.getStylesheet().putDefaultEdgeStyle(style);
  }

  addBlock(label = 'New block', x = 0, y = 0, width = 80, height = 30) {
    this.graph.getModel().beginUpdate();
    try {
      const vertex = this.graph.insertVertex(
        this.parent,
        uuidv4(),
        label,
        x,
        y,
        width,
        height
      );
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  onGraphDataChange(newGraphData: Graph) {
    this.graphData = newGraphData;
  }

  updateGraphData(): void {
    this.http.put('http://localhost:3000/graphData', this.graphData).subscribe(
      () => {
        this.notification.success(
          'Success',
          'Graph data updated successfully',
          {
            nzPlacement: 'top',
          }
        );
      },
      (error) => {
        console.error('Error updating graph data: ', error);
      }
    );
  }

  removeCells() {
    const cells = this.graph.getSelectionCells();
    this.graph.removeCells(cells);
    this.graphData.blocks = this.graphData.blocks.filter(
      (block) => !cells.find((cell) => cell.id === block.id)
    );
    this.graphData.edges = this.graphData.edges.filter(
      (edge) => !cells.find((cell) => cell.id === edge.id)
    );
  }
}
