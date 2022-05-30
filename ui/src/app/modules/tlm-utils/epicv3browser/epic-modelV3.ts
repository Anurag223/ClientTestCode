// Define existing EPIC classification on its own

export interface EpicClassication {
    type: string;  // convenience
    division: string;
    businessLine: string; // used to be segment
    subBusinessLine: string; // used to be subsegment
    productFamily: string;
    technology: string; // used to be product line
    brand: string;
    equipmentSystem: string; // used to be equipment code
    name: string;
    id: string;
    toolNameAttribute: string;  //at 7th level only
}
export interface IEpicAPIResponse {
    collection: Group[]; // collection of Groups
    links: Links;
    meta: Meta;
}
export interface Group {
    code: string;
    type: string;
    name: string;
    children: ProductLine[];
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    id: string;
}


export interface ProductLine {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: SubProductLine[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface SubProductLine {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: ProductFamily[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface ProductFamily {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: Technology[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface Technology {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: Brand[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface Brand {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: (Child | Child | Child[] | EquipmentSystem)[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface EquipmentSystem {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: any[];
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  id: string;
}

export interface Child {
  code: string;
  type: string;
  name: string;
  parentCode: string;
  children: any[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
  attributes: Attribute[]
}

export interface Attribute {
  code: string;
  name: string;
  value: string;
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
