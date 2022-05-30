export interface EquipmentAPIResponse {
    collection: Equipment[];
    links: Links;
    meta: Meta;
}

export interface Equipment {
    id: string;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    activeCmms: string;
    sourceSystemRecordId: string;
    alternateIdentities: AlternateIdentity[];
    controlSiteCode: string;
    description: string;
    equipmentCode: string;
    equipmentCodeClassification?: EquipmentCodeClassification;
    equipmentState: string;
    equipmentStatus?: EquipmentStatus;
    manufacturer: string;
    manufacturedDate: Date;
    materialNumber: string;
    owner: string;
    ownerSiteCode: string;
    pairedEquipment?: Equipment;
    pairedEquipmentId?: string;
    serialNumber: string;
    wellKnownEntityId: string;
    workorders: Workorder[];
    measurementPoints: MeasurementPoint[];
    managedAttributes: ManagedAttributes;
    unmanagedAttributes: CollectionUnmanagedAttributes;
}

export interface EquipmentStatus {
    technicalStatus: string;
    movementStatus: string;
    repairStatus: string;
}
export interface AlternateIdentity {
    alternateSystemRecordId: string;
    sourceSystemId: string;
}

export interface EquipmentCodeClassification {
    groupCode: string;
    productLineCode: string;
    subProductLineCode: string;
    productFamilyCode: string;
    emsProductLineCode: string;
    brandCode: string;
    equipmentCode: string;
    name: string;
}

export interface ManagedAttributes {
}

export interface MeasurementPoint {
    id: string;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    code: string;
    defaultUOM: string;
    name: string;
    uom: Uom;
    managedAttributes: ManagedAttributes;
    unmanagedAttributes: ManagedAttributes;
}

export interface Uom {
    id: string;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    name: string;
    quantityType: string;
    dimension: Dimension;
    catalogName: string;
    catalogSymbol: string;
    rP66Symbol: string;
    managedAttributes: ManagedAttributes;
    unmanagedAttributes: ManagedAttributes;
}

export interface Dimension {
    id: string;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    name: string;
    description: string;
    dimensionalClass: string;
    managedAttributes: ManagedAttributes;
    unmanagedAttributes: ManagedAttributes;
}

export interface CollectionUnmanagedAttributes {
    earaa2392: PurpleEaraa2392;
}

export interface PurpleEaraa2392 {
    slb_usagetype: Catlevel;
    slb_productionnumber: Catlevel;
    slb_guid: Catlevel;
    catlevel: Catlevel;
    plustmodel: Catlevel;
}

export interface Catlevel {
    value: string;
    name: string;
}

export interface Workorder {
    id: string;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    description: string;
    maintenanceActivitySubType: string;
    repairSiteCode: string;
    statusChangeDate: Date;
    workorderNumber: string;
    workorderStatusValue: string;
    managedAttributes: ManagedAttributes;
    unmanagedAttributes: WorkorderUnmanagedAttributes;
}

export interface WorkorderUnmanagedAttributes {
    earaa2392: FluffyEaraa2392;
}

export interface FluffyEaraa2392 {
    equipmentid: Catlevel;
    haschildren: Catlevel;
    parentchgsstatus: Catlevel;
    istask: Catlevel;
    reportedby: Catlevel;
}

export interface Links {
    first: First;
    last: First;
}

export interface First {
    href: string;
    rel: string;
}

export interface Meta {
    totalCount: number;
}
