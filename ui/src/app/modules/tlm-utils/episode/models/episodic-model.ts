

export interface EpisodicMeta {
    equipmentWKEid: string;
    serialNumber: string;
    equipmentCode: string;
    periodStartTime: Date;
    periodEndTime: Date;
    channels: Channel[];
    rows: any[];
}
export interface Channel {
    code: string;
    dimension: string;
    uom: string;
}
export interface eMOTPoint {
    timestamp: Date;
    episodeId: string;
    eMotValue: string;
}

