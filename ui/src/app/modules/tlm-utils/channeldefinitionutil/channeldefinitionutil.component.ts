import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ChannelDefinitionUtilService } from './channel-definition-util.service';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import {CompositeFilterDescriptor,filterBy,process } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridComponent, PageChangeEvent} from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { FormGroup } from '@angular/forms';
import { channelAndEquipmentCode, channeldefinition, channelsPerEquipmentCode } from '../models/channeldefinition.model';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/base/loader/loader.service';
import { map, mergeMap } from 'rxjs/operators';
import { XLSXExportService } from '../../../sharedcomponents/xlsx-exporter/xlsx-export-service';

@Component({
  selector: 'app-fmp-channeldefinitionutil',
  templateUrl: './channeldefinitionutil.component.html',
  styleUrls: ['./channeldefinitionutil.component.scss']
})

export class ChannelDefinitionUtilComponent extends BaseComponent implements OnInit {

  channelDefinitionData: channeldefinition[] = [];
  channelAndEquipmentCodes: channelAndEquipmentCode[] = [];
  channelDetails: channelAndEquipmentCode[]=[];
  completeChannelDataSet: channelAndEquipmentCode[] = [];
  gridData: any = [];
  gridModel: GridConfigModel;
  loadingLabel: string = '';
  channelsForEquipmentModel = {};
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
  @ViewChild(GridComponent, { static: false }) channeldefinitionutilgrid: GridComponent;
  formGroup: FormGroup;
  selectedFile: any;
  filter: CompositeFilterDescriptor;

  constructor(loggerService: LoggerService, private changeDetector: ChangeDetectorRef, public channelDefinitionUtilService: ChannelDefinitionUtilService,
    private loaderService: LoaderService, private modalService: NgbModal, private excelService: XLSXExportService,) {
    super('ChannelDefinitionUtilComponent', loggerService);
  }

  ngOnInit() {
    this.initGridModel();
    this.getChannelDefinitionData();
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
    this.WriteDebugLog('ChannelDefinitionUtilComponent => onResize');
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
      this.gridData = process(this.channelAndEquipmentCodes, this.gridModel.GridState);
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

  getChannelDefinitionData(): void {
    this.loadingLabel = '... loading data ...';
    this.loaderService.showSpinner();
    this.channelDefinitionUtilService.getChannelDefinitions().pipe(
      map(cd => {
        this.totalCount = cd.meta.totalCount;
      }),
      mergeMap(() => this.channelDefinitionUtilService.getChannelDefinitions(this.totalCount))
    ).subscribe(
      data => {
        this.channelAndEquipmentCodes=[];
        this.channelDefinitionData = data.collection;
        this.channelDefinitionData.forEach((element: channeldefinition) => {
          if (element.equipmentCodes != null && element.equipmentCodes.length > 0) {
            var eqcode = element.equipmentCodes.toLocaleString().split(',');
            eqcode.forEach(equipmentcode => {
              let channelDefinition = {} as channelAndEquipmentCode;
              channelDefinition.channelCode = element.code;
              channelDefinition.equipmentCode = equipmentcode;
              this.channelAndEquipmentCodes.push(channelDefinition);
            });
          }
          else {
            let channelDefinition = {} as channelAndEquipmentCode;
            channelDefinition.channelCode = element.code;
            this.channelAndEquipmentCodes.push(channelDefinition);
          }
        });
        if (this.channelAndEquipmentCodes != null && this.channelAndEquipmentCodes.length > 0) {
          this.loadingLabel = '';
          this.ToasterServiceInstace.ShowInformation('Loaded channel definitions with equipment code');
          this.loaderService.hideSpinner();
          this.dataStateChange(this.gridModel.GridState);
        } else {

          this.loadingLabel = '';
          this.loaderService.hideSpinner();
          this.ToasterServiceInstace.ShowInformation('No data found.');
        }
          this.completeChannelDataSet=this.channelAndEquipmentCodes;
      },
      error => {
        this.loadingLabel = '';
        this.loaderService.hideSpinner();
        this.WriteErrorLog('Error in channelAndEquipmentCodes subscribe', error);
        this.ToasterServiceInstace.ShowWarning('Something went wrong retrieving mapping data.');
      },
       
    );
  }


  openModalForImportingChannelDefinitions(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
      this.channelsForEquipmentModel = {};
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

  closeModal() {
    this.modalService.hasOpenModals();
    this.channelsForEquipmentModel = {};
    this.ToasterServiceInstace.ShowInformation("Operation Cancelled");
  }

  handleFileInput(event) {
    this.selectedFile = event.target.files[0];

  }

  onSubmit(channelsForEquipmentModel: channelsPerEquipmentCode): void {
    this.loaderService.showSpinner();
    this.excelService.convertExcelToJson(this.selectedFile).then(
      outputJson => {
        let channelCodesList: string[] = [];
        (outputJson as channelAndEquipmentCode[]).forEach(element => {
          channelCodesList.push(element.channelCode);
        });
        if (channelCodesList.includes(undefined)) {
          this.loaderService.hideSpinner();
          this.WriteErrorLog("Error in uploaded file as it does not contain channel code column",null);
          this.ToasterServiceInstace.ShowError("Error in uploaded file as it does not contain channel code column");
        }
        else {
          channelsForEquipmentModel.channelCodes = channelCodesList;
          if (channelsForEquipmentModel.channelCodes != null &&
            channelsForEquipmentModel.channelCodes.length > 0) {
            this.channelDefinitionUtilService.uploadChannelsByEquipmentCode(channelsForEquipmentModel)
              .subscribe(
                () => {
                  this.loaderService.hideSpinner();
                  this.ToasterServiceInstace.ShowSuccess("Channels imported successfully");
                  this.refreshData();
                },
                error => {
                  this.WriteErrorLog('Error in uploading channels for equipment code: ' + channelsForEquipmentModel.equipmentCode, error);
                  this.loaderService.hideSpinner();
                  if (error.error.detail!=null)
                    this.ToasterServiceInstace.ShowError(error.error.detail);
                  else
                    this.ToasterServiceInstace.ShowError('Something went wrong while uploading channels');
                });
          }
        }
      },
      err => {
        this.WriteErrorLog('Error in reading excel file', err);
        this.loaderService.hideSpinner();
        if (err.error.detail != null)
          this.ToasterServiceInstace.ShowError(err.error.detail);
        else
          this.ToasterServiceInstace.ShowError('Something went wrong while reading excel file');
      }
    );

    this.channelsForEquipmentModel = {};
    this.modalReference.close();
  }

  exportDataToExcel(): void {
    let exportChannelDataSet: channelAndEquipmentCode[] = [];
    let filteredEquipmentCode:string
    
        if(this.gridModel.FilterSettings.filters!=null && this.gridModel.FilterSettings.filters.length > 0)
        {
          this.completeChannelDataSet=filterBy(this.channelAndEquipmentCodes,this.gridModel.FilterSettings.filters[0]);
          filteredEquipmentCode= 'Channels_For_'+ this.completeChannelDataSet[0].equipmentCode;
        }
        else
        {
        this.completeChannelDataSet= this.channelAndEquipmentCodes;
        filteredEquipmentCode= 'All_Channels_Data';
        }        
       
        const filterData= this.completeChannelDataSet.map(y=>y.channelCode);
        filterData.forEach(element=>{
          let channelInfo={} as channelAndEquipmentCode;
          channelInfo.channelCode=element;
          exportChannelDataSet.push(channelInfo);
        })
        
      this.excelService.exportAsExcelFile(exportChannelDataSet, filteredEquipmentCode);
    }

    public pageChange(pageChange: PageChangeEvent): void {
      this.onCDDetach();
      this.gridModel.skip = pageChange.skip;
      this.gridModel.take = pageChange.take;
      this.onResize();
      this.onCDReAttach();
    }

}
