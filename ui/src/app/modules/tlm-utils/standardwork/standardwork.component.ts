import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,} from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { IStandardWorkAPIResponse, StandardWork, StandardWorkContainer, StandardWorkType } from './standardwork-model';
import { StandardWorkService } from './standardwork.service';
import { FMPHelper } from '../../../../Constants/helpers';
import { saveAs } from 'file-saver';
@Component({
    selector: 'app-fmp-standardwork',
    templateUrl: './standardwork.component.html',
    styleUrls: ['./standardwork.component.scss']
})
export class StandardWorkComponent extends BaseComponent implements OnInit, OnDestroy {

    standardworkList: StandardWorkContainer[] = [];
    uploadMsg: string ="";

    // grid props
    gridModel: GridConfigModel;
    pageSizes = [20, 50, 100];
    btnCount = 3;
    height = 300;
    gridData: any = [];
    public selectedKeys: any[] = [];

    // test data
    equipmentCode: string = "";
    serviceType: string = "";
    geography: string = "";

    // The output of this component is the browsed-for epic standardwork
    @Output() standardworkArrayEmission = new EventEmitter<StandardWorkContainer[]>();
    // Also output is the selections made from the browser
    @Output() selectedStandardWorkEmission = new EventEmitter<StandardWorkContainer[]>();
    @ViewChild(GridComponent, { static: false }) standardworkgrid: GridComponent;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public standardworkService: StandardWorkService,
    )
    {
        super('StandardWorkBrowserComponent', loggerService);
    }

    ngOnInit() {
        this.initGridModel();

    }
    ngAfterViewInit() {
        this.WriteDebugLog('StandardWorkComponent => ngAfterViewInit');
        if (this.standardworkgrid.columnList) {
            // get the master column list for Grid
            this.gridModel.columns = this.standardworkgrid.columns.toArray() as ColumnComponent[];
            this.gridModel.DataGridInstance = this.standardworkgrid;
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    clearData() {
        this.standardworkList = [];
        this.uploadMsg = "";
    }
    public uploadFinished = (event) => {
        this.uploadMsg = event.message;
        this.ToasterServiceInstace.ShowInformation(this.uploadMsg);
        this.getStandardWorkDataAsObject("", "", "");
    }
    onSearchEnter(etvalue:string, stvalue:string, geovalue: string) {
        this.clearData();
        this.getStandardWorkDataAsObject(etvalue, stvalue, geovalue);
    }
    public isItemSelected(_: any, index: string): boolean {
        if (this.selectedKeys && this.selectedKeys.indexOf(index) > -1) {
            return true;
        }
        return false;
    }
    // this could be an expensive operation... need to verify howm any times called
    convertSWType(sw: StandardWorkContainer): any {
        return StandardWorkType[sw.attributes.swType];
    }
    clickFileEvent(sw: StandardWorkContainer): any {
        return StandardWorkType[sw.attributes.swType];
    }
    GetFileEvent(sw: StandardWorkContainer): any {
        //debugger;
        //let url: string = FMPHelper.ApplicationSettings.standardWorkBaseUrl + '/' + sw.attributes.imageFileNames;
        return this.getStandardWorkDataAsFile(sw.attributes.swId, sw.attributes.originalFileName);
        //return url;
    }
    /**
    * This method is used to set the grid height dynamically
    */
    onResize() {
        this.WriteDebugLog('StandardWorkComponent => onResize');
        const tableH = window.innerHeight;
        // this.gridModel.gridHeight = tableH - 65; // 90;
        this.gridModel.gridHeight = tableH - 105; // 90;
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
    // Determine if we can create a database on the current selection
    public handleSelection(event): void {


        if (event.selected) {

            let selectedStandardWork: StandardWorkContainer[] = [];
            for (let i = 0; i < event.selectedRows.length; i++) {
                selectedStandardWork[i] = event.selectedRows[i].dataItem;
            }
            this.selectedStandardWorkEmission.emit(selectedStandardWork);

        }

    }
    getStandardWorkDataAsObject(eqtype: string, servicetype: string, geography:string) {

        this.standardworkService.getStandardWorkObject(
            1, // page
            25, // size
            eqtype,
            servicetype,
            geography,
            null, // sort
            null // includes
        ).subscribe(
            incomingStandardWorkList => {
    
                this.standardworkList = incomingStandardWorkList.data;
                if (this.standardworkList && this.standardworkList.length > 0) {
                    this.WriteInfoLog(this.standardworkList.length + ' standardwork for inputs found');
                    //this.ToasterServiceInstace.ShowInformation('found ' + this.standardworkList.length +' standardwork for inputs.');
                    // output to anyone who cares (parent components ;) 
                    this.standardworkArrayEmission.emit(this.standardworkList);
                    // test
                   // if (this.standardworkList.length == 1) {
                   //     this.selectedStandardWorkEmission.emit(this.standardworkList[0]);
                   // }
                    this.dataStateChange(this.gridModel.GridState);
                }
                else {
                    this.ToasterServiceInstace.ShowError('standardwork not found');
                }
                
            },
            error => {
                this.WriteErrorLog('error in getStandardWorkDataAsObject subscribe', error);
                this.ToasterServiceInstace.ShowError('Something Went wrong.');
            },
        );
    }
    getStandardWorkDataAsFile(swId: string, orginalFileName: string) {

        this.standardworkService.getStandardWorkFile(
            swId,

        ).subscribe(
            incomingFile => {
                var blob = new Blob([incomingFile], { type: "text/xml" });

                saveAs(blob, orginalFileName);

            },
            error => {
                this.WriteErrorLog('error in getStandardWorkDataAsObject subscribe', error);
                this.ToasterServiceInstace.ShowError('Something Went wrong.');
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
            this.gridData = process(this.standardworkList, this.gridModel.GridState);
            this.changeDetector.markForCheck();
            this.changeDetector.reattach();
        }
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
        this.standardworkList = [];
    }
}

