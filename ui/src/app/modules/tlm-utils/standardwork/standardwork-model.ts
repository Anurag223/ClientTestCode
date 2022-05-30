// Define new generic StandardWork structure
// TBD
export interface IStandardWorkAPIResponse {
    createdDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    data?: (StandardWorkContainer)[] | null;
    links: Links;
    meta: Meta;
}
export interface StandardWorkContainer {
    createdDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    attributes: StandardWork;
    links: Links1;
    type: string;
}
export interface StandardWork {
    id: string;
    createdDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    swId: string;
    metaData: MetaData;
    imageFileNames?: (string)[] | null;
    originalFileName: string;
    referencedSWs?: (ReferencedSWsEntity)[] | null;
    swType: number | null;
    keywords?: string | null;
    title?: string | null;
    shortDescriptions?: (string)[] | null;
}
export enum StandardWorkType
{
    Pack =1,
    CTI = 2, 
    Operation = 3, 
    CL = 4, 
    ECL= 5,
    Unknown = 99 

}
export interface MetaData {
    applicableEquipment?: (ApplicableEquipmentEntity)[] | null;
    countries?: (CountryEntity)[] | null;
    services?: (ServiceEntity)[] | null;
}
export interface ApplicableEquipmentEntity {
    id: string;
    name: string;
}
export interface CountryEntity {
    isoCodenumeric: string;
    name: string;
}
export interface ServiceEntity {
    serviceGroupName: string;
    serviceTypeName: string;
    serviceTypeID: string;
}
export interface ReferencedSWsEntity {
    sequence: number;
    referencedSWId: string;
    referencedSWFilename: string;
}
export interface Links1 {
    self: SelfOrFirstOrLast;
}
export interface SelfOrFirstOrLast {
    createdDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    href: string;
    rel: string;
}
export interface Links {
    first: SelfOrFirstOrLast;
    last: SelfOrFirstOrLast;
}
export interface Meta {
    totalCount: number;
}
