import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,} from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { EquipmentBrowserService } from './equipmentbrowser.service';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { Equipment, EquipmentCodeClassification } from '../models/equipment-model';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';

@Component({
    selector: 'app-tlm-utils-equipmentbrowser',
    templateUrl: './equipmentbrowser.component.html',
    styleUrls: ['./equipmentbrowser.component.scss'],
})
export class EquipmentBrowserComponent extends BaseComponent implements OnInit, OnDestroy {
    equipmentList: Equipment[] = [];
    noAccessMsg: string = "";
    intervalID: any;
    loadingLabel: string = '';
    equipmentID: string = '';//SBF62411A0608
    enteredSerialNumber:string  = '';
    materialNumber: string = '';//100196736
    equipmentCode: string = 'MCMU-BA';//'MCMU-FA';//'SBF-624';// MCMU-FA MRCM-BA

    // grid props
    gridModel: GridConfigModel;
    pageSizes = [20, 50, 100, 1000, 10000, 20000];
    btnCount = 3;
    height = 300;
    gridData: any = [];
    public selectedKeys: any[] = [];

    // for modal
    public dialogOpened = false;
    public windowOpened = false;
    selectedDigMaintEquipment = null;
    relevantWorkOrders: any[] = [];

    // THE Output of this component is the browsed-for equipmentList
    @Output() equipmentArrayEmission = new EventEmitter<Equipment[]>();
    // Also output is the selections made from the browser
    @Output() selectedEquipmentEmission = new EventEmitter<Equipment[]>();
    @ViewChild(GridComponent, { static: false }) equipmentgrid: GridComponent;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public EquipmentBrowserService: EquipmentBrowserService,
        private excelService: XLSXExportService)
    {
        super('EquipmentBrowserComponent', loggerService);
    }
    lauchDigitalMaintenanceModal(selectedEquipment: Equipment) {
        this.selectedDigMaintEquipment = selectedEquipment;
        this.relevantWorkOrders = selectedEquipment.workorders;
        this.WriteInfoLog('launching digital maintenance modal for equipmnentid: ' + selectedEquipment.serialNumber);
        this.windowOpened = true;
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.equipmentList, 'equipment-data');
    }
    public close() {
        this.selectedDigMaintEquipment = null;
        this.relevantWorkOrders = null;
        this.windowOpened = false;
    }

    public open() {
        this.windowOpened = true;
    }

    public action(status) {
        console.log(`Dialog result: ${status}`);
        this.dialogOpened = false;
    }
    ngOnInit() {
        this.initGridModel();
        clearInterval(this.intervalID);
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
        this.getEquipmentDataAsObject(searchCriteria, '', '');
    }
    ngAfterViewInit() {
        this.WriteDebugLog('EquipmentBrowserComponent => ngAfterViewInit');
        if (this.equipmentgrid && this.equipmentgrid.columnList) {
            // get the master column list for Grid
            this.gridModel.columns = this.equipmentgrid.columns.toArray() as ColumnComponent[];
            this.gridModel.DataGridInstance = this.equipmentgrid;
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    clearData() {
        this.equipmentList = [];
        this.selectedDigMaintEquipment = null;
        this.relevantWorkOrders = null;
    }
    onEnter(mnvalue:string, snvalue: string, ecvalue) {
        this.clearData();
        this.materialNumber = mnvalue;
        this.equipmentID = snvalue;
        this.equipmentCode = ecvalue;
 
        let searchCriteria: EquipmentCodeClassification = {
            groupCode : '',
            productLineCode :'',
            subProductLineCode :'',
            productFamilyCode :  '',
            emsProductLineCode :  '',
            brandCode :  '',
            equipmentCode: ecvalue,
            name :  ''
        };

 
        this.getEquipmentDataAsObject(searchCriteria, mnvalue, snvalue);
    }
    /**
    * This method is used to set the grid height dynamically
     */
    onResize() {
        this.WriteDebugLog('EquipmentBrowserComponent => onResize');
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
            this.selectedEquipmentEmission.emit(selectedEquipment);

        }

    }
    getEquipmentDataAsObject(equipmentClassification: EquipmentCodeClassification,
        materialNumber: string,
        serialNumber: string) {

        this.loadingLabel = '... loading equipment data ...';
        let eventStartTime = new Date();
        
        this.EquipmentBrowserService.getEquipmentObject(
            1, // page
            500, // size
            equipmentClassification,
            materialNumber, // can be empty
            serialNumber, // can be empty
            null, // sort
            'workorders', // includes// i.e. 'pairedEquipment,workorders'
        ).subscribe(
            incomingEquipList => {
    
                let duration = new Date().valueOf() - eventStartTime.valueOf();
                this.loadingLabel = '';
                this.equipmentList = incomingEquipList.collection;
                
                if (this.equipmentList && this.equipmentList.length > 0) {
                    this.WriteInfoLog(this.equipmentList.length + ' equipment for inputs found');
                    this.ToasterServiceInstace.ShowInformation('found ' + this.equipmentList.length +' equipment for inputs in '+duration/1000 + ' sec');

                    // output to anyone who cares (parent components ;)
                    this.equipmentArrayEmission.emit(this.equipmentList);

                    // trigger processing for presentation elements(grid state)
                    this.dataStateChange(this.gridModel.GridState);
                }
                else {
                    this.loadingLabel = '';
                    this.ToasterServiceInstace.ShowInformation('equipment not found');
                }
                
            },
            error => {
                this.WriteErrorLog('error in getEquipmentObject subscribe', error);
                this.loadingLabel = '';
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
            this.gridData = process(this.equipmentList, this.gridModel.GridState);
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
        this.equipmentList = [];
    }
}
