export interface AuditLog {
        activityType: ActivityType,
        applicationName:string,
        oldValue:string,
        newValue:string,
        createdBy:string,
        createdDate:string
       }

export enum ActivityType {
        AddEquipmentCode = 0,
        UpdateDBMapStatus = 1
}

export enum ApplicationName {
        DbMapManagement=0
}
