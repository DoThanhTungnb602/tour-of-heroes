import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { Edge, Graph } from '../mxgraph.component';

import * as mxgraph from 'mxgraph';
import * as _ from 'lodash';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css',
})
export class GraphComponent {

  // @Input() graphData!: Graph;
  // @Output() onGraphDataChange: EventEmitter<Graph> = new EventEmitter();

  // @ViewChild('graphContainer') containerElementRef!: ElementRef;

  // private graph!: mxgraph.mxGraph;
  // private parent!: any;
  // private isPopulatingGraph = true;

  // get container() {
  //   return this.containerElementRef.nativeElement;
  // }

  // ngAfterViewInit(): void {
  //   this.setUpGraph();
  //   this.addEventListeners();
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (!changes['graphData'].firstChange) {
  //     this.graph.getModel().beginUpdate();
  //     try {
  //       const cells = this.graph.getChildCells(this.parent);
  //       this.graph.removeCells(cells);

  //       const blocksMap = this.graphData.blocks.reduce((acc, block) => {
  //         const { id, label, x, y, width, height } = block;
  //         const vertex = this.graph.insertVertex(
  //           this.parent,
  //           id,
  //           label,
  //           x,
  //           y,
  //           width,
  //           height
  //         );
  //         acc[id] = vertex;
  //         return acc;
  //       }, {} as Record<string, mxCell>);
  //       this.setBlockBackground();
  //       this.graphData.edges.forEach((edge) => {
  //         const { id, label, source, target } = edge;
  //         this.graph.insertEdge(
  //           this.parent,
  //           id,
  //           label,
  //           blocksMap[source],
  //           blocksMap[target]
  //         );
  //       });
  //     } finally {
  //       this.graph.getModel().endUpdate();
  //     }
  //   }
  // }

  // onCellDoubleClicked(cell: mxCell) {
  //   console.log('Cell double clicked: ', cell);
  // }

  // onCellsMoved(cells: mxCell[], dx: number, dy: number) {
  //   cells.forEach(function (cell) {
  //     const geometry = cell.getGeometry();
  //     console.log('Cell with id: ' + cell.id + ' has moved.');
  //     console.log('Change in x-coordinate: ' + dx);
  //     console.log('Change in y-coordinate: ' + dy);
  //     console.log('New x-coordinate: ' + geometry.x);
  //     console.log('New y-coordinate: ' + geometry.y);
  //   });

  //   // update the graph data
  //   const graphData = _.cloneDeep(this.graphData);
  //   cells.forEach((cell) => {
  //     const block = graphData.blocks.find((block) => block.id === cell.id);
  //     if (block) {
  //       block.x += dx;
  //       block.y += dy;
  //     }
  //   });
  //   this.onGraphDataChange.emit(graphData);
  // }

  // onNewEdgeConnected(edge: mxCell) {
  //   console.log('New edge: ', edge);
  //   // update the graph data
  //   const graphData = _.cloneDeep(this.graphData);
  //   const source = edge.source as mxCell;
  //   const target = edge.target as mxCell;
  //   const newEdge: Edge = {
  //     id: _.uniqueId('edge_'),
  //     label: edge.value,
  //     source: source.id,
  //     target: target.id,
  //   };
  //   graphData.edges.push(newEdge);
  //   this.onGraphDataChange.emit(graphData);
  //   console.log("Graph data after 'onNewEdgeConnected': ", graphData);
  // }

  // onEdgeChanged(edge: mxCell) {
  //   if (edge.source != null && edge.target != null) {
  //     console.log('Edge changed: ', edge);
  //     // update the graph data
  //     // const graphData = _.cloneDeep(this.graphData);
  //     // const changedEdge = graphData.edges.find(
  //     //   (edge) => edge.id === edge.id
  //     // ) as Edge;
  //     // changedEdge.label = edge.value;
  //     // this.onGraphDataChange.emit(graphData);
  //   }
  // }

  // setUpGraph() {
  //   mxEvent.disableContextMenu(this.container);

  //   this.graph = new mxGraph(this.container);

  //   this.graph.setCellsEditable(false);
  //   this.graph.isCellMovable = (cell) => !cell.isEdge();
  //   this.graph.isLabelMovable = () => false;
  //   this.graph.setConnectable(true);
  //   new mxRubberband(this.graph);
  //   this.parent = this.graph.getDefaultParent();
  //   this.setEdgeLableFontColor(this.graph, '#334155');
  // }

  // addEventListeners() {
  //   const connectionHandler = this.graph.connectionHandler;

  //   connectionHandler.addListener(mxEvent.END, (sender, evt) => {
  //     const edge = evt.getProperty('cell');
  //     if (edge) {
  //       if (edge.source === null || edge.target === null) {
  //         this.graph.removeCells([edge]);
  //       } else {
  //         this.onNewEdgeConnected(edge);
  //       }
  //     }
  //   });

  //   this.graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
  //     const cell = evt.getProperty('cell');
  //     if (cell) {
  //       this.onCellDoubleClicked(cell);
  //     }
  //   });

  //   this.graph.addListener(mxEvent.CELL_CONNECTED, (sender, evt) => {
  //     const edge = evt.getProperty('edge');
  //     const terminal = evt.getProperty('terminal');
  //     const source = evt.getProperty('source');
  //     const target = evt.getProperty('target');

  //     if (edge != null && !source && terminal == undefined) {
  //       this.graph.removeCells([edge]);
  //     } else if (edge != null && !target && terminal == undefined) {
  //       this.graph.removeCells([edge]);
  //     }
  //   });

  //   this.graph.getModel().addListener(mxEvent.CHANGE, (sender, evt) => {
  //     const changes = evt.getProperty('changes');
  //     console.log('Changes: ', changes);
  //     changes.forEach((change) => {
  //       if (change.cell) {
  //         if (change.cell.edge) {
  //           const edge = _.cloneDeep(change.cell);
  //           this.onEdgeChanged(edge);
  //         }
  //       }
  //     });
  //   });

  //   this.graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
  //     const cells = evt.getProperty('cells');
  //     const dx = evt.getProperty('dx');
  //     const dy = evt.getProperty('dy');

  //     this.onCellsMoved(cells, dx, dy);
  //   });
  // }

  // setBlockBackground() {
  //   const startBlock = this.graph.getModel().getCell('start');
  //   this.graph.setCellStyle('shape=ellipse;fillColor=#86efac', [startBlock]);
  //   const endBlock = this.graph.getModel().getCell('end');
  //   this.graph.setCellStyle('shape=ellipse;fillColor=#fca5a5', [endBlock]);
  // }

  // setEdgeLableFontColor(graph: mxGraph, color: string) {
  //   const style = graph.getStylesheet().getDefaultEdgeStyle();
  //   style['fontColor'] = color;
  //   graph.getStylesheet().putDefaultEdgeStyle(style);
  // }
}
