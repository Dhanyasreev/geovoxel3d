export interface PropertyUnit {
  id: string;
  unitNumber: string; // e.g., "402", "PH-01", "B1-P1"
  buildingId: string;
  floorNumber: number; // -2 for B2, -1 for B1, 0 for Ground, 1-5, 6 for Penthouse
  floorName: string; // "Penthouse", "Floor 4", "Ground Floor", "Basement 1", etc.
  ownerName: string;
  surveyNumber: string;
  areaSqFt: number;
  areaSqM: number;
  landSharePercent: number;
  taxStatus: 'Paid' | 'Pending' | 'Exempt';
  propertyType: 'Residential' | 'Commercial' | 'Mixed Use' | 'Institutional' | 'Utility / Parking' | 'Penthouse Suite';
  verificationStatus: 'Verified' | 'Under Review' | 'Flagged';
  ulpin3D: string; // e.g., "28-502-14029384721-A-F04-U402" or "28-502-14029384721-A-PH-U01"
  heightAboveGroundM: number;
  ceilingHeightM: number;
  groundElevationM?: number; // e.g. +542.3 m MSL
  floorElevationM?: number; // e.g. +12.5 m
  hasConflict?: boolean;
  conflictDetails?: {
    issue: string;
    affectedAreaSqFt: number;
    affectedBoundary: string;
    status: string;
    confidence: number;
  };
  rooms: string;
  registrationDate: string;
  lastMutationId?: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
    width: number;
    depth: number;
    height: number;
  };
}

export interface BuildingFloor {
  floorNumber: number;
  name: string; // "Ground Floor", "Floor 1", ...
  elevationM: number;
  heightM: number;
  unitCount: number;
  units: PropertyUnit[];
}

export interface CadastralBuilding {
  id: string;
  name: string; // "Building A"
  surveyNumber: string;
  totalFloors: number;
  totalUnits: number;
  buildingType: 'Multi-Story Residential' | 'Commercial Complex' | 'Mixed Use' | 'Individual House';
  builtYear: number;
  fsiApproved: number;
  fsiConsumed: number;
  structureHeightM: number;
  floors: BuildingFloor[];
  position: { x: number; z: number };
  dimensions: { width: number; depth: number };
  roofType: 'Terrace' | 'Sloped';
}

export interface LandParcel {
  id: string;
  surveyNumber: string; // "42/B"
  village: string;
  taluka: string;
  district: string;
  state: string;
  areaHectares: number;
  areaSqMeters: number;
  boundaryCoordinates: [number, number][]; // 2D polygon vertices [x, z]
  color: string;
  ownerName: string;
  landUse: 'Residential Urban' | 'Commercial' | 'Public Utility';
  status: 'Clear Title' | 'Encroachment Conflict' | 'Under Survey';
  buildingIds: string[];
}

export interface UndergroundUtility {
  id: string;
  type: 'Water Pipeline' | 'Power Cable' | 'Drainage Sewer' | 'Optical Fiber';
  utilityCode: string; // "UTL-2042"
  depthM: number;
  diameterMm: number;
  material: string;
  status: 'Active' | 'Maintenance' | 'Planned';
  flowDirection: 'Bi-directional' | 'South-North' | 'East-West';
  lastInspected: string;
  points: [number, number, number][]; // [x, y, z] in 3D coordinates (y is negative)
  color: string;
}

export interface EncroachmentRecord {
  id: string;
  flatNumber?: string; // "Flat 402" or "Bungalow 46/A"
  buildingId?: string; // "bldg-a", "bldg-house-1", "bldg-house-2"
  buildingName: string; // "Building A", "Bungalow 46/A"
  floorNumber?: number; // 4 or 0
  floorName?: string; // "Floor 4" or "Ground Level"
  primaryParcel: string; // "Survey 42/B"
  conflictingParcel: string; // "Survey 42/C" or "Public Road RoW" or "Open Reserve"
  status: 'Potential 3D Boundary Conflict' | 'Under Review' | 'Resolved' | 'Under Adjudication' | 'Road Encroachment Violation' | 'Boundary Transgression';
  affectedAreaSqFt: number; // 18.4
  affectedAreaSqM: number; // 1.71
  affectedBoundary: 'North-East' | 'South-West' | 'Northern Edge' | 'Road Right-of-Way (Frontage)' | 'Eastern Property Line';
  affectedSide: string; // "North-East" or "Road Carriageway & Footpath"
  confidenceScore: number; // 92
  detectedDate: string;
  surveyMethod: string;
  summary: string;
  legalActReference?: string; // "Sec 231 Municipal Corporation Act"
  overlapPolygon: [number, number][]; // [x, z] coordinates for visual overlay in 3D
}

export interface PropertyHistoryEvent {
  year: string;
  date: string;
  title: string;
  description: string;
  authority: string;
  documentRef?: string;
  type: 'Registration' | 'Floor Addition' | 'Mutation' | 'Verification' | 'Tax Assessment';
}

export interface MutationRecord {
  mutationNumber: string; // "MUT-2026-042"
  status: 'Verified' | 'Pending' | 'Approved by Tahsildar';
  previousOwner: string;
  newOwner: string;
  date: string;
  reason: 'Property Transfer' | 'Inheritance' | 'Gift Deed' | 'Partition';
  surveyNumber: string;
  unitNumber?: string;
  documents: {
    name: string;
    type: string;
    fileSize: string;
    refNo: string;
  }[];
  notingOfficer: string;
}

export interface BuildingElevator {
  id: string; // 'elev-e01', 'elev-e02'
  code: string; // 'E-01', 'E-02'
  name: string; // 'Elevator E-01', 'Elevator E-02'
  buildingId: string; // 'bldg-a'
  buildingName: string; // 'Building A'
  type: 'Passenger Elevator' | 'Service Elevator';
  serves: string; // 'Basement 2 → Penthouse'
  currentLevel: string; // 'Floor 3'
  status: 'Operational' | 'Maintenance' | 'Inspection Due';
  capacity: string; // '8 persons (680 kg)'
  speed: string; // '1.75 m/s'
  manufacturer: string; // 'Schindler 5500 Smart Core'
  lastInspection: string; // '14-Aug-2026'
  shaftDimensions: { width: number; depth: number; height: number };
  position: { x: number; z: number };
}

export interface BuildingUtilityRiser {
  id: string; // 'W-01', 'D-01', 'ELC-01', 'F-01'
  utilityType: 'Water Pipeline' | 'Drainage Pipeline' | 'Electrical Conduit' | 'Fiber/Telecom Conduit';
  name: string; // 'Main Potable Water Riser (W-01)'
  buildingId: string; // 'bldg-a'
  buildingName: string; // 'Building A'
  route: string; // 'Basement 2 → Floor 5'
  depthM: number;
  diameterMm: number;
  material: string;
  status: 'Active' | 'Maintenance' | 'Planned';
  color: string;
  connectionPoint: string;
  lastInspected: string;
  layerKey: 'waterPipeline' | 'drainagePipeline' | 'electricalNetwork' | 'fiberNetwork';
  coordinates: { x: number; z: number };
}

