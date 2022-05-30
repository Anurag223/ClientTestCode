import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    Input,
    OnChanges,
    SimpleChanges,
    SimpleChange,} from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { EpisodeBrowserService } from './episodebrowser.service';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { Equipment, EquipmentCodeClassification } from '../models/equipment-model';

import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';
import { EpisodicMeta, Channel, eMOTPoint } from './models/episodic-model';

@Component({
    selector: 'app-tlm-utils-episodePoints',
    templateUrl: './episodepoints.component.html',
    styleUrls: ['./episodebrowser.component.scss'],
})
export class EpisodePointsComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
    equipmentList: Equipment[] = [];
    headerLabel = 'no episodic points available';
    episodicPointsList: any[] = [];
    episodeMeta: EpisodicMeta = null;
    columnName: string = 'n/a';
    noAccessMsg: string = "";
    intervalID: any;
    loadingLabel: string = '';
    equipmentID: string = '';//SBF62411A0608
    enteredSerialNumber:string  = '';
    materialNumber: string = '';//100196736
    equipmentCode: string = '';

    // grid props
    gridModel: GridConfigModel;
    pageSizes = [20, 50, 100, 1000, 10000, 20000];
    btnCount = 3;
    height = 300;
    gridData: any = [];
    public selectedKeys: any[] = [];

    // THE Output of this component is episodic points for the equipment
    @Output() episodicPointsEmission = new EventEmitter<any>();
    // Also output is the selections made from the browser
  
    @ViewChild(GridComponent, { static: false }) episodepointgrid: GridComponent;
    @Input() incomingEquipment: Equipment = null;
    @Input() incomingEpisodeID: string = null;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public episodeBrowserService: EpisodeBrowserService,
        private excelService: XLSXExportService)
    {
        super('EpisodePointsComponent', loggerService);
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.episodicPointsList, 'episode-point-data');
    }
    ngOnInit() {
        this.initGridModel();

        let searchCriteria: EquipmentCodeClassification = {
            groupCode: '',
            productLineCode: '',
            subProductLineCode: '',
            productFamilyCode: '',
            emsProductLineCode: '',
            brandCode: '',
            equipmentCode: this.equipmentCode,
            name: ''
        };

        if (this.incomingEquipment != null) {
            this.getEpisodicData(this.incomingEquipment, null, 'eMOT'); //hardwiring for demo to eMOT
        }
        else {
            //this.getEpisodeData(null, null, null, null);
        }
    }
    ngAfterViewInit() {
        this.WriteDebugLog('EpisodePointsComponent => ngAfterViewInit');
        if (this.episodepointgrid && this.episodepointgrid.columnList) {
            // get the master column list for Grid
            if (this.gridModel) {
                this.gridModel.columns = this.episodepointgrid.columns.toArray() as ColumnComponent[];
                this.gridModel.DataGridInstance = this.episodepointgrid;
            }
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        const currentItem: SimpleChange = changes.incomingEpisodeID;
        this.WriteInfoLog('prev value: ', currentItem.previousValue);
        this.WriteInfoLog('got item: ', currentItem.currentValue);

        if (currentItem.currentValue) {
            this.incomingEpisodeID = changes.incomingEpisodeID.currentValue;
            if (this.incomingEpisodeID != null) {
                this.getEpisodicData(this.incomingEquipment, this.incomingEpisodeID, 'eMOT');
            }
        }
 
    }
    refreshData() {
        this.ngOnInit();
    }
    clearData() {
        this.episodicPointsList = [];
        this.episodeMeta = null;
        this.columnName = 'n/a';
    }

    /**
    * This method is used to set the grid height dynamically
     */
    onResize() {
        this.WriteDebugLog('EpisodePointsComponent => onResize');
        const tableH = window.innerHeight;
        // this.gridModel.gridHeight = tableH - 65; // 90;
        //this.gridModel.gridHeight = tableH - 105; // 90;
        this.gridModel.gridHeight = (tableH / 2) - 70; // the 50 is the amount taken up by grid top and bottom controls
    }
    onCDDetach() {
        this.changeDetector.detach();
    }
    onCDReAttach() {
        this.changeDetector.reattach();
        this.changeDetector.detectChanges();
    }
    public pageChange(pageChange: PageChangeEvent): void {
        this.onCDDetach();
        this.gridModel.skip = pageChange.skip;
        this.gridModel.take = pageChange.take;
        this.onResize();
        this.onCDReAttach();
    }
    public isItemSelected(_: any, index: string): boolean {
        if (this.selectedKeys && this.selectedKeys.indexOf(index) > -1) {
            return true;
        }
        return false;
    }

    getEpisodicData(equipment: Equipment, episodeID: string, channelCode: string) {

        this.episodeBrowserService.getEpisodicData(equipment, episodeID, channelCode).subscribe(
            incomingEpisodicData =>
            {
                if (incomingEpisodicData.meta) {


                    this.episodeMeta = {
                        equipmentWKEid: incomingEpisodicData.meta.equipmentWKEid,
                        periodStartTime: incomingEpisodicData.meta.period.start,
                        periodEndTime: incomingEpisodicData.meta.period.end,
                        serialNumber: incomingEpisodicData.meta.serialNumber,
                        equipmentCode: incomingEpisodicData.meta.equipmentCode,
                        channels: incomingEpisodicData.meta.channels,
                        rows: null
                    }
                }
                if (incomingEpisodicData.rows.length > 0) {
                    // get the point data
                    let tempPointList = new Array<eMOTPoint>(incomingEpisodicData.rows.length);
                    for (let i = 0; i < tempPointList.length; i++) {
                        let rowData: any = [];
                        tempPointList[i] = {
                            timestamp: incomingEpisodicData.rows[i][0],
                            episodeId: incomingEpisodicData.rows[i][1],
                            eMotValue: incomingEpisodicData.rows[i][2]
                        }

                    }

                    this.episodicPointsList = tempPointList;
                    this.episodeMeta = {
                        equipmentWKEid: equipment.wellKnownEntityId,
                        periodStartTime: null,
                        periodEndTime: null,
                        serialNumber: equipment.serialNumber,
                        equipmentCode: equipment.equipmentCode,
                        channels: null,
                        rows: tempPointList
                    }
                    this.episodeMeta.rows = tempPointList;
                }
                this.WriteInfoLog('retrieved episodicdata');
                this.ToasterServiceInstace.ShowInformation('retrieved episodic points');
                this.headerLabel = 'Episodic Data for ' + this.incomingEquipment.wellKnownEntityId;



                // we may need to parse out the values here... they are coming back as the name and a type i.e. Pressure, float

                // trigger processing for presentation elements(grid state)
                this.dataStateChange(this.gridModel.GridState);
                this.episodicPointsEmission.emit(this.episodeMeta);
            },
            error => {
                this.WriteInfoLog('error in getEpisodeData subscribe', error);
                //this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving episode data.');
            },
        );
    }

   
    public dataStateChange(state: DataStateChangeEvent): void {
        if (state) {
            this.changeDetector.detach();
            this.gridModel.take = state.take;
            this.gridModel.skip = state.skip;
            if (state && state.group) {
                // If the Grouping is applied on more than 10 Groups then display a toaster message
                if (state.group.length > 10) {
                    this.ToasterServiceInstace.ShowError(
                        'You can not group more than 10 columns',
                    );
                    state.group.splice(state.group.length - 1, 1);
                }
            }
            this.gridModel.GroupSettings = state.group ? state.group.slice() : null;
            this.gridModel.SortSettings = state.sort ? state.sort.slice() : null;
            this.gridModel.FilterSettings = state.filter;
            this.gridData = process(this.episodicPointsList, this.gridModel.GridState);
            this.changeDetector.markForCheck();
            this.changeDetector.reattach();
        }
        this.onResize();
    }
    public initGridModel() {
        this.gridModel = new GridConfigModel();
        this.gridModel.skip = 0;
        this.gridModel.take = 20;
        this.gridModel.GridDateFields = ['lastUpdatedDateTime', 'createdDate'];
        this.gridModel.defaultPageSize = 20;
        this.gridModel.isPagingEnabled = true;
        this.gridModel.isColumnResizingEnabled = true;
        this.gridModel.isFilteringEnabled = true;
        this.gridModel.isGroupingEnabled = true;
        this.gridModel.isColumnReOrderEnabled = true;
        this.gridModel.sorting = { mode: 'multiple' };
        this.gridModel.isSortingEnabled = true;
        this.gridModel.GroupSettings = [];

        this.gridModel.pager = new GridPagerConfigModel();
        this.gridModel.pager.buttonCount = 5;
        this.gridModel.pager.pageSizeOptions = [20, 50, 100];
        this.dataStateChange({
            take: this.gridModel.take,
            skip: this.gridModel.skip,
        });
    }

    /**
     * We are clearing everything here
     */
    ngOnDestroy() {
        this.episodicPointsList = [];
        this.episodeMeta = null;
    }
}
