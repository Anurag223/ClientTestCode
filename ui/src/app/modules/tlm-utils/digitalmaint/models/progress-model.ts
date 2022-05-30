

export interface StatusList {
    rows: StatusPoint[];
}
export interface StatusPoint {
    timestamp: Date;
    status: string;
}


export interface ODMEquipEventStatus {
    slbCorrelationId: string;
    wkeid: string;
    timestamp: Date;
    workOrderRequested: boolean;
    details: ODMPoint[];
}
export interface ODMPoint {
    timestamp: Date;
    message: string;
}
export interface WORequestStatus {
    currentStatus: string;
    errors: StatusError[];
    whenCompleted: Date;
    whenProcessing: Date;
    whenReceived: Date;
    originalRequestUri: string;
    id: string;
}
export interface StatusError {
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    detail: string;
    status: number;
    title: string;
}

