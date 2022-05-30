import {
    Component, OnInit, OnDestroy, Output, EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,} from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import 'hammerjs';
import { DatePipe } from '@angular/common';
// needed for grid

import { process } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GridConfigModel, GridPagerConfigModel } from '../../../sharedcomponents/models/sharedmodels';
import { IClassificationModel } from './classification-model';
import { ClassificationService } from './classification.service';
@Component({
    selector: 'app-fmp-classification',
    templateUrl: './classification.component.html',
    styleUrls: ['./classification.component.scss']
})
export class ClassificationComponent extends BaseComponent implements OnInit, OnDestroy {

    classificationList: IClassificationModel[] = [];

    // grid props
    gridModel: GridConfigModel;
    pageSizes = [20, 50, 100];
    btnCount = 3;
    height = 300;
    gridData: any = [];
    public selectedKeys: any[] = [];

    // The output of this component is the browsed-for epic classification
    @Output() classificationArrayEmission = new EventEmitter<IClassificationModel[]>();
    // Also output is the selections made from the browser
    @Output() selectedClassificationEmission = new EventEmitter<IClassificationModel[]>();


    constructor(
        loggerService: LoggerService,
        private changeDetector: ChangeDetectorRef,
        public classificationService: ClassificationService,
    )
    {
        super('ClassificationBrowserComponent', loggerService);
    }

    ngOnInit() {
        this.initGridModel();

    }
    clearData() {
        this.classificationList = [];
    }
    onEnter(mnvalue:string, snvalue: string) {
        this.clearData();
        this.getClassificationDataAsObject();
    }
    public isItemSelected(_: any, index: string): boolean {
        if (this.selectedKeys && this.selectedKeys.indexOf(index) > -1) {
            return true;
        }
        return false;
    }

    // Determine if we can create a database on the current selection
    public handleSelection(event): void {


        if (event.selected) {

            let selectedClassification: IClassificationModel[] = [];
            for (let i = 0; i < event.selectedRows.length; i++) {
                selectedClassification[i] = event.selectedRows[i].dataItem;
            }
            this.selectedClassificationEmission.emit(selectedClassification);

        }

    }
    getClassificationDataAsObject() {

        this.classificationService.getClassificationObject(
            1, // page
            25, // size
            null, // sort
            null // includes
        ).subscribe(
            incomingEquipList => {
    
                this.classificationList = incomingEquipList.collection;
                if (this.classificationList && this.classificationList.length > 0) {
                    this.WriteInfoLog(this.classificationList.length + ' classification for inputs found');
                    this.ToasterServiceInstace.ShowInformation('found ' + this.classificationList.length +' classification for inputs.');
                    // output to anyone who cares (parent components ;) 
                    this.classificationArrayEmission.emit(this.classificationList);
                    // test
                   // if (this.classificationList.length == 1) {
                   //     this.selectedClassificationEmission.emit(this.classificationList[0]);
                   // }
                    this.dataStateChange(this.gridModel.GridState);
                }
                else {
                    this.ToasterServiceInstace.ShowError('classification not found');
                }
                
            },
            error => {
                this.WriteErrorLog('error in getEquipmentObject subscribe', error);
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
            this.gridData = process(this.classificationList, this.gridModel.GridState);
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
        this.classificationList = [];
    }
}

