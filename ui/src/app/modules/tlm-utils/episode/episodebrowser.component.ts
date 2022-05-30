import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    Input,} from '@angular/core';
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

@Component({
    selector: 'app-tlm-utils-episodeBrowser',
    templateUrl: './episodebrowser.component.html',
    styleUrls: ['./episodebrowser.component.scss'],
})
export class EpisodeBrowserComponent extends BaseComponent implements OnInit, OnDestroy {
    equipmentList: Equipment[] = [];
    episodeList: any[] = [];
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

    // THE Output of this component is the browsed-for equipmentList
    @Output() equipmentArrayEmission = new EventEmitter<Equipment[]>();
    // Also output is the selections made from the browser
    @Output() selectedEpisodeEmission = new EventEmitter<any>();
    @ViewChild(GridComponent, { static: false }) episodegrid: GridComponent;
    @Input() incomingEquipment: Equipment = null;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public episodeBrowserService: EpisodeBrowserService,
        private excelService: XLSXExportService)
    {
        super('EpisodeBrowserComponent', loggerService);
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.episodeList, 'episode-data');
    }
    ngOnInit() {
        this.initGridModel();

        if (this.incomingEquipment != null) {
            this.getEpisodeData(this.incomingEquipment.wellKnownEntityId, null, null, null);
        }
        else {
            this.getEpisodeData(null, null, null, null);
        }
    }
    ngAfterViewInit() {
        this.WriteDebugLog('EpisodeBrowserComponent => ngAfterViewInit');
        if (this.episodegrid && this.episodegrid.columnList) {
            // get the master column list for Grid
            if (this.gridModel) {
                this.gridModel.columns = this.episodegrid.columns.toArray() as ColumnComponent[];
                this.gridModel.DataGridInstance = this.episodegrid;
            }
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    clearData() {
        this.episodeList = [];
        this.loadingLabel = '';
    }
    refreshData() {
        this.ngOnInit();
    }
    // The tags are nasty so need way to extract out the one we need, value only
    extractCorrelationId(dataItem: any) : string {
  
        let tags: any[] = dataItem.tags;

        let corrId = "not found";
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].indexOf("slb-correlation-id:") > -1) {

                corrId = tags[i].substring(String("slb-correlation-id:").length);
            }
        }
        return corrId;
    }
    runAvatarSimulation(dataItem: any) {

        this.ToasterServiceInstace.ShowInformation('running Avatar Simulation for id: ' + dataItem.id + ' and eqID: ' + dataItem.equipmentWkeIdList[0]);
        this.WriteInfoLog('running Avatar Simulation for id: ' + dataItem.id + ' and eqID: ' + dataItem.equipmentWkeIdList[0]);
        let corrId = this.extractCorrelationId(dataItem);
        this.episodeBrowserService.processEmotEpisode(dataItem.id, dataItem.equipmentWkeIdList[0], corrId).subscribe(
            incomingEpisodeResponseMsg => {

                this.WriteInfoLog(incomingEpisodeResponseMsg.toString());
                if (incomingEpisodeResponseMsg == "Success")// suspect
                {
                    this.ToasterServiceInstace.ShowSuccess('processed Emot successfully');
                    this.refreshData();
                }
                else {

                    this.ToasterServiceInstace.ShowInformation('no data found.');
                }
            },
            error => {
                this.WriteErrorLog('error in getEpisodeData subscribe', error);
                this.ToasterServiceInstace.ShowError('Something went wrong retrieving episode data.');
            },
        );

    }
    viewEpisodic(dataItem: any)
    {
        this.selectedEpisodeEmission.emit(dataItem.id);
    }
    /**
    * This method is used to set the grid height dynamically
     */
    onResize() {
        this.WriteDebugLog('EpisodeBrowserComponent => onResize');
        const tableH = window.innerHeight;
        // this.gridModel.gridHeight = tableH - 65; // 90;
        //this.gridModel.gridHeight = tableH - 105; // 90;
        // below is hack for demo to make this expand when not in panel
        if (this.incomingEquipment != null) {
            this.gridModel.gridHeight = (tableH / 2) - 70; // the 50 is the amount taken up by grid top and bottom controls
        }
        else {
            this.gridModel.gridHeight = tableH - 95; // 90;
        }
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


    public handleSelection(event): void {
 
       // if (event.selectedRows && event.selectedRows.length > 0) {
       //     this.selectedEpisodeEmission.emit(event.selectedRows[0].dataItem.id);
      //  }

    }
    getEpisodeData(
        equipmentID: string,
        materialNumber: string,
        channelCode: string,
        channelType: string): void {

        this.episodeBrowserService.getEpisodeData(
            equipmentID,
            materialNumber,
            channelCode,
            channelType).subscribe(
                incomingEpisodeData => {

                    if (incomingEpisodeData.meta && incomingEpisodeData.meta.totalCount > 0) {
                        this.episodeList = incomingEpisodeData.collection;

                        this.WriteInfoLog('retrieved episode data');
                        this.loadingLabel = 'Episode Data';
                        this.ToasterServiceInstace.ShowInformation('retrieved ' + incomingEpisodeData.meta.totalCount + ' episodes');
                        
                        // trigger processing for presentation elements(grid state)
                        this.dataStateChange(this.gridModel.GridState);
                    }
                    else {

                        this.loadingLabel = '';
                        this.ToasterServiceInstace.ShowInformation('no data found.');
                    }
                },
                error => {
                    this.loadingLabel = '';
                    this.WriteErrorLog('error in getEpisodeData subscribe', error);
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
            this.gridData = process(this.episodeList, this.gridModel.GridState);
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
        this.episodeList = [];
    }
}
