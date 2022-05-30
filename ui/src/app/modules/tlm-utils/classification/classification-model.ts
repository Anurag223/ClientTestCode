// Define new generic Classification structure
// TBD
export interface IClassificationAPIResponse {
    collection: IClassificationModel[];
    links: Links;
    meta: Meta;
}

export interface IClassificationModel {
  code: string;
  level: string;
  name: string;
  segments: Segment[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}


export interface Segment {
  code: string;
  level: string;
  name: string;
  parentCode: string;
  subsegments: Subsegment[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface Subsegment {
  code: string;
  level: string;
  name: string;
  parentCode: string;
  productFamilies: ProductFamily[][];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface ProductFamily {
  code: string;
  level: string;
  name: string;
  parentCode: string;
  productLines: ProductLine[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface ProductLine {
  code: string;
  level: string;
  name: string;
  parentCode: string;
  brands: Brand[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface Brand {
  code: string;
  level: string;
  name: string;
  parentCode: string;
  equipments: (Child | Child | Child[] | Children4)[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
}

export interface Children4 {
  code: string;
  level: string;
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
  level: string;
  name: string;
  parentCode: string;
  children: any[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  id: string;
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
