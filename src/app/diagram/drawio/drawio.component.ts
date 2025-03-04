import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GraphEditor,
  GraphEditorIn,
  GraphEditorOut,
  GraphInitConfig,
  GraphXmlData,
  ActionType,
  GraphEditorSVG,
  ButtonActionType,
} from '@zklogic/draw.io';

@Component({
  selector: 'app-drawio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawio.component.html',
  styleUrl: './drawio.component.css',
})
export default class DrawioComponent {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;
  @ViewChild('mxgraphScriptsContainer', { static: true })
  mxgraphScriptsContainer!: ElementRef<HTMLElement>;
  graphEditor: GraphEditor = new GraphEditor();
  drawioImport: any;

  ngOnInit(): void {
    let xml =
      '<mxGraphModel dx="1038" dy="381" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100"><root></root></mxGraphModel>';

    //Div container to load Graph Editor
    this.graphEditor
      .initialized(
        this.container.nativeElement,
        this.mxgraphScriptsContainer.nativeElement,
        {
          actions: {
            subMenu: {
              save: (
                xml: GraphXmlData | GraphEditorSVG
              ): Promise<GraphEditorOut> => {
                return new Promise((resolve, reject) => {
                  //save data here
                  resolve({
                    status: 'Data Saved',
                    graphData: xml,
                  } as GraphEditorOut);
                });
              },
            },
          },
          actionsButtons: {
            'Export Library': {
              title: 'Export To App Library',
              actionType: ActionType.EXPORTSVG,
              callback: this.graphEditorLibraryExportEvent,
              callbackOnError: this.graphEditorActionsErrorEvent,
              style: {
                backgroundColor: '#4d90fe',
                border: '1px solid #3079ed',
                backgroundImage: 'linear-gradient(#4d90fe 0,#4787ed 100%)',
                height: '29px',
                lineHeight: '25px',
              },
            } as ButtonActionType,
            'Import Library': {
              title: 'Import From App Library',
              actionType: ActionType.OPEN,
              callback: this.graphEditorLibraryImportEvent,
              callbackOnFinish: this.graphEditorLibraryImportFinishEvent,
              style: {
                backgroundColor: '#4d90fe',
                border: '1px solid #3079ed',
                backgroundImage: 'linear-gradient(#4d90fe 0,#4787ed 100%)',
                height: '29px',
                lineHeight: '25px',
              },
            } as ButtonActionType,
          },
          extraActions: {
            file: {
              exportAs: {
                'App Library': {
                  actionType: ActionType.EXPORTSVG,
                  callback: this.graphEditorLibraryExportEvent,
                  callbackOnError: this.graphEditorActionsErrorEvent,
                },
              },
              importFrom: {
                'App Library': {
                  actionType: ActionType.OPEN,
                  callback: this.graphEditorLibraryImportEvent,
                  callbackOnFinish: this.graphEditorLibraryImportFinishEvent,
                },
              },
            },
          },
        } as GraphInitConfig
      )
      .then(
        (resolve) => {
          console.log(resolve);
          //Fetch last saved graph data and set after initialization
          this.graphEditor
            .setGrapheditorData({ xml: xml } as GraphXmlData)
            .then(
              (resolve) => {
                console.log('setGraphEditor', resolve);
              },
              (reject) => {
                console.log('setGraphEditor', reject);
              }
            )
            .catch((e) => {
              console.log('setGraphEditor', e);
            });
        },
        (reject) => {
          console.log(reject);
        }
      );
  }

  graphEditorLibraryImportFinishEvent = (
    graphData: any
  ): Promise<GraphEditorOut> => {
    return new Promise((resolve, reject) => {
      console.log('graphEditorLibraryImportFinishEvent', graphData);
      resolve({
        status: 'Import App Library Implementation required',
        graphData: graphData,
      });
    });
  };

  graphEditorLibraryImportEvent = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.drawioImport.showDialog((data: any) => {
        console.log('callback:data', data);
        resolve({
          status: data && data.drawio_data ? 'Okay' : 'cancel',
          graphData:
            data && data.drawio_data
              ? {
                  xml: data.drawio_data.graphXmlData.xml,
                  name: data.legal_name,
                }
              : null,
        });
      });
    });
  };

  graphEditorActionsErrorEvent = (graphData: any): Promise<GraphEditorOut> => {
    return new Promise((resolve, reject) => {
      console.log('graphEditorActionsErrorEvent', graphData);
      resolve({
        status: 'Export App Library Implementation required',
        graphData: graphData,
      });
    });
  };

  graphEditorLibraryExportEvent = (graphData: GraphEditorSVG): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log('graphData', graphData);
      resolve({
        status: 'TS Export App Library Implementation required',
        graphData:
          graphData && graphData.xml
            ? { xml: graphData.xml, name: graphData.name }
            : null,
      });
    });
  };
}
