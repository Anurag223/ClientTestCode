import {
  Component, OnInit, OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { FormGroup } from '@angular/forms';
import { channelAndEquipmentCode, channeldefinition } from '../models/channeldefinition.model';
import { ChannelDefinitionService } from './channeldefinition.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { XLSXExportService } from 'src/app/sharedcomponents/xlsx-exporter/xlsx-export-service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-tlm-utils-channeldefinition',
  templateUrl: './channeldefinition.component.html',
  styleUrls: ['./channeldefinition.component.scss']
})

export class ChannelDefinitionComponent extends BaseComponent implements OnInit {

  channelDefinitionData: channeldefinition[] = [];
  gridData: any = [];
  gridModel: GridConfigModel;
  loadingLabel: string = '';
  channeldefinitionModel = {};
  data: any;
  equipmentCode: string;
  disabledCount: number;
  pageSizes = [20, 50, 100, 1000, 10000, 20000];
  btnCount = 3;
  height = 300;
  closeResult = '';
  equipmentCodeData: any;
  modalReference: NgbModalRef;
  totalCount: any;
  public opened = false;
  @ViewChild(GridComponent, { static: false }) channeldefinitiongrid: GridComponent;
  formGroup: FormGroup;

  constructor(loggerService: LoggerService, private changeDetector: ChangeDetectorRef, public channelDefinitionService: ChannelDefinitionService,
    private loaderService: LoaderService, private excelService: XLSXExportService, private modalService: NgbModal
  ) {
    super('ChannelDefinitionComponent', loggerService);
  }



  ngOnInit() {
    this.initGridModel();
    this.getChannelDefinitionData();

  }

  public close() {
    this.opened = false;
  }
  public open(dataItem: any) {

    this.equipmentCodeData = dataItem.equipmentCodes;
    this.data = this.equipmentCodeData.slice();
    this.opened = true;
  }

  onSubmit(channeldefinationModel: channeldefinition): void {
    this.loaderService.showSpinner();
    if(channeldefinationModel.equipmentCodes!=null && channeldefinationModel.equipmentCodes.length >0){
      var eqcode = channeldefinationModel.equipmentCodes;
      channeldefinationModel.equipmentCodes = eqcode.toLocaleString().split(',');
    }
    this.channelDefinitionService.createChannelDefinitions(this.channeldefinitionModel)
      .subscribe(
        () => {
          this.loaderService.hideSpinner();
          this.ToasterServiceInstace.ShowSuccess("Channel Definition created successfully");
          this.refreshData();
        },
        error => {
          this.WriteErrorLog('Error in creating channel definition', error);
          this.loaderService.hideSpinner();
          if (error.error.detail != null)
            this.ToasterServiceInstace.ShowError(error.error.detail);
          else
            this.ToasterServiceInstace.ShowError('Something went wrong in creating channeldefinition');
        });
    this.channeldefinitionModel = {};
    this.modalReference.close();
  }

  //Function for Opening Popup
  openModal(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
      this.channeldefinitionModel = {};
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

  //Function for closing Popup
  closeModal() {
    this.modalService.hasOpenModals();
    this.channeldefinitionModel = {};
    this.ToasterServiceInstace.ShowInformation("Operation Cancelled");
  }


  getChannelDefinitionData(): void {
    this.loadingLabel = '... loading data ...';
    this.loaderService.showSpinner();
    this.channelDefinitionService.getChannelDefinitions().pipe(
      map(cd => {
        this.totalCount = cd.meta.totalCount;
      }),
      mergeMap(() => this.channelDefinitionService.getChannelDefinitions(this.totalCount))
    ).subscribe(
      data => {
        this.channelDefinitionData = data.collection;
        if ( this.channelDefinitionData!=null && this.channelDefinitionData.length > 0) {
          this.loadingLabel = '';
          this.ToasterServiceInstace.ShowInformation('Loaded Channel Definition');
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
        this.WriteErrorLog('Error in channelDefinitionData subscribe', error);
        this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving mapping data.');
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
    this.WriteDebugLog('ChannelDefinitionComponent => ngAfterViewInit');
    if (this.channeldefinitiongrid && this.channeldefinitiongrid.columnList) {
      if (this.gridModel) {
        this.gridModel.columns = this.channeldefinitiongrid.columns.toArray() as ColumnComponent[];
        this.gridModel.DataGridInstance = this.channeldefinitiongrid;
      }
      this.changeDetector.detectChanges();
      this.onResize();
    }
  }


  clearData() {
    this.channelDefinitionData = [];
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
    this.WriteDebugLog('ChannelDefinitionComponent => onResize');
    const tableH = window.innerHeight;
    this.gridModel.gridHeight = tableH - 65; // 90;
    this.gridModel.gridHeight = tableH - 105; // 90;
  }
  public editHandler({ dataItem }) {

    if (confirm("Do you want to delete channeldefinition?")) {
      var channelcode = dataItem.code;

      this.channelDefinitionService.deleteChannelDefinition(channelcode).subscribe(
        () => {
          this.loaderService.hideSpinner();
          this.ToasterServiceInstace.ShowSuccess('Deleted channel definition');
          this.refreshData();

        },
        error => {
          this.WriteErrorLog('Error in deleting the channeldefinition', error);
          this.loaderService.hideSpinner();
          if (error.error != null)
            this.ToasterServiceInstace.ShowError(error.error);
          else
            this.ToasterServiceInstace.ShowError('Something went wrong in deleting the channeldefinition');
        });
    }


  }
  
  exportAsXLSX(): void {
    let channelAndEquipmentCodes: channelAndEquipmentCode[] = [];

    this.channelDefinitionData.forEach((element: channeldefinition) => {

      if (element.equipmentCodes) {
        element.equipmentCodes.forEach(eqcode => {
          let channeldefinitionInfo = {} as channelAndEquipmentCode;
          channeldefinitionInfo.channelCode = element.code;
          channeldefinitionInfo.equipmentCode = eqcode;
          channelAndEquipmentCodes.push(channeldefinitionInfo);
        })
      }
      else {
        let channeldefinitionInfo = {} as channelAndEquipmentCode;
        channeldefinitionInfo.channelCode = element.code;
        channelAndEquipmentCodes.push(channeldefinitionInfo);
      }
    });

    this.excelService.exportAsExcelFile(channelAndEquipmentCodes, 'ChannelAndEquipmentCodeData');
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
      this.gridData = process(this.channelDefinitionData, this.gridModel.GridState);
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


}

