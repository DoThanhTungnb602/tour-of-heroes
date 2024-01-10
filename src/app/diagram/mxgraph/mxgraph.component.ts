import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { v4 as uuidv4 } from 'uuid';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import * as mxgraph from 'mxgraph';
import _ from 'lodash';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

export type Block = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isStart?: boolean;
  isEnd?: boolean;
};

export type Edge = {
  id: string;
  label: string;
  source: string;
  target: string;
  x?: number;
  y?: number;
};

export type Graph = {
  blocks: Block[];
  edges: Edge[];
};

@Component({
  selector: 'app-mxgraph',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonComponent,
    NzIconModule,
    NzModalModule,
    FormsModule,
    NzInputModule,
  ],
  templateUrl: './mxgraph.component.html',
  styleUrl: './mxgraph.component.css',
})
export default class MxgraphComponent implements OnInit, AfterViewInit {
  onChange() {
    console.log('onChange', this.currentEdgeLabel);
  }
  private http = inject(HttpClient);

  @ViewChild('graphContainer') containerElementRef!: ElementRef;

  private graph!: mxGraph;
  private graphData!: Graph;
  private parent!: any;
  public selectedCells: mxCell[] = [];
  public isVisible = false;
  public currentEdgeLabel: string = '';

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.updateEdgeLabel(this.selectedCells[0]);
    this.isVisible = false;
  }

  updateEdgeLabel(edge: mxCell) {
    const newEdge = _.cloneDeep(edge);
    newEdge.value = this.currentEdgeLabel;
    console.log('Label: ', this.currentEdgeLabel);
    console.log('newEdge', newEdge);
    this.graph.getModel().beginUpdate();
    try {
      this.graph.getModel().setValue(edge, newEdge);
    } finally {
      this.graph.getModel().endUpdate();
    }
    this.syncGraphData();
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  constructor(private notification: NzNotificationService) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/graphData').subscribe((data) => {
      this.graphData = data as Graph;
      if (this.graphData.blocks.length > 0) {
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
            const style = this.graph.getStylesheet().getDefaultVertexStyle();
            style['shadow'] = true;
            style['shadowColor'] = '#C0C0C0';
            this.graph.getStylesheet().putCellStyle('shadowStyle', style);
            this.graph.setCellStyle('shadowStyle', [vertex]);
            return acc;
          }, {} as Record<string, mxCell>);
          this.graphData.edges.forEach((edge) => {
            const { id, label, source, target, x, y } = edge;
            const newEdge = this.graph.insertEdge(
              this.parent,
              id,
              label,
              blocksMap[source],
              blocksMap[target]
            );
            if (x && y) {
              const geometry = new mxGeometry();
              geometry.points = [new mxPoint(x, y)];
              this.graph.getModel().setGeometry(newEdge, geometry);
            }
          });
          this.setBlockBackground();
        } finally {
          this.graph.getModel().endUpdate();
        }
      } else {
        const startBlock = this.addBlock('start', 'Start', 0, 0, 80, 30);
        const endBlock = this.addBlock('end', 'End', 0, 50, 80, 30);
        const style = this.graph.getStylesheet().getDefaultVertexStyle();
        style['shadow'] = true;
        style['shadowColor'] = '#C0C0C0';
        this.graph.getStylesheet().putCellStyle('shadowStyle', style);
        this.graph.setCellStyle('shadowStyle', [startBlock, endBlock]);
        this.setBlockBackground();
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
    if (cell.edge) {
      this.currentEdgeLabel = cell.value;
      this.showModal();
    }
  }

  onNewEdgeConnected(edge: mxCell) {
    const id = uuidv4();
    edge.setId(id);
    this.syncGraphData();
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
    style['verticalAlign'] = 'top';
    style['labelBackgroundColor'] = '#67e8f9';
    style['labelPosition'] = 'center';
    style['verticalLabelPosition'] = 'bottom';
    style['labelPadding'] = 10;
    style['labelRadius'] = 10;
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
        } else {
          graphData.edges.push({
            id: cell.id,
            label: cell.value,
            source: cell.source.id,
            target: cell.target.id,
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

  addBlock(
    id = uuidv4(),
    label = 'New block',
    x = 0,
    y = 0,
    width = 80,
    height = 30
  ): mxCell {
    this.graph.getModel().beginUpdate();
    let vertex: mxCell;
    try {
      vertex = this.graph.insertVertex(
        this.parent,
        id,
        label,
        x,
        y,
        width,
        height
      );
    } finally {
      this.graph.getModel().endUpdate();
    }
    return vertex;
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
  }

  zoomIn() {
    this.graph.zoomIn();
  }

  zoomOut() {
    this.graph.zoomOut();
  }
}
