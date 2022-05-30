import {
  Component,ViewEncapsulation, OnInit, OnDestroy, 
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
import { InfluxDbMappingService } from './influx-db-mapping.service';
import { InfluxAndDbMappingUpdateResponse, InfluxDbMapping } from '../models/influx-db-mapping.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { TooltipDirective } from "@progress/kendo-angular-tooltip";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { ConflictStatus } from '../models/conflictmanagement-model';


@Component({
  selector: 'app-tlm-utils-historianmanagement',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './historianmanagement.component.html',
  styleUrls: ['./historianmanagement.component.scss']
})
export class HistorianManagementComponent extends BaseComponent implements OnInit {

  influxdbMappingData:InfluxDbMapping[]=[];
  gridData: any = [];
  gridModel: GridConfigModel;
  loadingLabel: string = '';
  data:any;
  equipmentCode: string;
  disabledCount: number;
  dbMapConflictCount:number;
  
  pageSizes = [20, 50, 100, 1000, 10000, 20000];
  btnCount = 3;
  height = 300;
  closeResult = '';
 
  @ViewChild(TooltipDirective,{ static: false}) public tooltipDir: TooltipDirective;
  @ViewChild(GridComponent, { static: false }) influxMappingAdminGrid: GridComponent;

  constructor( loggerService: LoggerService, private changeDetector: ChangeDetectorRef,public influxDbMappingService: InfluxDbMappingService,
    private excelService: XLSXExportService,private modalService: NgbModal,private loaderService: LoaderService,private sanitizer: DomSanitizer) { 
    super('HistorianManagementComponent', loggerService);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.influxdbMappingData, 'influx-mapping-data');
    
}

ngOnInit() {
  this.initGridModel();
  this.getInfluxMappingData();
}

public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  if ((element.nodeName === 'TD' || element.nodeName === 'TH')
          && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
  } else {
      this.tooltipDir.hide();
  }
}


  public onChange(dataitem: any, value: boolean) {
    this.loaderService.showSpinner();
    let status = dataitem.status;
    this.influxDbMappingService.UpdateDbMapDetails(dataitem.equipmentCode, value).subscribe(
      data => {
        if (value) {
          status = "Enabled";
          this.ToasterServiceInstace.ShowSuccess('DbMapping is ' + status +
            ' for measurement: ' + dataitem.measurementName +
            ' and DB is added in Influx');
        }
        else {
          status = "Disabled";
          this.ToasterServiceInstace.ShowSuccess('DbMapping is ' + status +
            ' for measurement: ' + dataitem.measurementName);
        }
        this.refreshData();
      },
      (error: InfluxAndDbMappingUpdateResponse) => {      
        if(error.errorDetails== undefined){
          error.errorDetails= "";          
        }        
        this.WriteErrorLog ('Something went wrong during the operation.',  error.errorDetails);   
        this.ToasterServiceInstace.ShowError('Something went wrong during the operation. ' + error.errorDetails);  
        dataitem.isEnabled= !value; 
        this.loaderService.hideSpinner();
      }

    );
  } 

  getInfluxMappingData(): void {
    this.loadingLabel = '... loading data ...';
    this.loaderService.showSpinner();
    this.influxDbMappingService.getDbMapDetails().subscribe(
      data => {
        this.influxdbMappingData = data;
        this.influxdbMappingData.forEach(element => {
          if (element.status == "Enabled")
            element.isEnabled = true;
          else
            element.isEnabled = false;
        });
        if (this.influxdbMappingData.length > 0) {
          this.loadingLabel = '';
          this.ToasterServiceInstace.ShowInformation('Loaded influx db mappings');
          this.loaderService.hideSpinner();
          this.disabledCount = this.getDisabledDBMapsCount();
          this.dbMapConflictCount = this.getDBMapsConflictsCount();
          this.dataStateChange(this.gridModel.GridState);
        } else {

          this.loadingLabel = '';
          this.loaderService.hideSpinner();
          this.ToasterServiceInstace.ShowInformation('No data found.');
        }
      },
      error => {
        this.loadingLabel = '';
        this.loaderService.hideSpinner();
        this.WriteErrorLog('Error in getinfluxmappingdata subscribe', error);
        this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving mapping data.');
      },

    );
  }

//Function for Creating/Updating DB Mapping with the provided Equipment Code
CreateUpdateDBMapping(): void {
  var EquipmentCode = this.equipmentCode;
  if(this.equipmentCode == null || this.equipmentCode =='' || this.equipmentCode == undefined)
  {
    this.ToasterServiceInstace.ShowWarning('Please enter equipment code');
    return;
  }
  else
  {
    this.loaderService.showSpinner();
    this.influxDbMappingService.CreateDBMapForEquipment(EquipmentCode)
      .subscribe(
        response => {
          this.loaderService.hideSpinner();
          if(response=="Equipmentcode added in existing influxdb mapping")
            this.ToasterServiceInstace.ShowSuccess(EquipmentCode+' added in existing influxdb mapping');
          else
          this.ToasterServiceInstace.ShowSuccess(response);
          this.refreshData();
        
        },
        error => {
          this.WriteErrorLog('Error in creating/updating db mapping for equipmentcode:'+EquipmentCode, error);
          this.loaderService.hideSpinner();
          if(error.error!=null)
            this.ToasterServiceInstace.ShowError(error.error);
          else
            this.ToasterServiceInstace.ShowError('Something went wrong in creating db mapping for equipmentcode:'+EquipmentCode);
        });
        this.equipmentCode="";
  }
}

//Function for Opening Popup
open(content) {
  this.modalService.open(content,
 {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = 
       `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

//Function while closing Popup
closeModal()
{
  this.ToasterServiceInstace.ShowInformation('Operation Cancelled'); 
  this.equipmentCode="";
}

//Function for getting No of Influx DB Mappings which are disabled
getDisabledDBMapsCount()
{
  var resArr = [];
  this.influxdbMappingData.filter(function(item){
    var i = resArr.findIndex(x => (x.measurementName == item.measurementName));
    if(i <= -1){
          resArr.push(item);
    }
    return null;
  });
  return resArr.filter(x=>x.status =="Disabled").length;
}

//Get DB Maps Conflicts Count
getDBMapsConflictsCount()
{
  return this.influxdbMappingData.filter(x=>x.conflictStatus.toString() == ConflictStatus[ConflictStatus.OutOfSync]).length;
}

public pageChange(pageChange: PageChangeEvent): void {
  this.onCDDetach();
  this.gridModel.skip = pageChange.skip;
  this.gridModel.take = pageChange.take;
  this.onResize();
  this.onCDReAttach();
}

ngAfterViewInit() {
  this.WriteDebugLog('HistorianmanagementComponent => ngAfterViewInit');
  if (this.influxMappingAdminGrid && this.influxMappingAdminGrid.columnList) {     
      if (this.gridModel) {
          this.gridModel.columns = this.influxMappingAdminGrid.columns.toArray() as ColumnComponent[];
          this.gridModel.DataGridInstance = this.influxMappingAdminGrid;
      }
      this.changeDetector.detectChanges();
      this.onResize();
  }
}

clearData() {
  this.influxdbMappingData = [];
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
    this.WriteDebugLog('HistorianManagementComponent => onResize');
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
        this.gridData = process(this.influxdbMappingData, this.gridModel.GridState);
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
  this.influxdbMappingData = [];
}

//Implementing the color over the field as per old and new value
public colorCode(value: string): SafeStyle {
  let result=null;
  if(value!="" && value==ConflictStatus[ConflictStatus.OutOfSync])
  {
    result = "#d0d0d0";
  }
  if(value!="" && value==ConflictStatus[ConflictStatus.InSync])
  {
    result = "#badeda";
  }
  return this.sanitizer.bypassSecurityTrustStyle(result);
}
}
