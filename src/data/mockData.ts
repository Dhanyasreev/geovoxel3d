import {
  LandParcel,
  CadastralBuilding,
  PropertyUnit,
  UndergroundUtility,
  EncroachmentRecord,
  PropertyHistoryEvent,
  MutationRecord,
  BuildingElevator,
  BuildingUtilityRiser,
} from '../types/gis';

// Helper to generate realistic 3D-ULPIN
export function generateULPIN(
  stateCode = '28',
  districtCode = '502',
  parcelId = '14029384721',
  building = 'A',
  floor = 4,
  unit = '402'
): string {
  let fStr = `F0${floor}`;
  if (floor === 6) fStr = 'PH';
  else if (floor === 0) fStr = 'G00';
  else if (floor === -1) fStr = 'B01';
  else if (floor === -2) fStr = 'B02';

  const uStr = unit.startsWith('U') || unit.startsWith('PH') ? unit : `U${unit}`;
  return `${stateCode}-${districtCode}-${parcelId}-${building}-${fStr}-${uStr}`;
}

// -------------------------------------------------------------
// 1. COMMUNITY LAND PARCELS
// Parcels corresponding to the 6 community blocks
// -------------------------------------------------------------
export const mockParcels: LandParcel[] = [
  {
    id: 'parcel-a',
    surveyNumber: 'Block-A / 42B',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.18,
    areaSqMeters: 1800,
    boundaryCoordinates: [
      [-42, -58],
      [-14, -58],
      [-14, -32],
      [-42, -32],
    ],
    color: '#F8FAFC',
    ownerName: 'Apex Co-operative Housing Society Ltd.',
    landUse: 'Residential Urban',
    status: 'Encroachment Conflict', // Conflict parcel on Flat 402
    buildingIds: ['bldg-a'],
  },
  {
    id: 'parcel-b',
    surveyNumber: 'Block-B / 42C',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.20,
    areaSqMeters: 2000,
    boundaryCoordinates: [
      [14, -58],
      [42, -58],
      [42, -32],
      [14, -32],
    ],
    color: '#F8FAFC',
    ownerName: 'Vardhaman Commercial Estates Ltd.',
    landUse: 'Commercial',
    status: 'Clear Title',
    buildingIds: ['bldg-b'],
  },
  {
    id: 'parcel-c',
    surveyNumber: 'Block-C / 43A',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.18,
    areaSqMeters: 1800,
    boundaryCoordinates: [
      [-42, -13],
      [-14, -13],
      [-14, 13],
      [-42, 13],
    ],
    color: '#F8FAFC',
    ownerName: 'Sahyadri Housing Trust',
    landUse: 'Residential Urban',
    status: 'Clear Title',
    buildingIds: ['bldg-c'],
  },
  {
    id: 'parcel-d',
    surveyNumber: 'Block-D / 43B',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.18,
    areaSqMeters: 1800,
    boundaryCoordinates: [
      [14, -13],
      [42, -13],
      [42, 13],
      [14, 13],
    ],
    color: '#F8FAFC',
    ownerName: 'Mayur Infra Tech Ltd.',
    landUse: 'Commercial',
    status: 'Clear Title',
    buildingIds: ['bldg-d'],
  },
  {
    id: 'parcel-e',
    surveyNumber: 'Block-E / 44A',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.16,
    areaSqMeters: 1600,
    boundaryCoordinates: [
      [-42, 32],
      [-14, 32],
      [-14, 58],
      [-42, 58],
    ],
    color: '#F8FAFC',
    ownerName: 'Kalyani Heritage Residential Society',
    landUse: 'Residential Urban',
    status: 'Clear Title',
    buildingIds: ['bldg-e'],
  },
  {
    id: 'parcel-f',
    surveyNumber: 'Block-F / 44B',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.16,
    areaSqMeters: 1600,
    boundaryCoordinates: [
      [14, 32],
      [42, 32],
      [42, 58],
      [14, 58],
    ],
    color: '#F8FAFC',
    ownerName: 'Shivaji Enclave Housing Society',
    landUse: 'Residential Urban',
    status: 'Clear Title',
    buildingIds: ['bldg-f'],
  },
  {
    id: 'parcel-vacant',
    surveyNumber: 'Plot-45/Open',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.22,
    areaSqMeters: 2200,
    boundaryCoordinates: [
      [52, -13],
      [82, -13],
      [82, 13],
      [52, 13],
    ],
    color: '#FEF3C7', // Distinct warm open land tint
    ownerName: 'Revenue & Land Records Dept. (State Government)',
    landUse: 'Public Utility',
    status: 'Clear Title',
    buildingIds: [], // Empty parcel — No building constructed!
  },
  {
    id: 'parcel-house-1',
    surveyNumber: 'Plot-46/A',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.052,
    areaSqMeters: 520,
    boundaryCoordinates: [
      [-74, -48],
      [-52, -48],
      [-52, -28],
      [-74, -28],
    ],
    color: '#FEF2F2', // Light red conflict indicator
    ownerName: 'Rakesh Sharma & Ananya Sharma',
    landUse: 'Residential Urban',
    status: 'Encroachment Conflict', // Road Encroachment Error
    buildingIds: ['bldg-house-1'],
  },
  {
    id: 'parcel-house-2',
    surveyNumber: 'Plot-47/B',
    village: 'Viman Nagar (North)',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaHectares: 0.055,
    areaSqMeters: 550,
    boundaryCoordinates: [
      [54, 20],
      [74, 20],
      [74, 44],
      [54, 44],
    ],
    color: '#FEF2F2', // Light red conflict indicator
    ownerName: 'Dr. Sunita Deshmukh & Rajesh Deshmukh',
    landUse: 'Residential Urban',
    status: 'Encroachment Conflict', // Boundary Transgression
    buildingIds: ['bldg-house-2'],
  },
];

// -------------------------------------------------------------
// 2. COMPLETE VERTICAL HIERARCHY FOR MAIN BUILDING A:
// Penthouse (Floor 6, +18.5m)
// Floor 5 (+15.5m)
// Floor 4 (+12.5m) - Flat 402 with boundary conflict
// Floor 3 (+9.5m)
// Floor 2 (+6.5m)
// Floor 1 (+3.5m)
// Ground Floor (0.0m)
// Basement 1 (-3.0m)
// Basement 2 (-6.0m)
// -------------------------------------------------------------
export const buildingAFloors = [
  { floorNum: 6, name: 'Penthouse', elev: 18.5, height: 3.2, isBasement: false, isPenthouse: true },
  { floorNum: 5, name: 'Floor 5', elev: 15.5, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: 4, name: 'Floor 4', elev: 12.5, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: 3, name: 'Floor 3', elev: 9.5, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: 2, name: 'Floor 2', elev: 6.5, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: 1, name: 'Floor 1', elev: 3.5, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: 0, name: 'Ground Floor', elev: 0.0, height: 2.9, isBasement: false, isPenthouse: false },
  { floorNum: -1, name: 'Basement 1', elev: -3.0, height: 3.0, isBasement: true, isPenthouse: false },
  { floorNum: -2, name: 'Basement 2', elev: -6.0, height: 3.0, isBasement: true, isPenthouse: false },
];

export const mockBuildingAUnits: PropertyUnit[] = [];

// A. Penthouse Level (PH-01)
mockBuildingAUnits.push({
  id: 'unit-a-ph-01',
  unitNumber: 'PH-01',
  buildingId: 'bldg-a',
  floorNumber: 6,
  floorName: 'Penthouse',
  ownerName: 'Dr. Vikram Sarabhai Trust / K. R. Narayan',
  surveyNumber: '42/B',
  areaSqFt: 1850,
  areaSqM: 171.9,
  landSharePercent: 4.8,
  taxStatus: 'Paid',
  propertyType: 'Penthouse Suite',
  verificationStatus: 'Verified',
  ulpin3D: '28-502-14029384721-A-PH-U01',
  heightAboveGroundM: 18.5,
  ceilingHeightM: 3.2,
  groundElevationM: 542.3,
  floorElevationM: 18.5,
  hasConflict: false,
  rooms: '4 BHK Luxury Sky Penthouse (Terrace Deck, Sky Jacuzzi, Private Foyer)',
  registrationDate: '12-Jan-2024',
  coordinates: {
    x: -6,
    y: 18.5 + 1.6,
    z: -6,
    width: 14,
    depth: 14,
    height: 3.2,
  },
});

// B. Residential Floors (Floor 1 through 5, and Ground Floor with max 2 flats)
const mockOwnersFloor4 = [
  { unit: '401', owner: 'Vikramaditya Rao', area: 1180, tax: 'Paid' as const, conflict: false },
  { unit: '402', owner: 'Ramesh Kumar', area: 1250, tax: 'Paid' as const, conflict: true }, // The ONLY conflict!
  { unit: '403', owner: 'Sunita Mehra', area: 1250, tax: 'Paid' as const, conflict: false },
  { unit: '404', owner: 'Praveen Choksi', area: 1180, tax: 'Pending' as const, conflict: false },
];

[0, 1, 2, 3, 4, 5].forEach((floorNum) => {
  const fMeta = buildingAFloors.find((f) => f.floorNum === floorNum)!;
  // Ground floor has strictly only 2 flats (G01 & G02); remaining area is Entrance Lobby & Reception
  const floorUnits =
    floorNum === 0
      ? [
          { num: 'G01', offX: -4.5, offZ: -4.5, w: 8, d: 8, name: 'Ground Garden Suite 1' },
          { num: 'G02', offX: 4.5, offZ: -4.5, w: 8, d: 8, name: 'Ground Garden Suite 2' },
        ]
      : [
          { num: `${floorNum}01`, offX: -4.5, offZ: -4.5, w: 8, d: 8, name: '' },
          { num: `${floorNum}02`, offX: 4.5, offZ: -4.5, w: 8, d: 8, name: '' }, // 402 is here (North-East quadrant)
          { num: `${floorNum}03`, offX: -4.5, offZ: 4.5, w: 8, d: 8, name: '' },
          { num: `${floorNum}04`, offX: 4.5, offZ: 4.5, w: 8, d: 8, name: '' },
        ];

  floorUnits.forEach((uInfo, idx) => {
    let owner = `Resident ${uInfo.num}`;
    let area = 1200;
    let tax: 'Paid' | 'Pending' = 'Paid';
    let status: 'Verified' | 'Under Review' = 'Verified';
    let isConflict = false;

    if (floorNum === 4) {
      owner = mockOwnersFloor4[idx].owner;
      area = mockOwnersFloor4[idx].area;
      tax = mockOwnersFloor4[idx].tax;
      if (mockOwnersFloor4[idx].conflict) {
        isConflict = true;
        status = 'Under Review';
      }
    } else if (floorNum === 0) {
      owner = idx === 0 ? 'Dr. Ananya Deshmukh' : 'Kishore & Mala Singhania';
      area = 1150;
      tax = 'Paid';
    } else if (floorNum === 1) {
      owner = ['Amit Shah', 'Pooja Hegde', 'Naveen Jindal', 'Deepa Nair'][idx];
    } else if (floorNum === 2) {
      owner = ['Kavita Patil', 'Rajesh Joshi', 'Manish Sisodia', 'Arun Varma'][idx];
    } else if (floorNum === 3) {
      owner = ['Sanjay Dutt', 'Meenakshi Iyer', 'Tanvi Parekh', 'Karan Johar'][idx];
    } else if (floorNum === 5) {
      owner = ['Rohit Sharma', 'Priya Kulkarni', 'Aditya Birla', 'Geeta Sen'][idx];
    }

    const unit: PropertyUnit = {
      id: `unit-a-${floorNum}-${uInfo.num}`,
      unitNumber: uInfo.num,
      buildingId: 'bldg-a',
      floorNumber: floorNum,
      floorName: fMeta.name,
      ownerName: owner,
      surveyNumber: '42/B',
      areaSqFt: area,
      areaSqM: Math.round(area * 0.092903 * 10) / 10,
      landSharePercent: floorNum === 0 ? 3.1 : 2.4,
      taxStatus: tax,
      propertyType: 'Residential',
      verificationStatus: status,
      ulpin3D: generateULPIN('28', '502', '14029384721', 'A', floorNum, uInfo.num),
      heightAboveGroundM: fMeta.elev,
      ceilingHeightM: 2.9,
      groundElevationM: 542.3,
      floorElevationM: fMeta.elev,
      hasConflict: isConflict,
      conflictDetails: isConflict
        ? {
            issue: '3D Cadastral Encroachment: +1.6m Cantilever Overhang',
            affectedAreaSqFt: 18.4,
            affectedBoundary: 'North-East parcel setback boundary line',
            status: 'Under Review',
            confidence: 96,
          }
        : undefined,
      rooms: floorNum === 0 ? '2.5 BHK Garden Residence with Private Veranda' : '3 BHK (Living, 3 Bed, Kitchen, 2 Balconies)',
      registrationDate: floorNum === 5 ? '14-Nov-2023' : '18-Aug-2021',
      coordinates: {
        x: -6 + uInfo.offX,
        y: fMeta.elev + 1.45,
        z: -6 + uInfo.offZ,
        width: uInfo.w,
        depth: uInfo.d,
        height: 2.9,
      },
    };

    mockBuildingAUnits.push(unit);
  });
});

// C. Basement 1 Infrastructure (-3.0m) - Strictly Parking, Stairs, Substation & Generators
const b1Spaces = [
  { code: 'B1-PARK', name: 'Designated Resident Parking Bays (Slots 01-14)', area: 1350, type: 'Parking', offX: -4.5, offZ: 0, w: 8.5, d: 17 },
  { code: 'B1-ELEC', name: 'Main 11kV Substation & Power Distribution Panels', area: 360, type: 'Electrical Room', offX: 5.0, offZ: -4.5, w: 7.5, d: 8 },
  { code: 'B1-STAIR', name: 'Reinforced Fire Exit Stairwell Core A', area: 240, type: 'Stairwell', offX: 0, offZ: -5.0, w: 5.0, d: 5.0 },
  { code: 'B1-GEN', name: 'Standby Emergency DG Generator Set (500 kVA Silent)', area: 420, type: 'Generator Room', offX: 5.0, offZ: 4.5, w: 7.5, d: 8 },
];

b1Spaces.forEach((s) => {
  mockBuildingAUnits.push({
    id: `unit-a-b1-${s.code}`,
    unitNumber: s.code,
    buildingId: 'bldg-a',
    floorNumber: -1,
    floorName: 'Basement 1',
    ownerName: 'Apex CHS Common Infrastructure',
    surveyNumber: '42/B',
    areaSqFt: s.area,
    areaSqM: Math.round(s.area * 0.092903 * 10) / 10,
    landSharePercent: 0,
    taxStatus: 'Exempt',
    propertyType: 'Utility / Parking',
    verificationStatus: 'Verified',
    ulpin3D: generateULPIN('28', '502', '14029384721', 'A', -1, s.code),
    heightAboveGroundM: -3.0,
    ceilingHeightM: 3.0,
    groundElevationM: 542.3,
    floorElevationM: -3.0,
    rooms: s.name,
    registrationDate: '18-Aug-2021',
    coordinates: {
      x: -6 + s.offX,
      y: -3.0 + 1.5,
      z: -6 + s.offZ,
      width: s.w,
      depth: s.d,
      height: 3.0,
    },
  });
});

// D. Basement 2 Infrastructure (-6.0m) - Strictly Visitor Parking, Fire Sump & Booster Pumps
const b2Spaces = [
  { code: 'B2-PARK', name: 'Visitor Parking Bays & EV Rapid Charging Stations', area: 1400, type: 'Parking', offX: -4.5, offZ: 0, w: 8.5, d: 17 },
  { code: 'B2-PUMP', name: 'Hydro-Pneumatic Booster Pumps & 100,000L Fire Sump', area: 450, type: 'Pump Room', offX: 5.0, offZ: -4.5, w: 7.5, d: 8 },
  { code: 'B2-STAIR', name: 'Subterranean Emergency Stairwell Core B', area: 240, type: 'Stairwell', offX: 0, offZ: -5.0, w: 5.0, d: 5.0 },
  { code: 'B2-AUXGEN', name: 'Auxiliary DG Generator Fuel Day Tank & Exhaust Silencer', area: 380, type: 'Generator Auxiliary', offX: 5.0, offZ: 4.5, w: 7.5, d: 8 },
];

b2Spaces.forEach((s) => {
  mockBuildingAUnits.push({
    id: `unit-a-b2-${s.code}`,
    unitNumber: s.code,
    buildingId: 'bldg-a',
    floorNumber: -2,
    floorName: 'Basement 2',
    ownerName: 'Apex CHS Common Infrastructure',
    surveyNumber: '42/B',
    areaSqFt: s.area,
    areaSqM: Math.round(s.area * 0.092903 * 10) / 10,
    landSharePercent: 0,
    taxStatus: 'Exempt',
    propertyType: 'Utility / Parking',
    verificationStatus: 'Verified',
    ulpin3D: generateULPIN('28', '502', '14029384721', 'A', -2, s.code),
    heightAboveGroundM: -6.0,
    ceilingHeightM: 3.0,
    groundElevationM: 542.3,
    floorElevationM: -6.0,
    rooms: s.name,
    registrationDate: '18-Aug-2021',
    coordinates: {
      x: -6 + s.offX,
      y: -6.0 + 1.5,
      z: -6 + s.offZ,
      width: s.w,
      depth: s.d,
      height: 3.0,
    },
  });
});

// -------------------------------------------------------------
// 3. BUILDINGS IN THE NEIGHBORHOOD
// Building A (detailed) + Buildings B, C, D, E (simplified)
// -------------------------------------------------------------
export const mockBuildings: CadastralBuilding[] = [
  {
    id: 'bldg-a',
    name: 'Building A (Apex Residency)',
    surveyNumber: '42/B',
    totalFloors: 9, // Penthouse + 5 Floors + Ground + 2 Basements
    totalUnits: 31, // 1 Penthouse + 24 Residential + 3 B1 + 3 B2
    buildingType: 'Multi-Story Residential',
    builtYear: 2021,
    fsiApproved: 2.2,
    fsiConsumed: 2.18,
    structureHeightM: 22.0,
    position: { x: -28, z: -45 },
    dimensions: { width: 19, depth: 19 },
    roofType: 'Terrace',
    floors: buildingAFloors.map((f) => ({
      floorNumber: f.floorNum,
      name: f.name,
      elevationM: f.elev,
      heightM: f.height,
      unitCount: mockBuildingAUnits.filter((u) => u.floorNumber === f.floorNum).length,
      units: mockBuildingAUnits.filter((u) => u.floorNumber === f.floorNum),
    })),
  },
  {
    id: 'bldg-b',
    name: 'Block B',
    surveyNumber: 'Block-B / 42C',
    totalFloors: 5,
    totalUnits: 15,
    buildingType: 'Commercial Complex',
    builtYear: 2022,
    fsiApproved: 2.5,
    fsiConsumed: 2.45,
    structureHeightM: 16.0,
    position: { x: 28, z: -45 },
    dimensions: { width: 20, depth: 18 },
    roofType: 'Terrace',
    floors: [0, 1, 2, 3, 4].map((fl) => ({
      floorNumber: fl,
      name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
      elevationM: fl * 3.2,
      heightM: 3.0,
      unitCount: fl === 0 ? 2 : 3,
      units: (fl === 0 ? [1, 2] : [1, 2, 3]).map((u) => ({
        id: `unit-b-${fl}-${u}`,
        unitNumber: fl === 0 ? `B-G0${u}` : `B-${fl}0${u}`,
        buildingId: 'bldg-b',
        floorNumber: fl,
        floorName: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
        ownerName: `Commercial Tenant ${fl === 0 ? 'G' : fl}0${u}`,
        surveyNumber: 'Block-B / 42C',
        areaSqFt: 980,
        areaSqM: 91.0,
        landSharePercent: fl === 0 ? 8.5 : 6.5,
        taxStatus: 'Paid' as const,
        propertyType: 'Commercial' as const,
        verificationStatus: 'Verified' as const,
        ulpin3D: generateULPIN('28', '502', '14029384722', 'B', fl, fl === 0 ? `B-G0${u}` : `B-${fl}0${u}`),
        heightAboveGroundM: fl * 3.2,
        ceilingHeightM: 3.0,
        groundElevationM: 542.3,
        floorElevationM: fl * 3.2,
        hasConflict: false,
        rooms: 'Commercial Office Suite',
        registrationDate: '15-Mar-2022',
        coordinates: { x: 28, y: fl * 3.2 + 1.5, z: -45, width: 20, depth: 18, height: 3.0 },
      })),
    })),
  },
  {
    id: 'bldg-c',
    name: 'Block C',
    surveyNumber: 'Block-C / 43A',
    totalFloors: 5,
    totalUnits: 14,
    buildingType: 'Multi-Story Residential',
    builtYear: 2020,
    fsiApproved: 2.0,
    fsiConsumed: 1.95,
    structureHeightM: 16.0,
    position: { x: -28, z: 0 },
    dimensions: { width: 19, depth: 18 },
    roofType: 'Terrace',
    floors: [0, 1, 2, 3, 4].map((fl) => ({
      floorNumber: fl,
      name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
      elevationM: fl * 3.2,
      heightM: 3.0,
      unitCount: fl === 0 ? 2 : 3,
      units: (fl === 0 ? [1, 2] : [1, 2, 3]).map((u) => ({
        id: `unit-c-${fl}-${u}`,
        unitNumber: fl === 0 ? `C-G0${u}` : `C-${fl}0${u}`,
        buildingId: 'bldg-c',
        floorNumber: fl,
        floorName: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
        ownerName: `Resident ${fl === 0 ? 'C-G0' : `C-${fl}0`}${u}`,
        surveyNumber: 'Block-C / 43A',
        areaSqFt: 1050,
        areaSqM: 97.5,
        landSharePercent: fl === 0 ? 8.2 : 6.6,
        taxStatus: 'Paid' as const,
        propertyType: 'Residential' as const,
        verificationStatus: 'Verified' as const,
        ulpin3D: generateULPIN('28', '502', '14029384723', 'C', fl, fl === 0 ? `C-G0${u}` : `C-${fl}0${u}`),
        heightAboveGroundM: fl * 3.2,
        ceilingHeightM: 3.0,
        groundElevationM: 542.3,
        floorElevationM: fl * 3.2,
        hasConflict: false,
        rooms: '2 BHK Residential Flat',
        registrationDate: '20-Oct-2020',
        coordinates: { x: -28, y: fl * 3.2 + 1.5, z: 0, width: 19, depth: 18, height: 3.0 },
      })),
    })),
  },
  {
    id: 'bldg-d',
    name: 'Block D',
    surveyNumber: 'Block-D / 43B',
    totalFloors: 5,
    totalUnits: 14,
    buildingType: 'Commercial Complex',
    builtYear: 2023,
    fsiApproved: 2.6,
    fsiConsumed: 2.52,
    structureHeightM: 16.5,
    position: { x: 28, z: 0 },
    dimensions: { width: 20, depth: 18 },
    roofType: 'Terrace',
    floors: [0, 1, 2, 3, 4].map((fl) => ({
      floorNumber: fl,
      name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
      elevationM: fl * 3.3,
      heightM: 3.1,
      unitCount: fl === 0 ? 2 : 3,
      units: (fl === 0 ? [1, 2] : [1, 2, 3]).map((u) => ({
        id: `unit-d-${fl}-${u}`,
        unitNumber: fl === 0 ? `D-G0${u}` : `D-${fl}0${u}`,
        buildingId: 'bldg-d',
        floorNumber: fl,
        floorName: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
        ownerName: `Mayur Tenant ${fl === 0 ? 'G' : fl}0${u}`,
        surveyNumber: 'Block-D / 43B',
        areaSqFt: 1100,
        areaSqM: 102.2,
        landSharePercent: fl === 0 ? 8.5 : 6.6,
        taxStatus: 'Paid' as const,
        propertyType: 'Commercial' as const,
        verificationStatus: 'Verified' as const,
        ulpin3D: generateULPIN('28', '502', '14029384724', 'D', fl, fl === 0 ? `D-G0${u}` : `D-${fl}0${u}`),
        heightAboveGroundM: fl * 3.3,
        ceilingHeightM: 3.1,
        groundElevationM: 542.3,
        floorElevationM: fl * 3.3,
        hasConflict: false,
        rooms: 'Corporate Workspace Suite',
        registrationDate: '05-Jun-2023',
        coordinates: { x: 28, y: fl * 3.3 + 1.5, z: 0, width: 20, depth: 18, height: 3.1 },
      })),
    })),
  },
  {
    id: 'bldg-e',
    name: 'Block E',
    surveyNumber: 'Block-E / 44A',
    totalFloors: 4,
    totalUnits: 8,
    buildingType: 'Multi-Story Residential',
    builtYear: 2021,
    fsiApproved: 1.8,
    fsiConsumed: 1.72,
    structureHeightM: 13.0,
    position: { x: -28, z: 45 },
    dimensions: { width: 18, depth: 16 },
    roofType: 'Terrace',
    floors: [0, 1, 2, 3].map((fl) => ({
      floorNumber: fl,
      name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
      elevationM: fl * 3.2,
      heightM: 3.0,
      unitCount: 2,
      units: [1, 2].map((u) => ({
        id: `unit-e-${fl}-${u}`,
        unitNumber: `E-${fl}0${u}`,
        buildingId: 'bldg-e',
        floorNumber: fl,
        floorName: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
        ownerName: `Kalyani Resident ${fl}0${u}`,
        surveyNumber: 'Block-E / 44A',
        areaSqFt: 1200,
        areaSqM: 111.5,
        landSharePercent: 12.5,
        taxStatus: 'Paid' as const,
        propertyType: 'Residential' as const,
        verificationStatus: 'Verified' as const,
        ulpin3D: generateULPIN('28', '502', '14029384725', 'E', fl, `E-${fl}0${u}`),
        heightAboveGroundM: fl * 3.2,
        ceilingHeightM: 3.0,
        groundElevationM: 542.3,
        floorElevationM: fl * 3.2,
        hasConflict: false,
        rooms: '3 BHK Residential Flat',
        registrationDate: '11-Nov-2021',
        coordinates: { x: -28, y: fl * 3.2 + 1.5, z: 45, width: 18, depth: 16, height: 3.0 },
      })),
    })),
  },
  {
    id: 'bldg-f',
    name: 'Block F',
    surveyNumber: 'Block-F / 44B',
    totalFloors: 4,
    totalUnits: 8,
    buildingType: 'Multi-Story Residential',
    builtYear: 2022,
    fsiApproved: 1.8,
    fsiConsumed: 1.70,
    structureHeightM: 13.0,
    position: { x: 28, z: 45 },
    dimensions: { width: 18, depth: 16 },
    roofType: 'Terrace',
    floors: [0, 1, 2, 3].map((fl) => ({
      floorNumber: fl,
      name: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
      elevationM: fl * 3.2,
      heightM: 3.0,
      unitCount: 2,
      units: [1, 2].map((u) => ({
        id: `unit-f-${fl}-${u}`,
        unitNumber: `F-${fl}0${u}`,
        buildingId: 'bldg-f',
        floorNumber: fl,
        floorName: fl === 0 ? 'Ground Floor' : `Floor ${fl}`,
        ownerName: `Shivaji Resident ${fl}0${u}`,
        surveyNumber: 'Block-F / 44B',
        areaSqFt: 1180,
        areaSqM: 109.6,
        landSharePercent: 12.5,
        taxStatus: 'Paid' as const,
        propertyType: 'Residential' as const,
        verificationStatus: 'Verified' as const,
        ulpin3D: generateULPIN('28', '502', '14029384726', 'F', fl, `F-${fl}0${u}`),
        heightAboveGroundM: fl * 3.2,
        ceilingHeightM: 3.0,
        groundElevationM: 542.3,
        floorElevationM: fl * 3.2,
        hasConflict: false,
        rooms: '3 BHK Residential Flat',
        registrationDate: '08-Aug-2022',
        coordinates: { x: 28, y: fl * 3.2 + 1.5, z: 45, width: 18, depth: 16, height: 3.0 },
      })),
    })),
  },
  {
    id: 'bldg-house-1',
    name: 'Villa Ananda (Sharma Residence)',
    surveyNumber: 'Plot-46/A',
    totalFloors: 2, // Ground Floor + Floor 1 (No Basements, No Elevators)
    totalUnits: 2,
    buildingType: 'Individual House',
    builtYear: 2022,
    fsiApproved: 1.1,
    fsiConsumed: 1.34, // Excess due to road encroachment
    structureHeightM: 7.2,
    position: { x: -63, z: -37 },
    dimensions: { width: 16, depth: 16 },
    roofType: 'Sloped',
    floors: [
      {
        floorNumber: 0,
        name: 'Ground Floor',
        elevationM: 0.0,
        heightM: 3.4,
        unitCount: 1,
        units: [
          {
            id: 'unit-h1-g01',
            unitNumber: 'H1-G01',
            buildingId: 'bldg-house-1',
            floorNumber: 0,
            floorName: 'Ground Floor',
            ownerName: 'Rakesh Sharma & Ananya Sharma',
            surveyNumber: 'Plot-46/A',
            areaSqFt: 1650,
            areaSqM: 153.3,
            landSharePercent: 50.0,
            taxStatus: 'Paid' as const,
            propertyType: 'Residential' as const,
            verificationStatus: 'Under Review' as const,
            ulpin3D: generateULPIN('28', '502', '14029384731', 'H1', 0, 'H1-G01'),
            heightAboveGroundM: 0.0,
            ceilingHeightM: 3.4,
            groundElevationM: 542.3,
            floorElevationM: 0.0,
            hasConflict: true, // Road Encroachment Error!
            rooms: 'Independent 4 BHK Luxury Bungalow - Ground Suite (Drawing, Dining, Kitchen, Portico, Garden)',
            registrationDate: '15-Feb-2022',
            coordinates: { x: -63, y: 1.7, z: -37, width: 16, depth: 16, height: 3.4 },
          },
        ],
      },
      {
        floorNumber: 1,
        name: 'Floor 1',
        elevationM: 3.4,
        heightM: 3.4,
        unitCount: 1,
        units: [
          {
            id: 'unit-h1-101',
            unitNumber: 'H1-101',
            buildingId: 'bldg-house-1',
            floorNumber: 1,
            floorName: 'Floor 1',
            ownerName: 'Rakesh Sharma & Ananya Sharma',
            surveyNumber: 'Plot-46/A',
            areaSqFt: 1550,
            areaSqM: 144.0,
            landSharePercent: 50.0,
            taxStatus: 'Paid' as const,
            propertyType: 'Residential' as const,
            verificationStatus: 'Under Review' as const,
            ulpin3D: generateULPIN('28', '502', '14029384731', 'H1', 1, 'H1-101'),
            heightAboveGroundM: 3.4,
            ceilingHeightM: 3.4,
            groundElevationM: 542.3,
            floorElevationM: 3.4,
            hasConflict: true, // Road Encroachment Error!
            rooms: 'Bungalow Upper Floor (3 Master Bedrooms, Home Theatre, Terrace Deck)',
            registrationDate: '15-Feb-2022',
            coordinates: { x: -63, y: 5.1, z: -37, width: 16, depth: 16, height: 3.4 },
          },
        ],
      },
    ],
  },
  {
    id: 'bldg-house-2',
    name: 'Green Crest (Deshmukh Villa)',
    surveyNumber: 'Plot-47/B',
    totalFloors: 2, // Ground Floor + Floor 1 (No Basements, No Elevators)
    totalUnits: 2,
    buildingType: 'Individual House',
    builtYear: 2023,
    fsiApproved: 1.2,
    fsiConsumed: 1.38,
    structureHeightM: 7.2,
    position: { x: 64, z: 32 },
    dimensions: { width: 16, depth: 16 },
    roofType: 'Sloped',
    floors: [
      {
        floorNumber: 0,
        name: 'Ground Floor',
        elevationM: 0.0,
        heightM: 3.4,
        unitCount: 1,
        units: [
          {
            id: 'unit-h2-g01',
            unitNumber: 'H2-G01',
            buildingId: 'bldg-house-2',
            floorNumber: 0,
            floorName: 'Ground Floor',
            ownerName: 'Dr. Sunita Deshmukh & Rajesh Deshmukh',
            surveyNumber: 'Plot-47/B',
            areaSqFt: 1720,
            areaSqM: 159.8,
            landSharePercent: 50.0,
            taxStatus: 'Paid' as const,
            propertyType: 'Residential' as const,
            verificationStatus: 'Under Review' as const,
            ulpin3D: generateULPIN('28', '502', '14029384732', 'H2', 0, 'H2-G01'),
            heightAboveGroundM: 0.0,
            ceilingHeightM: 3.4,
            groundElevationM: 542.3,
            floorElevationM: 0.0,
            hasConflict: true, // Boundary Transgression!
            rooms: 'Independent 4 BHK Contemporary Villa - Ground Level (Lounge, Master Suite, Courtyard)',
            registrationDate: '10-May-2023',
            coordinates: { x: 64, y: 1.7, z: 32, width: 16, depth: 16, height: 3.4 },
          },
        ],
      },
      {
        floorNumber: 1,
        name: 'Floor 1',
        elevationM: 3.4,
        heightM: 3.4,
        unitCount: 1,
        units: [
          {
            id: 'unit-h2-101',
            unitNumber: 'H2-101',
            buildingId: 'bldg-house-2',
            floorNumber: 1,
            floorName: 'Floor 1',
            ownerName: 'Dr. Sunita Deshmukh & Rajesh Deshmukh',
            surveyNumber: 'Plot-47/B',
            areaSqFt: 1640,
            areaSqM: 152.4,
            landSharePercent: 50.0,
            taxStatus: 'Paid' as const,
            propertyType: 'Residential' as const,
            verificationStatus: 'Under Review' as const,
            ulpin3D: generateULPIN('28', '502', '14029384732', 'H2', 1, 'H2-101'),
            heightAboveGroundM: 3.4,
            ceilingHeightM: 3.4,
            groundElevationM: 542.3,
            floorElevationM: 3.4,
            hasConflict: true, // Boundary Transgression!
            rooms: 'Villa Upper Living Suite (Balconies, Guest Bedrooms, Study Room)',
            registrationDate: '10-May-2023',
            coordinates: { x: 64, y: 5.1, z: 32, width: 16, depth: 16, height: 3.4 },
          },
        ],
      },
    ],
  },
];

// Combine all units for quick lookup
export const allNeighborhoodUnits: PropertyUnit[] = [
  ...mockBuildingAUnits,
  ...mockBuildings.flatMap((b) => (b.id !== 'bldg-a' ? b.floors.flatMap((f) => f.units) : [])),
];

// -------------------------------------------------------------
// 4. UNDERGROUND PIPELINES & UTILITIES
// Realistic network below ground with specific depths:
// - Water Pipeline: Depth 2.4m (#0284C7)
// - Drainage Pipeline: Depth 3.2m (#78716C)
// - Electrical Network: Depth 1.8m (#D97706)
// - Fiber Network: Depth 1.2m (#7C3AED)
// -------------------------------------------------------------
export const mockUtilities: UndergroundUtility[] = [
  {
    id: 'utl-water',
    type: 'Water Pipeline',
    utilityCode: 'WTR-2042',
    depthM: 2.4,
    diameterMm: 300,
    material: 'Ductile Iron (Class K9)',
    status: 'Active',
    flowDirection: 'South-North',
    lastInspected: '14 Jan 2026',
    color: '#0284C7', // Blue
    points: [
      [-75, -2.4, 16],
      [-50, -2.4, 16],
      [-25, -2.4, 16],
      [0, -2.4, 16],
      [15, -2.4, 16],
      [38, -2.4, 16],
      [65, -2.4, 16],
      [90, -2.4, 16],
    ],
  },
  {
    id: 'utl-drainage',
    type: 'Drainage Sewer',
    utilityCode: 'DRN-1088',
    depthM: 3.2,
    diameterMm: 450,
    material: 'Reinforced Concrete Pipe (NP3)',
    status: 'Active',
    flowDirection: 'East-West',
    lastInspected: '28 Dec 2025',
    color: '#78716C', // Gray/Brown
    points: [
      [15, -3.2, -45],
      [15, -3.2, -20],
      [15, -3.2, 0],
      [15, -3.2, 16],
      [15, -3.2, 38],
      [15, -3.2, 60],
    ],
  },
  {
    id: 'utl-power',
    type: 'Power Cable',
    utilityCode: 'PWR-4109',
    depthM: 1.8,
    diameterMm: 120,
    material: '11kV XLPE Armoured Under-Slab',
    status: 'Active',
    flowDirection: 'Bi-directional',
    lastInspected: '02 Feb 2026',
    color: '#D97706', // Yellow/Amber
    points: [
      [-75, -1.8, -14],
      [-50, -1.8, -14],
      [-27, -1.8, -14],
      [-6, -1.8, -14],
      [15, -1.8, -14],
      [38, -1.8, -14],
      [65, -1.8, -14],
    ],
  },
  {
    id: 'utl-fiber',
    type: 'Optical Fiber',
    utilityCode: 'FBR-5921',
    depthM: 1.2,
    diameterMm: 80,
    material: 'HDPE 4-Way Microduct (96 Core)',
    status: 'Active',
    flowDirection: 'Bi-directional',
    lastInspected: '19 Jan 2026',
    color: '#7C3AED', // Purple
    points: [
      [-27, -1.2, -45],
      [-27, -1.2, -15],
      [-27, -1.2, 16],
      [-27, -1.2, 38],
      [-27, -1.2, 60],
    ],
  },
  // Dedicated Water Connection Branch for House 1 (Villa Ananda - Plot 46/A)
  {
    id: 'utl-water-h1',
    type: 'Water Pipeline',
    utilityCode: 'WTR-H1-01',
    depthM: 1.4,
    diameterMm: 50,
    material: 'CPVC High-Pressure Potable Pipe',
    status: 'Active',
    flowDirection: 'South-North',
    lastInspected: '12 Jan 2026',
    color: '#0284C7',
    points: [
      [-63, -1.4, -22.5],
      [-63, -1.4, -28.0],
      [-63, -1.4, -35.0],
    ],
  },
  // Dedicated Drainage Sewer Branch for House 1 (Villa Ananda)
  {
    id: 'utl-drain-h1',
    type: 'Drainage Sewer',
    utilityCode: 'DRN-H1-01',
    depthM: 2.1,
    diameterMm: 110,
    material: 'uPVC Sanitary Drainage Pipe',
    status: 'Active',
    flowDirection: 'East-West',
    lastInspected: '15 Jan 2026',
    color: '#78716C',
    points: [
      [-65, -2.1, -35.0],
      [-65, -2.1, -28.0],
      [-65, -2.1, -22.5],
    ],
  },
  // Dedicated Water Connection Branch for House 2 (Green Crest - Plot 47/B)
  {
    id: 'utl-water-h2',
    type: 'Water Pipeline',
    utilityCode: 'WTR-H2-01',
    depthM: 1.4,
    diameterMm: 50,
    material: 'CPVC High-Pressure Potable Pipe',
    status: 'Active',
    flowDirection: 'South-North',
    lastInspected: '18 Jan 2026',
    color: '#0284C7',
    points: [
      [57, -1.4, 22.5],
      [57, -1.4, 28.0],
      [64, -1.4, 30.0],
    ],
  },
  // Dedicated Drainage Sewer Branch for House 2 (Green Crest)
  {
    id: 'utl-drain-h2',
    type: 'Drainage Sewer',
    utilityCode: 'DRN-H2-01',
    depthM: 2.1,
    diameterMm: 110,
    material: 'uPVC Sanitary Drainage Pipe',
    status: 'Active',
    flowDirection: 'East-West',
    lastInspected: '18 Jan 2026',
    color: '#78716C',
    points: [
      [62, -2.1, 30.0],
      [57, -2.1, 28.0],
      [57, -2.1, 22.5],
    ],
  },
];

// -------------------------------------------------------------
// 5. SPATIAL ENCROACHMENT ANALYSIS RECORDS (3 CONFLICTS):
// 1. Flat 402: 3D Airspace Overhang (+1.6m)
// 2. House 1 (Villa Ananda): Road Encroachment Error (+2.2m onto Public Road)
// 3. House 2 (Green Crest): Cadastral Boundary Encroachment (+1.6m beyond land)
// -------------------------------------------------------------
export const mockEncroachments: EncroachmentRecord[] = [
  {
    id: 'enc-flat-402',
    flatNumber: 'Flat 402',
    buildingId: 'bldg-a',
    buildingName: 'Building A (Apex Residency)',
    floorNumber: 4,
    floorName: 'Floor 4',
    primaryParcel: 'Survey 42/B',
    conflictingParcel: 'Survey 42/C',
    status: 'Potential 3D Boundary Conflict',
    affectedAreaSqFt: 18.4,
    affectedAreaSqM: 1.71,
    affectedBoundary: 'North-East',
    affectedSide: 'North-East Airspace (Cantilever Balcony Overhang)',
    confidenceScore: 92,
    detectedDate: '18 March 2026',
    surveyMethod: '3D Terrestrial LiDAR & Cadastral Overlay Scan',
    legalActReference: 'Section 132 Maharashtra Land Revenue Code (Airspace Setback)',
    summary:
      'Balcony slab projection and cantilever perimeter of Flat 402 extends 0.38m past the legal vertical setback envelope into adjacent Survey 42/C airspace along the North-East boundary. Ground footprint is compliant; only Floor 4 (Flat 402) is affected.',
    overlapPolygon: [
      [-1.5 + 3.8, -10.5 - 4.0],
      [-1.5 + 4.2, -10.5 - 4.0],
      [-1.5 + 4.2, -10.5 + 0.0],
      [-1.5 + 3.8, -10.5 + 0.0],
    ],
  },
  {
    id: 'enc-house-1',
    flatNumber: 'Villa Ananda (Plot 46/A)',
    buildingId: 'bldg-house-1',
    buildingName: 'Villa Ananda (Sharma Residence)',
    floorNumber: 0,
    floorName: 'Ground Level & Street Frontage',
    primaryParcel: 'Plot 46/A',
    conflictingParcel: 'Public Road Right-of-Way (East-West Street)',
    status: 'Road Encroachment Violation',
    affectedAreaSqFt: 306.8,
    affectedAreaSqM: 28.5,
    affectedBoundary: 'Road Right-of-Way (Frontage)',
    affectedSide: 'South Road Carriageway & Pedestrian Footpath',
    confidenceScore: 98,
    detectedDate: '21 March 2026',
    surveyMethod: 'Drone Photogrammetry & Differential GPS (DGPS)',
    legalActReference: 'Section 231 Municipal Corporation Act (Unauthorized Encroachment on Public Street)',
    summary:
      'CRITICAL ROAD OCCUPATION ERROR: Compound wall, vehicle entry ramp, covered portico and paved parking apron of Villa Ananda illegally occupy 2.2 meters into the municipal street carriageway and pedestrian sidewalk along the East-West road. Ground traffic clearance reduced by 22%.',
    overlapPolygon: [
      [-70, -28],
      [-54, -28],
      [-54, -25.8],
      [-70, -25.8],
    ],
  },
  {
    id: 'enc-house-2',
    flatNumber: 'Green Crest (Plot 47/B)',
    buildingId: 'bldg-house-2',
    buildingName: 'Green Crest (Deshmukh Villa)',
    floorNumber: 0,
    floorName: 'Ground & First Floor Wing',
    primaryParcel: 'Plot 47/B',
    conflictingParcel: 'Plot-45/Open (Government Land Reserve)',
    status: 'Boundary Transgression',
    affectedAreaSqFt: 213.1,
    affectedAreaSqM: 19.8,
    affectedBoundary: 'Eastern Property Line',
    affectedSide: 'Eastern Demarcated Survey Boundary',
    confidenceScore: 95,
    detectedDate: '22 March 2026',
    surveyMethod: 'Total Station Electronic Distance Measurement & 3D Cadastral Scan',
    legalActReference: 'Section 132 Land Revenue Code (Boundary Demarcation Transgression)',
    summary:
      'CADASTRAL BOUNDARY OVERSTEP: Rear 2-story residential wing, boundary wall and terrace projection of Green Crest Villa are constructed 1.6 meters beyond the legal demarcated survey boundary line of Plot 47/B into the adjoining State Government public reserve land.',
    overlapPolygon: [
      [74.0, 24],
      [75.6, 24],
      [75.6, 36.4],
      [74.0, 36.4],
    ],
  },
];

export const mockEncroachment: EncroachmentRecord = mockEncroachments[0];

// -------------------------------------------------------------
// 6. PROPERTY HISTORY FOR FLAT 402 & BUILDING A
// -------------------------------------------------------------
export const mockPropertyHistory: PropertyHistoryEvent[] = [
  {
    year: '2026',
    date: '12 Mar 2026',
    title: 'Property Ownership Verified',
    description: 'Digital verification completed by Sub-Registrar Office via 3D Cadastral Verification Portal. 3D-ULPIN assigned.',
    authority: 'Department of Land Resources & Registration',
    documentRef: 'VER-2026-98124',
    type: 'Verification',
  },
  {
    year: '2025',
    date: '18 Dec 2025',
    title: 'Mutation Recorded (MUT-2026-042)',
    description: 'Title mutated from original owner Suresh Kumar to Ramesh Kumar via Registered Sale Deed transfer.',
    authority: 'Office of the Tahsildar, Haveli',
    documentRef: 'MUT-2026-042',
    type: 'Mutation',
  },
  {
    year: '2024',
    date: '12 Jan 2024',
    title: 'Penthouse Level & Roof Gazebo Sanction',
    description: 'Municipal Corporation sanction for top-tier Penthouse unit PH-01 with private terrace rights.',
    authority: 'Town Planning Department, Municipal Corp',
    documentRef: 'PMC-PH-2024-009',
    type: 'Floor Addition',
  },
  {
    year: '2023',
    date: '14 Nov 2023',
    title: 'Building Floor Added (Vertical Extension)',
    description: 'Municipal Corporation sanction for 5th floor vertical addition. Structural audit & FSI balance verified.',
    authority: 'Town Planning Department, Municipal Corp',
    documentRef: 'FSI-REV-2023-412',
    type: 'Floor Addition',
  },
  {
    year: '2021',
    date: '18 Aug 2021',
    title: 'Original Property Registration (Including B1 & B2 Basements)',
    description: 'Initial registration with 2 underground basement parking tiers and residential floors 1-4.',
    authority: 'Sub-Registrar District Haveli-IV',
    documentRef: 'REG-2021-3091',
    type: 'Registration',
  },
];

// -------------------------------------------------------------
// 7. MUTATION RECORD
// -------------------------------------------------------------
export const mockMutationRecord: MutationRecord = {
  mutationNumber: 'MUT-2026-042',
  status: 'Verified',
  previousOwner: 'Suresh Kumar',
  newOwner: 'Ramesh Kumar',
  date: '12 March 2026',
  reason: 'Property Transfer',
  surveyNumber: '42/B',
  unitNumber: 'Flat 402, Building A (Floor 4)',
  documents: [
    {
      name: 'Registered Sale Deed (Vol 1408, Pg 214)',
      type: 'PDF Document',
      fileSize: '4.2 MB',
      refNo: 'SD-PUN-2026-0198',
    },
    {
      name: 'Property Tax Clear No-Dues Receipt',
      type: 'PDF Receipt',
      fileSize: '640 KB',
      refNo: 'PMC-TAX-2025-26-88',
    },
    {
      name: 'Society NOC & Share Transfer Certificate',
      type: 'PDF Certificate',
      fileSize: '1.1 MB',
      refNo: 'ACHS-NOC-2026-14',
    },
  ],
  notingOfficer: 'S. N. Joshi (Revenue Circle Inspector, Taluka Haveli)',
};

// -------------------------------------------------------------
// 8. BLOCK A ELEVATORS (LIFTS)
// -------------------------------------------------------------
export const mockElevators: BuildingElevator[] = [
  {
    id: 'elev-e01',
    code: 'E-01',
    name: 'Elevator E-01',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    type: 'Passenger Elevator',
    serves: 'Basement 2 → Penthouse (9 Levels)',
    currentLevel: 'Floor 3',
    status: 'Operational',
    capacity: '8 persons (680 kg)',
    speed: '1.75 m/s',
    manufacturer: 'Schindler 5500 Smart Core',
    lastInspection: '14-Aug-2026',
    shaftDimensions: { width: 2.3, depth: 2.3, height: 28.5 },
    position: { x: -29.5, z: -45.0 },
  },
  {
    id: 'elev-e02',
    code: 'E-02',
    name: 'Elevator E-02',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    type: 'Passenger Elevator',
    serves: 'Basement 2 → Penthouse (9 Levels)',
    currentLevel: 'Ground Floor',
    status: 'Operational',
    capacity: '8 persons (680 kg)',
    speed: '1.75 m/s',
    manufacturer: 'Schindler 5500 Smart Core',
    lastInspection: '14-Aug-2026',
    shaftDimensions: { width: 2.3, depth: 2.3, height: 28.5 },
    position: { x: -26.5, z: -45.0 },
  },
];

// -------------------------------------------------------------
// 9. BLOCK A VERTICAL UTILITY RISERS & INFRASTRUCTURE
// -------------------------------------------------------------
export const mockBuildingUtilities: BuildingUtilityRiser[] = [
  {
    id: 'W-01',
    utilityType: 'Water Pipeline',
    name: 'Water Pipeline (W-01)',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    route: 'Basement 2 → Floor 5',
    depthM: -6.0,
    diameterMm: 110,
    material: 'CPVC SDR-11 Multi-layer High Pressure',
    status: 'Active',
    color: '#2563EB', // Blue
    connectionPoint: 'Basement 2 Booster Pumps → Municipal Water Meter',
    lastInspected: '12-Jul-2026',
    layerKey: 'waterPipeline',
    coordinates: { x: -25.5, z: -43.5 },
  },
  {
    id: 'D-01',
    utilityType: 'Drainage Pipeline',
    name: 'Drainage Pipeline (D-01)',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    route: 'Basement 2 → Floor 5',
    depthM: -6.0,
    diameterMm: 160,
    material: 'uPVC Heavy Duty Sanitary Soil & Waste Pipe',
    status: 'Active',
    color: '#78716C', // Brown / Stone Gray
    connectionPoint: 'Floors Stack → Basement 2 Sump & Municipal Sewer Trunk',
    lastInspected: '05-Aug-2026',
    layerKey: 'drainagePipeline',
    coordinates: { x: -30.5, z: -43.5 },
  },
  {
    id: 'ELC-01',
    utilityType: 'Electrical Conduit',
    name: 'Electrical Conduit (ELC-01)',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    route: 'Basement 1 → Floor 5',
    depthM: -3.0,
    diameterMm: 90,
    material: 'Armored Fire-Resistant XLPE Copper Busduct',
    status: 'Active',
    color: '#F59E0B', // Yellow / Orange
    connectionPoint: 'Basement 1 Substation & Meter Board → Floor Distribution Boxes',
    lastInspected: '28-Jun-2026',
    layerKey: 'electricalNetwork',
    coordinates: { x: -25.5, z: -46.5 },
  },
  {
    id: 'F-01',
    utilityType: 'Fiber/Telecom Conduit',
    name: 'Fiber/Telecom Conduit (F-01)',
    buildingId: 'bldg-a',
    buildingName: 'Block A',
    route: 'Basement 1 → Penthouse',
    depthM: -3.0,
    diameterMm: 65,
    material: 'LSZH Armored 48-Core Single-Mode Fiber Raceway',
    status: 'Active',
    color: '#9333EA', // Purple
    connectionPoint: 'Basement 1 Telecom POP Rack → Floor Splitters & Sky Foyer',
    lastInspected: '19-Sep-2026',
    layerKey: 'fiberNetwork',
    coordinates: { x: -30.5, z: -46.5 },
  },
  // Dedicated Pipelines for Individual House 1 (Villa Ananda - Plot 46/A)
  {
    id: 'W-H1',
    utilityType: 'Water Pipeline',
    name: 'Potable Water Supply Pipe (W-H1)',
    buildingId: 'bldg-house-1',
    buildingName: 'Villa Ananda (Sharma Residence)',
    route: 'Municipal Road Main → Ground Sump & Overhead Tank',
    depthM: -1.4,
    diameterMm: 50,
    material: 'CPVC High Pressure Potable Water Pipe',
    status: 'Active',
    color: '#0284C7',
    connectionPoint: 'Municipal Water Main → Domestic Water Meter (Plot 46/A)',
    lastInspected: '12-Jan-2026',
    layerKey: 'waterPipeline',
    coordinates: { x: -63, z: -35 },
  },
  {
    id: 'D-H1',
    utilityType: 'Drainage Pipeline',
    name: 'Sanitary Sewer Drainage Pipe (D-H1)',
    buildingId: 'bldg-house-1',
    buildingName: 'Villa Ananda (Sharma Residence)',
    route: 'Domestic Soil Waste Chamber → Municipal Sewer Trunk',
    depthM: -2.1,
    diameterMm: 110,
    material: 'uPVC Sanitary Drainage Pipe (Class NP3)',
    status: 'Active',
    color: '#78716C',
    connectionPoint: 'Villa Inspection Chamber → Street Drainage Manhole',
    lastInspected: '15-Jan-2026',
    layerKey: 'drainagePipeline',
    coordinates: { x: -65, z: -35 },
  },
  {
    id: 'ELC-H1',
    utilityType: 'Electrical Conduit',
    name: 'Electrical Underground Service (ELC-H1)',
    buildingId: 'bldg-house-1',
    buildingName: 'Villa Ananda (Sharma Residence)',
    route: 'Road Feeder Pillar → Villa Exterior Meter Panel',
    depthM: -1.0,
    diameterMm: 35,
    material: 'Armoured 4-Core 415V Copper Service Cable',
    status: 'Active',
    color: '#F59E0B',
    connectionPoint: 'Street Distribution Kiosk #4 → Main Distribution Board',
    lastInspected: '20-Feb-2026',
    layerKey: 'electricalNetwork',
    coordinates: { x: -61, z: -35 },
  },
  // Dedicated Pipelines for Individual House 2 (Green Crest Villa - Plot 47/B)
  {
    id: 'W-H2',
    utilityType: 'Water Pipeline',
    name: 'Potable Water Supply Pipe (W-H2)',
    buildingId: 'bldg-house-2',
    buildingName: 'Green Crest (Deshmukh Villa)',
    route: 'Municipal Main (East) → Villa Ground Storage Sump',
    depthM: -1.4,
    diameterMm: 50,
    material: 'CPVC Potable Water Pipe',
    status: 'Active',
    color: '#0284C7',
    connectionPoint: 'East Service Main → Villa Water Meter (Plot 47/B)',
    lastInspected: '18-Jan-2026',
    layerKey: 'waterPipeline',
    coordinates: { x: 62, z: 30 },
  },
  {
    id: 'D-H2',
    utilityType: 'Drainage Pipeline',
    name: 'Sanitary Sewer Drainage Pipe (D-H2)',
    buildingId: 'bldg-house-2',
    buildingName: 'Green Crest (Deshmukh Villa)',
    route: 'Villa Waste Stack → Municipal Drainage Manhole',
    depthM: -2.1,
    diameterMm: 110,
    material: 'uPVC Heavy Duty Drainage Pipe',
    status: 'Active',
    color: '#78716C',
    connectionPoint: 'Inspection Chamber → Municipal Sewer Line',
    lastInspected: '18-Jan-2026',
    layerKey: 'drainagePipeline',
    coordinates: { x: 60, z: 30 },
  },
  {
    id: 'ELC-H2',
    utilityType: 'Electrical Conduit',
    name: 'Electrical Underground Service (ELC-H2)',
    buildingId: 'bldg-house-2',
    buildingName: 'Green Crest (Deshmukh Villa)',
    route: 'Street Transformer Kiosk → Villa Meter Board',
    depthM: -1.0,
    diameterMm: 35,
    material: 'Armoured 4-Core Copper Underground Cable',
    status: 'Active',
    color: '#F59E0B',
    connectionPoint: 'Feeder Pillar #7 → Main Distribution Board',
    lastInspected: '25-Feb-2026',
    layerKey: 'electricalNetwork',
    coordinates: { x: 64, z: 30 },
  },
];

