/* Schlumberger Confidential
/* Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../base/component/base/base.component';
import { LoggerService } from '../../../base/service/logger.service';
import { EpicClassication, Group } from '../epicv3browser/epic-modelV3';
import { InfluxService } from './influx.service';

@Component({
    selector: 'app-tlm-utils-historianprovision',
    templateUrl: './historianprovision.component.html',
    styleUrls: ['./historianprovision.component.scss'],
})
export class HistorianProvisionComponent extends BaseComponent implements OnInit, OnDestroy {

    public dbList: any[] = [];
    public expandedKeys: any[] = ['1', '1_1', '1_1_0', '1_1_0_0'];
    public selectedKeys: any[] = [];
    public selectedName: string = '';
    public canCreate = false;
    public dbCount: number = 0;
    public noAccessMsg: string = "";
    public dbNameString: string = "";
    static readonly ALLOWED_PROVISION_TYPE = "Technology";

    constructor(
        loggerService: LoggerService,  
        public influxService: InfluxService,
    ) {
        super('EpicComponent', loggerService);
    }

    ngOnInit() {
        this.getInfluxDBDatqData();
    }

    public isItemSelected(_: any, index: string): boolean {
        if (this.selectedKeys && this.selectedKeys.indexOf(index) > -1) {
            return true;
        }
        this.canCreate = false;
        return false;
    }

    onEpicArrayEmission(incomingEpicArray: Group[]) {
        // nothing to do
    }
    onEpicTreeSelectedEmission(selectedEpicNodes: Group[])
    {
        // we will only allow single selection -- should put a check here for array > 1
        if (selectedEpicNodes.length > 1) {
            this.ToasterServiceInstace.ShowWarning('Please only select one item for DB provisioning.');
        }
        let selectedItem: Group = selectedEpicNodes[0];

        // check if we are at appropriate level for DB provisioning.
        // THIS DOES NOT WORK FOR ROWS THAT ARE SELECTED - FIX ASAP
        if (selectedItem.type === HistorianProvisionComponent.ALLOWED_PROVISION_TYPE) {

            let usefulName: string = selectedItem.name;
            // remove all scpecial characters
            usefulName = usefulName.replace('[', '');
            usefulName = usefulName.replace(']', '');
            usefulName = usefulName.replace('&', 'AND');
            // remove all spaces and replace with _
            usefulName = usefulName.replace(/ /g, '_');
            this.selectedName = usefulName;
            // check if currently selected DB exists already.
            if (!this.dbHasName(usefulName)) {
                this.canCreate = true
            }
            else {
                this.canCreate = false;
                this.ToasterServiceInstace.ShowInformation('Database ' + this.selectedName + ' has already been provisioned');
            }
        }
        else {
            this.selectedName = '';
        }
    }
    onEpicGridSelectedEmission(selectedEpicRows: EpicClassication[]) {
        // we will only allow single selection -- should put a check here for array > 1
        if (selectedEpicRows.length > 1) {
            this.ToasterServiceInstace.ShowWarning('Please only select one item for DB provisioning.');
        }
        let selectedItem: EpicClassication = selectedEpicRows[0];

        // check if we are at appropriate level for DB provisioning.
        // THIS DOES NOT WORK FOR ROWS THAT ARE SELECTED - FIX ASAP
        if (selectedItem.technology && selectedItem.technology.length > 0  ) {

            let usefulName: string = selectedItem.technology;
            // remove all scpecial characters
            usefulName = usefulName.replace('[', '');
            usefulName = usefulName.replace(']', '');
            usefulName = usefulName.replace('&', 'AND');
            // remove all spaces and replace with _
            usefulName = usefulName.replace(/ /g, '_');
            this.selectedName = usefulName;
            // check if currently selected DB exists already.
            if (!this.dbHasName(usefulName)) {
                this.canCreate = true
            }
            else {
                this.canCreate = false;
                this.ToasterServiceInstace.ShowInformation('Database ' + this.selectedName + ' has already been provisioned');
            }
        }
        else {
            this.selectedName = '';
        }
    }
    private dbHasName(name: any): boolean {
        for (let i = 0; i < this.dbList.length; i++) {
            let dbNameElement = this.dbList[i][0];// odd datastructure array of single elment arrays
            if (dbNameElement === name) return true;
        }
        return false;
    }
    /** Retreive the entire EPIC hierarchy */
    getInfluxDBDatqData() {

        this.influxService.getDatabases('').subscribe(
            dbData => {
                //this.dbList = dbData;
                this.dbList = dbData.results[0].series[0].values;
                this.dbCount = this.dbList.length;
                this.dbNameString = "";
                for (let i = 0; i < this.dbList.length; i++) {
                    let dbNameElement = this.dbList[i][0];// odd datastructure array of single elment arrays
                    if (i == 0) {
                        this.dbNameString = dbNameElement;
                    }
                    else {
                        this.dbNameString = this.dbNameString + ", " + dbNameElement;
                    }
                }
                this.WriteDebugLog(this.dbList.toString());
                if (this.dbCount === 0) {
                    this.noAccessMsg = "You are not able to access the Influx Server. Please verify your group membership";
                }
            },
            error => {
                this.WriteErrorLog('error in getEpicData subscribe', error);


                if (this.dbCount === 0) {
                    this.ToasterServiceInstace.ShowError('You are not able to access the Influx Server. Please verify your group membership');
                    this.noAccessMsg = "No Influx Access.";
                }
            },
        );
    }
    /** Create the database 
        This is the event handler for the createDatabase button.*/
    createDatabase(databaseName: string) {
        let results: any[] = []; // strongly type this!
        this.influxService.createDatabase(databaseName).subscribe(
            resultsData => {

                // if successful, influx returns results.statement_id = 0
                this.WriteInfoLog('resultsData statementid' + resultsData.results[0].statement_id);

                // let influx service determine success... move this down into service.
                // Influx API returns 0 even when the database already exists.
                if (resultsData.results[0].statement_id === 0) {
                    this.WriteInfoLog(databaseName + ' was created successfully.');
                    this.ToasterServiceInstace.ShowSuccess(databaseName + ' was created successfully');
                    this.getInfluxDBDatqData(); // refresh our db list wih the newly created name.
                    this.canCreate = false; // set button disabled.
                }
                else {
                    this.ToasterServiceInstace.ShowError('Database creation may have failed.');
                }
            },
            error => {
                this.WriteErrorLog('error in createDatabase subscribe', error);
                this.ToasterServiceInstace.ShowError('Database creation may have failed.');
            },
        );
    }


    /**
     * We are clearing everything here
     */
    ngOnDestroy() {

    }
}
