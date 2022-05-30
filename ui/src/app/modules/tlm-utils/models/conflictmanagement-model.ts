export interface ConflictManagement {
        dbMapBrandName: string,
        epicBrandName:string,
        dbMapTechnologyName:string,
        epicTechnologyName:string,
        dbMapBrandCode:string,
        epicBrandCode:string,
        dbMapTechnologyCode:string,
        epicTechnologyCode:string,
        conflictStartDate:string,
        epicEquipmentCode:string,
        dbMapEquipmentCode:string,
        conflictStatus:ConflictStatus
}

//Enum for maintaining different Conflict Statuses
export enum ConflictStatus {
        OutOfSync, 
        InSync
}

