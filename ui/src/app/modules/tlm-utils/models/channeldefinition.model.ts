/* Schlumberger Private 
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */

export interface channeldefinition { 
    equipmentCodes: string[],
    code: string,
    dimension:string,
    uom:string,
    legalClassification:string,
    type:string,
    name:string
}

export interface channelAndEquipmentCode {
    equipmentCode: string,
    channelCode: string,
}

export interface channelsPerEquipmentCode{
    channelCodes: string[];
    equipmentCode: string
}

