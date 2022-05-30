export interface EqRegistryPayload {
    wkeId: string,
    description: string,
    serialNumber: string,
    equipmentCode: string,
    materialNumber: string
}
export interface EqRegistryResponse {
    description: string,
    serialNumber: string,
    equipmentCode: string,
    materialNumber: string,
    wkeId: string,
    id
}