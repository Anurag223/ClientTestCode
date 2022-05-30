import {
  Component, ViewEncapsulation, OnInit, ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';


import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { TooltipDirective } from "@progress/kendo-angular-tooltip";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { AuditLog } from '../models/auditlog-model';
import { AuditLogService } from './auditlogging.service';


@Component({
  selector: 'app-tlm-utils-auditlog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './auditlogging.component.html',
  styleUrls: ['./auditlogging.component.scss']
})
export class AuditLogComponent extends BaseComponent implements OnInit,OnDestroy {

  auditLogData: AuditLog[] = [];
  gridData: any = [];
  gridModel: GridConfigModel;
  loadingLabel: string = '';
  data: any;
  equipmentCode: string;
  disabledCount: number;
  dbMapConflictCount: number;

  pageSizes = [20, 50, 100, 1000, 10000, 20000];
  btnCount = 3;
  height = 300;
  closeResult = '';

  @ViewChild(TooltipDirective, { static: false }) public tooltipDir: TooltipDirective;
  @ViewChild(GridComponent, { static: false }) auditLogAdminGrid: GridComponent;

  constructor(loggerService: LoggerService, private changeDetector: ChangeDetectorRef,
    public auditLogService: AuditLogService,
    private excelService: XLSXExportService,
    private loaderService: LoaderService, private sanitizer: DomSanitizer) {
    super('AuditLogComponent', loggerService);
  }

  exportAsXLSX(): void {
    let auditLogDetails: AuditLog[]=[];
    if ( this.auditLogData!=null && this.auditLogData.length > 0) {      
      
      this.auditLogData.forEach(element => {
        let a2rLog ={} as AuditLog;
        a2rLog.activityType= element.activityType
        a2rLog.applicationName= element.applicationName;
        a2rLog.oldValue=element.oldValue;
        a2rLog.newValue= element.newValue;
        a2rLog.createdBy= element.createdBy;
        a2rLog.createdDate=element.createdDate;
        auditLogDetails.push(a2rLog);
        
      });
    
    this.excelService.exportAsExcelFile(auditLogDetails, 'audit-log-data');
    }
    else
    {
      this.ToasterServiceInstace.ShowInformation('Nothing to export');
    }
  }

  ngOnInit() {
    this.initGridModel();
    this.getAuditLogData();
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


  getAuditLogData(): void {
    this.loadingLabel = '... loading data ...';
    this.loaderService.showSpinner();
    this.auditLogService.getAuditLogDetails().subscribe(
      data => {             
        this.auditLogData = data;      
        if (this.auditLogData!=null && this.auditLogData.length > 0) {
          this.loadingLabel = '';
          this.ToasterServiceInstace.ShowInformation('Loaded audit logs');
          this.loaderService.hideSpinner();
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
        this.WriteErrorLog('Error in getAuditLogData subscribe', error);
        this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving audit log data.');
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
    this.WriteDebugLog('AuditLogComponent => ngAfterViewInit');
    if (this.auditLogAdminGrid && this.auditLogAdminGrid.columnList) {
      if (this.gridModel) {
        this.gridModel.columns = this.auditLogAdminGrid.columns.toArray() as ColumnComponent[];
        this.gridModel.DataGridInstance = this.auditLogAdminGrid;
      }
      this.changeDetector.detectChanges();
      this.onResize();
    }
  }

  clearData() {
    this.auditLogData = [];
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
    this.WriteDebugLog('AuditLogComponent => onResize');
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
      this.gridData = process(this.auditLogData, this.gridModel.GridState);
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
    this.auditLogData = [];
  }
}
