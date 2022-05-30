import { ConflictStatus } from "./conflictmanagement-model";

export interface InfluxDbMapping {
        equipmentCode: string,
        dbName: string,
        status:string,
        measurementName:string
        conflictStatus:ConflictStatus,
        isEnabled:boolean
}

export interface InfluxAndDbMappingUpdateResponse{
        dbMapUpdateStatus : boolean,
        dbMapUpdateMessage :string,
        influxDbCreationMessage: string,
        errorDetails:string
}

