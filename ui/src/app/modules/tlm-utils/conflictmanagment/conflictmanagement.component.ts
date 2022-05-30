import {
  Component, ViewEncapsulation,OnInit, OnDestroy, 
  ChangeDetectorRef,
  ViewChild,
  } from '@angular/core';
 
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent  } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';
import { ConflictManagementService } from './conflictmanagement.service';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { ConflictManagement } from '../models/conflictmanagement-model';
import { TooltipDirective } from "@progress/kendo-angular-tooltip";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
  selector: 'app-tlm-utils-conflictmanagement',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './conflictmanagement.component.html',
  styleUrls: ['./conflictmanagement.component.scss'],

})
export class ConflictManagementComponent extends BaseComponent implements OnInit {

  conflictManagementResultSet:ConflictManagement[]=[];
  templateConflictManagement:any[]=[];
  gridData: any = [];
  gridModel: GridConfigModel;
  loadingLabel: string = '';
  data:any;

  pageSizes = [20, 50, 100, 1000, 10000, 20000];
  btnCount = 3;
  height = 300;
  closeResult = '';
 
  @ViewChild(TooltipDirective,{ static: false}) public tooltipDir: TooltipDirective;
  @ViewChild(GridComponent, { static: false }) conflictManagementAdminGrid: GridComponent;

  constructor( loggerService: LoggerService, private changeDetector: ChangeDetectorRef,public conflictManagementService: ConflictManagementService,
    private excelService: XLSXExportService,private loaderService: LoaderService,private sanitizer: DomSanitizer) { 
    super('ConflictManagementComponent', loggerService);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.templateConflictManagement, 'DB_Maps_Conflict_Data_'+new Date());
}

ngOnInit() {
  this.initGridModel();
  this.getEpicDBMapConflictsData();
}

//Function for getting EPIC DB Map Conflict Data from EHC Admin API
getEpicDBMapConflictsData():void{
  this.loadingLabel = '... loading data ...';
  this.loaderService.showSpinner();
  this.conflictManagementService.getDBMapsConflicts().subscribe(
    data=>{          
          this.conflictManagementResultSet=data.collection;
          if (this.conflictManagementResultSet!=null && this.conflictManagementResultSet.length > 0){   
              this.PrepareConflicts();
              this.loadingLabel = '';
              this.ToasterServiceInstace.ShowInformation('Loaded db maps conflicts');
              this.loaderService.hideSpinner();        
              this.dataStateChange(this.gridModel.GridState);
          }else {
                      this.loadingLabel = '';
                      this.loaderService.hideSpinner();
                      this.ToasterServiceInstace.ShowInformation('No data found.');
                  }
              },
              error => {
                  this.loadingLabel = '';
                  this.loaderService.hideSpinner();
                  this.WriteErrorLog('Error in getepicconflictdata subscribe', error);
                  this.ToasterServiceInstace.ShowWarning('Something went wrong in retrieving conflict data.');
              },
  );
}

public pageChange(pageChange: PageChangeEvent): void {
  this.onCDDetach();
  this.gridModel.skip = pageChange.skip;
  this.gridModel.take = pageChange.take;
  this.onResize();
  this.onCDReAttach();
}

ngAfterViewInit() {
  this.WriteDebugLog('ConflictmanagementComponent => ngAfterViewInit');
  if (this.conflictManagementAdminGrid && this.conflictManagementAdminGrid.columnList) {     
      if (this.gridModel) {
          this.gridModel.columns = this.conflictManagementAdminGrid.columns.toArray() as ColumnComponent[];
          this.gridModel.DataGridInstance = this.conflictManagementAdminGrid;
      }
      this.changeDetector.detectChanges();
      this.onResize();
  }
}

clearData() {
  this.templateConflictManagement = [];
  this.loadingLabel = '';
}
refreshData() {
  this.ngOnInit();
}

onCDDetach() {
  this.changeDetector.detach();
}
onCDReAttach() {
  this.changeDetector.reattach();
 this.changeDetector.detectChanges();
}

onResize() {
    this.WriteDebugLog('ConflictManagementComponent => onResize');
    const tableH = window.innerHeight;
    this.gridModel.gridHeight = tableH - 65; // 90;
    this.gridModel.gridHeight = tableH - 105; // 90;
    
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
        this.gridData = process(this.conflictManagementResultSet, this.gridModel.GridState);
        this.changeDetector.markForCheck();
        this.changeDetector.reattach();
    }
    this.onResize();
}

  public initGridModel() {
    this.gridModel = new GridConfigModel();
    this.gridModel.skip = 0;
    this.gridModel.take = 20;
    this.gridModel.GridDateFields = ['lastUpdatedDateTime', 'createdDate']
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
ngOnDestroy() {
  this.templateConflictManagement = [];
}

//Function for showing the tooltip over data
public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  if ((element.nodeName === 'TD' || element.nodeName === 'TH')
          && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
  } else {
      this.tooltipDir.hide();
  }
}


//Function for preparing list of conflict with properties in which actually conflict exists
PrepareConflicts(){
  this.conflictManagementResultSet.forEach(x=>{
    const ConflictManagement =x;
    if(x.dbMapBrandName==x.epicBrandName)
    {
      ConflictManagement.dbMapBrandName="";
      ConflictManagement.epicBrandName="";
    }
    if(x.dbMapTechnologyName==x.epicTechnologyName)
    {
      ConflictManagement.dbMapTechnologyName="";
      ConflictManagement.epicTechnologyName="";
    }
    if(x.dbMapBrandCode==x.epicBrandCode)
    {
      ConflictManagement.dbMapBrandCode="";
      ConflictManagement.epicBrandCode="";
    }
    if(x.dbMapTechnologyCode==x.epicTechnologyCode)
    {
      ConflictManagement.dbMapTechnologyCode="";
      ConflictManagement.epicTechnologyCode="";
    }
    this.templateConflictManagement.push(ConflictManagement)
  })
}

//Implementing the color over the field as per old and new value
public colorCode(value: string,old:boolean): SafeStyle {
  let result=null;
  if(value!="")
  {
  if(old)
    result = "#d0d0d0";
  else
    result = "#badeda";
  }
  return this.sanitizer.bypassSecurityTrustStyle(result);
}
}
