import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    Input,} from '@angular/core';

    import {
        WindowService,
        WindowRef,
        WindowCloseResult,
      } from "@progress/kendo-angular-dialog";
      

import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { ScheduleradminService } from './scheduleradmin.service';
import { SchedulerJobContext, SchedulerModel } from '../models/schedulermodel';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent , GridDataResult, SelectionEvent } from '@progress/kendo-angular-grid';
import {DataResult} from '@progress/kendo-data-query';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { WindowModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PanelBarItemModel } from "@progress/kendo-angular-layout";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { Equipment, EquipmentCodeClassification } from '../models/equipment-model';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';
import { anyChanged } from '@progress/kendo-angular-common';

@Component({
    selector: 'app-tlm-utils-scheduleradmin',
    templateUrl: './scheduleradmin.component.html',
    styleUrls: ['./scheduleradmin.component.scss'],
})
export class ScheduleradminComponent extends BaseComponent implements OnInit, OnDestroy {
    scheduleradminData:SchedulerModel[]=[];
    schedulerlist: any[];
    jobList:any[];
    resultTrigger:any;
    loadingLabel: string = '';
    forsitesData:any;
    data:any;
    addButtonFlag:boolean;
    private gridDataResult: GridDataResult;
 
    // grid props

    gridModel: GridConfigModel;
    pageSizes = [20, 50, 100, 1000, 10000, 20000];
    btnCount = 3;
    height = 300;
    gridData: any = [];
    public selectedKeys: any[] = [];
    public opened = false;

    @Output() schedulerArrayEmission = new EventEmitter<SchedulerJobContext[]>();
    @Output() selectedschdulerjobs = new EventEmitter<any>();
    @ViewChild(GridComponent, { static: false }) scheduleradmingrid: GridComponent;

    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public schedulerAdminService: ScheduleradminService,
        private excelService: XLSXExportService)
    {
        super('ScheduleradminComponent', loggerService);
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.scheduleradminData, 'scheduler-data');
        
    }
    
    ngOnInit() {
        this.initGridModel();
        this.getSchedulerData();
    }


    private items: Array<PanelBarItemModel> = [
        <PanelBarItemModel>{
          title: "Sites",
          content: "First item content",
          expanded: true,
        }
      ];
    
    ngAfterViewInit() {
        this.WriteDebugLog('ScheduleradminComponent => ngAfterViewInit');
        if (this.scheduleradmingrid && this.scheduleradmingrid.columnList) {
            // get the master column list for Grid
            if (this.gridModel) {
                this.gridModel.columns = this.scheduleradmingrid.columns.toArray() as ColumnComponent[];
                this.gridModel.DataGridInstance = this.scheduleradmingrid;
            }
            this.changeDetector.detectChanges();
            this.onResize();
        }
    }
    clearData() {
        this.scheduleradminData = [];
        this.loadingLabel = '';
    }
    refreshData() {
        this.ngOnInit();
    }

    /**
    * This method is used to set the grid height dynamically
     */
    
    onResize() {
        this.WriteDebugLog('ScheduleradminComponent => onResize');
        const tableH = window.innerHeight;
        this.gridModel.gridHeight = tableH - 65; // 90;
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

    getSchedulerData():void{
        this.loadingLabel = '... loading data ...';
        this.schedulerAdminService.getSchedulerData().subscribe(
          data=>{
            
                console.log("data");
                this.scheduleradminData=data;
                this.jobList=data.jobContext;
                this.addButtonFlag=true;
                if (this.scheduleradminData.length > 0){
                    this.loadingLabel = '';
                    this.ToasterServiceInstace.ShowInformation('jobs display');
                    // this.schedulerArrayEmission.emit(this.jobList);
                    
                    this.dataStateChange(this.gridModel.GridState);
                }else {

                            this.loadingLabel = '';
                            this.ToasterServiceInstace.ShowInformation('no data found.');
                        }
                    },
                    error => {
                        this.loadingLabel = '';
                        this.WriteErrorLog('error in getSchedulerData subscribe', error);
                        this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving scheduler data.');
                    },
    
        );
    }
    
    triggerJob(dataItem:any):void{

        console.log("trigger");
        console.log(dataItem.jobContext.group);
                
                this.schedulerAdminService.triggerJob(dataItem).subscribe(
            response=>{
                console.log(response);
                this.resultTrigger=response;
                console.log(this.resultTrigger.result);
                // Success
                this.ToasterServiceInstace.ShowInformation('Trigger status-  ' + this.resultTrigger.result +' ');
                this.ToasterServiceInstace.ShowInformation('Trigger message-  ' + this.resultTrigger.message + ' ');
                
                setTimeout(()=>{ this.getSchedulerData() }, 5000);
                
              },
          );  
    }

    copyJob(dataItem:any):void{
        dataItem.action = "Copy";
        this.RouterInstance.navigateByUrl('/updateschedulerjob', {state: dataItem});            
    }

    updateJob(dataItem:any):void{
        dataItem.action = "Update";
        this.RouterInstance.navigateByUrl('/updateschedulerjob', {state: dataItem});
                 
    }
    addSchedulerJob():void{
        this.RouterInstance.navigateByUrl('/addschedulerjob');          
    }

    //for kendo window to display forsites
    public close() {
        this.opened = false;
      }
    
      public open(dataItem:any) {
        this.forsitesData=dataItem.jobContext.forSites;
        this.data=this.forsitesData.slice();
        this.opened = true;
      }

    public dataStateChange(state: DataStateChangeEvent): void {
        if (state) {
            this.changeDetector.detach();
            this.gridModel.take = state.take;
            this.gridModel.skip = state.skip;
            if (state && state.group) {
                // If the Grouping is applied on more than 10 Groups then display a toaster message
                if (state.group.length > 15) {
                    this.ToasterServiceInstace.ShowError(
                        'You can not group more than 10 columns',
                    );
                    state.group.splice(state.group.length - 1, 1);
                }
            }
            this.gridModel.GroupSettings = state.group ? state.group.slice() : null;
            this.gridModel.SortSettings = state.sort ? state.sort.slice() : null;
            this.gridModel.FilterSettings = state.filter;
            this.gridData = process(this.scheduleradminData, this.gridModel.GridState);
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
        this.scheduleradminData = [];
    }
}
