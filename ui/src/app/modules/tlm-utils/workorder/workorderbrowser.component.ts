import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    Input,} from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { WorkOrderService } from './workorder.service';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { Equipment, EquipmentCodeClassification } from '../models/equipment-model';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';
import { EquipmentBrowserService } from '../equipmentbrowser/equipmentbrowser.service';

@Component({
    selector: 'app-tlm-utils-workorderBrowser',
    templateUrl: './workorderbrowser.component.html',
    styleUrls: ['./workorder.component.scss'],
})
export class WorkOrderBrowserComponent extends BaseComponent implements OnInit, OnDestroy {
    workorderList: any[] = [];
    headerLabel: string = 'No Work Orders';
    noAccessMsg: string = "";
    intervalID: any;
    loadingLabel: string = '';
    equipmentID: string = '';//SBF62411A0608


    // grid props
    gridModel: GridConfigModel;
    //pageSizes = [5, 20, 50];
    btnCount = 3;
    height = 10;
    gridData: any = [];
    public selectedKeys: any[] = [];

    @Input() incomingWorkorderList: any[] = [];
    @Input() incomingEquipment: Equipment = null;
    @ViewChild(GridComponent, { static: false }) workordergrid: GridComponent;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public workOrderBrowserService: WorkOrderService,
        public EquipmentBrowserService: EquipmentBrowserService,
        private excelService: XLSXExportService)
    {
        super('WorkOrderBrowserComponent', loggerService);
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.workorderList, 'episode-data');
    }
    ngOnInit() {
        this.initGridModel();
        if (this.incomingWorkorderList != null && this.incomingWorkorderList.length > 0) {
            this.workorderList = this.incomingWorkorderList;
            this.WriteDebugLog('WorkOrderBrowserComponent => using incoming work order list');
            this.dataStateChange(this.gridModel.GridState);
            this.headerLabel = 'Work Orders';
        }
        else {
            this.ToasterServiceInstace.ShowInformation('no workorders found.');
            //this.getWorkOrderData(null);
        }
    }
    ngAfterViewInit() {
        this.WriteDebugLog('WorkOrderBrowserComponent => ngAfterViewInit');
        if (this.workordergrid && this.workordergrid.columnList) {
            // get the master column list for Grid
            if (this.gridModel) {
                this.gridModel.columns = this.workordergrid.columns.toArray() as ColumnComponent[];
                this.gridModel.DataGridInstance = this.workordergrid;
            }
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    clearData() {
        this.workorderList = [];
        this.headerLabel = 'No Work Orders';
    }
    refreshData() {
        this.getWorkOrdersByEquipmentWKE(this.incomingEquipment.wellKnownEntityId);
    }

    /**
    * This method is used to set the grid height dynamically
     */
    onResize() {
        this.WriteDebugLog('WorkOrderBrowserComponent => onResize');
        const tableH = window.innerHeight; 
        // this.gridModel.gridHeight = tableH - 65; // 90;
        // this is the entire window but we are in a small panel half the size
        this.gridModel.gridHeight = (tableH / 2) - 160; // the 100 is the amount taken up by grid top and bottom controls
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

        if (event.selectedRows && event.selectedRows.length > 0) {

            let selectedEquipment: Equipment[] = [];
            for (let i = 0; i < event.selectedRows.length; i++) {
                selectedEquipment[i] = event.selectedRows[i].dataItem;
            }
           

        }

    }
    getWorkOrderData(
        equipmentID: string): void {

        this.workOrderBrowserService.getWorkOrders(
            equipmentID).subscribe(
                incomingWorkOrderData => {

                    if (incomingWorkOrderData.meta && incomingWorkOrderData.meta.totalCount > 0) {
                        this.workorderList = incomingWorkOrderData.collection;

                        this.WriteInfoLog('retrieved workorder data');
                        this.ToasterServiceInstace.ShowInformation('retrieved ' + incomingWorkOrderData.meta.totalCount + ' workorders');

                        // trigger processing for presentation elements(grid state)
                        this.dataStateChange(this.gridModel.GridState);
                        this.workorderList = this.incomingWorkorderList;
                        this.headerLabel = 'Work Orders';
                    }
                    else {

                        this.ToasterServiceInstace.ShowInformation('no data found.');
                    }
                },
                error => {
                    this.WriteErrorLog('error in getWorkOrderData subscribe', error);
                    this.ToasterServiceInstace.ShowError('Something Went wrong.');
                },
            );
    }
    getWorkOrdersByEquipmentWKE(wke: string) {

        this.loadingLabel = '... refreshing work order data ...';
        let eventStartTime = new Date();
        this.workOrderBrowserService.getWorkOrdersByEquipmentWKE(
            wke).subscribe(
            incomingEquipList => {
    
                let duration = new Date().valueOf() - eventStartTime.valueOf();
                this.loadingLabel = '';
                this.workorderList = incomingEquipList.collection[0].workorders;

                if (this.workorderList && this.workorderList.length > 0) {
                    this.ToasterServiceInstace.ShowInformation('found ' + this.workorderList.length + ' work orders for inputs in ' + duration / 1000 + ' sec');

                    // trigger processing for presentation elements(grid state)
                    this.dataStateChange(this.gridModel.GridState);
                    this.headerLabel = 'Work Orders';
                }
                else {
                    this.loadingLabel = '';
                    this.ToasterServiceInstace.ShowInformation('no work orders found');
                }

            },
            error => {
                this.WriteErrorLog('error in getWorkOrdersByEquipmentWKE subscribe', error);
                this.loadingLabel = '';
                this.ToasterServiceInstace.ShowError('Something Went wrong retrieving work orders.');
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
            this.gridData = process(this.workorderList, this.gridModel.GridState);
            this.changeDetector.markForCheck();
            this.changeDetector.reattach();
        }
        this.onResize();
    }
    public initGridModel() {
        this.gridModel = new GridConfigModel();
        this.gridModel.skip = 0;
        this.gridModel.take = 10;
        this.gridModel.GridDateFields = ['lastUpdatedDateTime', 'createdDate'];
        this.gridModel.defaultPageSize = 10;
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
        this.gridModel.pager.pageSizeOptions = [10, 20, 50];
        this.dataStateChange({
            take: this.gridModel.take,
            skip: this.gridModel.skip,
        });
    }

    /**
     * We are clearing everything here
     */
    ngOnDestroy() {
        this.workorderList = [];
    }
}
