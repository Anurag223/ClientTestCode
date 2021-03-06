'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.iequpimentDemandOrderMock = {
  edoNumber: 'ER:EDO:EDPID:18CCO1913-0600-0-0:ID:7696113',
  isChecked: false,
  name: 'Collar HDS1 475',
  description: '',
  status: 'Submitted',
  requestedEquipmentProductLine: 'DMHV Measurements While Drilling',
  requestedEquipmentBrand: 'DMHV HDS1',
  requestedEquipmentCode: 'Collar HDS1 475',
  productGroupId: 82,
  productLineId: 5,
  redirectedNumber: null,
  nextMovementDate: new Date(),
  redirectedFromSite: 'CCO',
  redirectedToSite: 'CCOEXTR',
  troNumber: 'aadf',
  redirectedType: 'Ship to Job',
  fsmToolName: 4578014,
  maintenanceToolName: 7428621,
  movementDate: new Date(),
  submittedDate: new Date(),
  comments: [
    {
      id: 123,
      parentCommentId: 567,
      commentText: 'sdfa',
      addedBy: 'asdf',
      dateAdded: new Date(),
    },
  ],
  equipmentDemandFulFillment: {
    equipment: {
      equipmentCode: '777-10191',
      serialNumber: 'D47C599',
      status: 'On Location',
      links: {
        href: 'api/v1/equipments/EQ:MAT:777-10191:SN:D47C599',
        rel: 'edf/equipments',
        type: 'GET',
      },
      createdDate: new Date(),
      createdBy: '',
      modifiedDate: new Date(),
      modifiedBy: '',
      activeCMMS: 'asdf',
      sourceSystemId: 'asdf',
      sourceRecordId: 'adsf',
    },
    edoSourceSystem: 'asdfsdf',
    fulFillmentDate: new Date(),
    fulFillmentSiteCode: 'asdf',
    pcv: 'tyu',
    movement: {
      movementType: '',
      shipmentNumber: '',
      shipmentDate: new Date(),
      links: {
        href: '',
        rel: '',
        type: '',
      },
    },
    comments: [
      {
        id: 123,
        parentCommentId: 567,
        commentText: 'sdfa',
        addedBy: 'asdf',
        dateAdded: new Date(),
      },
    ],
    createdDate: new Date(),
    createdBy: 'hutye',
    modifiedDate: new Date(),
    modifiedBy: 'asdf',
    activeCMMS: 'uyie',
    sourceSystemId: 'ger',
    sourceRecordId: 'asdff',
  },
  attributes: [
    {
      name: '',
      value: '',
      dimension: '',
      unitOfMeasure: '',
      mandatoryFlag: false,
      status: '',
    },
  ],
  createdDate: new Date(),
  createdBy: 'JMill2',
  modifiedDate: new Date(),
  modifiedBy: 'JMill2',
  activeCMMS: 'QTRAC',
  sourceSystemId: 'QTRAC',
  sourceRecordId: '7428621',
  edoComment: '',
};
exports.equipMentRequestObj = {
  demandPlanId: '18CCO1015-1225-0-1',
  systemRecordId: 1,
  edpComments: 'abcf',
  siteName: 'CCO',
  jobRunStageKey: null,
  plannedEndDate: new Date(),
  targetFullFillmentDate: new Date(),
  tlmShipDate: new Date(),
  version: '0C-2T-0D',
  status: 'Partially Redirected',
  job: {
    client: 'WOLVERINE EXPLORATION',
    rig: 'CAPSTAR DRILLING #330',
    well: 'Wolverine Federal 17-17',
    jobNumber: '18CCO1015',
    links: null,
    jobStatus: 'Planned',
    deliveryManager: {
      ldap: 'MSchaaf',
      name: 'Matthew Vander Schaaf',
    },
    directionDriller: {
      ldap: 'MSchaaf',
      name: 'Matthew Vander Schaaf',
    },
    drillerEngineer: {
      ldap: 'MSchaaf',
      name: 'Matthew Vander Schaaf',
    },
    measurementDriller: 'Eastern Hemisphere-EUR-CC-Vincent Barbier',
    wellSite: 'CCO',
  },
  jobRunStage: {
    id: 1,
    parentJobId: 1,
    sequenceNumber: 1,
  },
  comments: '',
  attributes: [
    {
      name: 'Max BH Static Temp',
      value: '355.37',
      dimension: 'Temperature',
      unitOfMeasure: 'C',
      mandatoryFlag: true,
      status: 'Active',
    },
  ],
  createdDate: new Date(),
  createdBy: 'NDelashmutt',
  modifiedDate: new Date(),
  modifiedBy: 'NDelashmutt',
  activeCMMS: 'QTRAC',
  sourceSystemId: 'QTRAC',
  sourceRecordId: '7428621',
  equipmentDemandOrders: [exports.iequpimentDemandOrderMock],
  epicSummaries: [
    {
      epicKey: 'Rentals',
      equipmentCount: '1',
      status: 'Redirected',
      createdBy: 'NDelashmutt',
      modifiedBy: 'NDelashmutt',
      createdDate: new Date(),
      modifiedDate: new Date(),
      level: 5,
      id: 13,
    },
  ],
};
//# sourceMappingURL=activitymonitordatamock.spec.js.map
