import React, { useState } from 'react';
import { Header, MapDimension, UserRole } from './components/Header';
import { LayerPanel, InspectionMode } from './components/LayerPanel';
import { MapView } from './components/MapView';
import { PropertyPanel } from './components/PropertyPanel';
import { PropertyHierarchyPanel } from './components/PropertyHierarchyPanel';
import { EncroachmentPanel } from './components/EncroachmentPanel';

import {
  mockParcels,
  mockBuildings,
  allNeighborhoodUnits,
  mockElevators,
  mockBuildingUtilities,
  mockEncroachments,
  mockEncroachment,
} from './data/mockData';

import {
  LandParcel,
  CadastralBuilding,
  PropertyUnit,
  BuildingElevator,
  BuildingUtilityRiser,
} from './types/gis';

export default function App() {
  // Synchronized Selection State
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<CadastralBuilding | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [selectedElevator, setSelectedElevator] = useState<BuildingElevator | null>(null);
  const [selectedBuildingUtility, setSelectedBuildingUtility] = useState<BuildingUtilityRiser | null>(null);

  // Active Conflict ID ('enc-flat-402' | 'enc-house-1' | 'enc-house-2')
  const [activeConflictId, setActiveConflictId] = useState<string>('enc-flat-402');
  const [isEncroachmentModalOpen, setIsEncroachmentModalOpen] = useState<boolean>(false);

  // Active Inspection Mode
  const [inspectionMode, setInspectionMode] = useState<InspectionMode>('community');

  // 2D vs 3D Map Toggle
  const [mapDimension, setMapDimension] = useState<MapDimension>('3d');

  // User Role Switcher: Citizen vs Official
  const [userRole, setUserRole] = useState<UserRole>('citizen');

  // Property Hierarchy Modal Toggle (Non-intrusive floating modal)
  const [showHierarchy, setShowHierarchy] = useState<boolean>(false);

  // Building A reference
  const blockA = mockBuildings.find((b) => b.id === 'bldg-a') || mockBuildings[0];

  // Specific Conflict Selector Handler
  const handleSelectConflict = (conflictId: string) => {
    setActiveConflictId(conflictId);
    setInspectionMode('conflict');
    setSelectedElevator(null);
    setSelectedBuildingUtility(null);

    if (conflictId === 'enc-house-1') {
      const h1 = mockBuildings.find((b) => b.id === 'bldg-house-1') || mockBuildings[0];
      setSelectedBuilding(h1);
      setSelectedFloor(0);
      if (h1.floors[0]?.units[0]) {
        setSelectedUnit(h1.floors[0].units[0]);
      }
      const prcl = mockParcels.find((p) => p.id === 'parcel-house-1');
      if (prcl) setSelectedParcel(prcl);
    } else if (conflictId === 'enc-house-2') {
      const h2 = mockBuildings.find((b) => b.id === 'bldg-house-2') || mockBuildings[0];
      setSelectedBuilding(h2);
      setSelectedFloor(0);
      if (h2.floors[0]?.units[0]) {
        setSelectedUnit(h2.floors[0].units[0]);
      }
      const prcl = mockParcels.find((p) => p.id === 'parcel-house-2');
      if (prcl) setSelectedParcel(prcl);
    } else {
      setSelectedBuilding(blockA);
      setSelectedFloor(4);
      const flat402 = blockA.floors
        .find((f) => f.floorNumber === 4)
        ?.units.find((u) => u.unitNumber === '402');
      if (flat402) setSelectedUnit(flat402);
      const prcl = mockParcels.find((p) => p.buildingIds.includes(blockA.id));
      if (prcl) setSelectedParcel(prcl);
    }
  };

  // Mode Change Handler
  const handleChangeMode = (mode: InspectionMode) => {
    setInspectionMode(mode);

    if (mode === 'community') {
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setSelectedUnit(null);
      setSelectedElevator(null);
      setSelectedBuildingUtility(null);
      setSelectedParcel(null);
    } else if (mode === 'floors') {
      const activeBldg = selectedBuilding || blockA;
      setSelectedBuilding(activeBldg);
      setSelectedElevator(null);
      setSelectedBuildingUtility(null);
    } else if (mode === 'basements') {
      setSelectedBuilding(blockA);
      setSelectedFloor(-1);
      setSelectedUnit(null);
      setSelectedElevator(null);
      setSelectedBuildingUtility(null);
    } else if (mode === 'elevators') {
      setSelectedBuilding(blockA);
      setSelectedElevator(mockElevators[0]);
      setSelectedBuildingUtility(null);
      setSelectedUnit(null);
      setSelectedFloor(null);
    } else if (mode === 'pipelines') {
      const activeBldg = selectedBuilding || blockA;
      const pipeForBldg = mockBuildingUtilities.find((u) => u.buildingId === activeBldg.id) || mockBuildingUtilities[0];
      setSelectedBuildingUtility(pipeForBldg);
      setSelectedElevator(null);
      setSelectedUnit(null);
      setSelectedFloor(null);
    } else if (mode === 'conflict') {
      handleSelectConflict(activeConflictId || 'enc-flat-402');
    }
  };

  // Reset to full cadastral land overview
  const handleResetToLandOverview = () => {
    handleChangeMode('community');
  };

  // Synchronized Selection Handlers
  const handleSelectBuilding = (building: CadastralBuilding) => {
    setSelectedBuilding(building);
    setSelectedFloor(null);
    setSelectedUnit(null);
    setSelectedElevator(null);
    setSelectedBuildingUtility(null);
    if (inspectionMode === 'community') {
      setInspectionMode('floors');
    }
    const prcl = mockParcels.find((p) => p.buildingIds.includes(building.id));
    if (prcl) setSelectedParcel(prcl);
  };

  const handleSelectFloor = (floorNumber: number, building?: CadastralBuilding) => {
    const bldg = building || selectedBuilding || blockA;
    setSelectedBuilding(bldg);
    setSelectedFloor(floorNumber);
    setSelectedUnit(null);
    setSelectedElevator(null);
    setSelectedBuildingUtility(null);

    if (floorNumber < 0) {
      setInspectionMode('basements');
    } else {
      setInspectionMode('floors');
    }
  };

  // DIRECT SELECTION OF ANY FLAT IN ANY BLOCK OR INDIVIDUAL HOUSE
  const handleSelectUnit = (unit: PropertyUnit, building?: CadastralBuilding) => {
    const bldg = building || mockBuildings.find((b) => b.id === unit.buildingId) || blockA;
    setSelectedBuilding(bldg);
    setSelectedFloor(unit.floorNumber);
    setSelectedUnit(unit);
    setSelectedElevator(null);
    setSelectedBuildingUtility(null);

    const prcl = mockParcels.find((p) => p.buildingIds.includes(bldg.id));
    if (prcl) setSelectedParcel(prcl);

    if (unit.unitNumber === '402' || unit.hasConflict) {
      if (bldg.id === 'bldg-house-1') {
        setActiveConflictId('enc-house-1');
      } else if (bldg.id === 'bldg-house-2') {
        setActiveConflictId('enc-house-2');
      } else {
        setActiveConflictId('enc-flat-402');
      }
      setInspectionMode('conflict');
    } else {
      setInspectionMode('floors');
    }
  };

  const handleSelectElevator = (elevator: BuildingElevator) => {
    setSelectedElevator(elevator);
    setSelectedBuilding(blockA);
    setSelectedBuildingUtility(null);
    setSelectedUnit(null);
    setSelectedFloor(null);
    setInspectionMode('elevators');
  };

  const handleSelectBuildingUtility = (utility: BuildingUtilityRiser) => {
    setSelectedBuildingUtility(utility);
    const parentBldg = mockBuildings.find((b) => b.id === utility.buildingId) || blockA;
    setSelectedBuilding(parentBldg);
    setSelectedElevator(null);
    setSelectedUnit(null);
    setSelectedFloor(null);
    setInspectionMode('pipelines');
  };

  const handleSelectParcel = (parcel: LandParcel) => {
    setSelectedParcel(parcel);
    if (parcel.buildingIds.length === 0) {
      // EMPTY / VACANT LAND PARCEL
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setSelectedUnit(null);
      setSelectedElevator(null);
      setSelectedBuildingUtility(null);
    } else {
      const bldg = mockBuildings.find((b) => parcel.buildingIds.includes(b.id));
      if (bldg) {
        setSelectedBuilding(bldg);
        setInspectionMode('floors');
      }
    }
  };

  const handleClosePropertyPanel = () => {
    setSelectedUnit(null);
    setSelectedElevator(null);
    setSelectedBuildingUtility(null);
    setSelectedFloor(null);
    setSelectedBuilding(null);
    setSelectedParcel(null);
  };

  // Determine if details panel should be visible
  const isDetailsOpen = Boolean(
    selectedUnit ||
      selectedFloor !== null ||
      selectedElevator ||
      selectedBuildingUtility ||
      (selectedParcel && selectedParcel.buildingIds.length === 0) ||
      (selectedBuilding && inspectionMode !== 'community')
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] overflow-hidden font-sans">
      {/* 1. TOP NAVIGATION HEADER (With 2D/3D toggle & Citizen/Official login) */}
      <Header
        parcels={mockParcels}
        buildings={mockBuildings}
        units={allNeighborhoodUnits}
        elevators={mockElevators}
        buildingUtilities={mockBuildingUtilities}
        selectedParcel={selectedParcel}
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        selectedUnit={selectedUnit}
        mapDimension={mapDimension}
        userRole={userRole}
        onChangeMapDimension={setMapDimension}
        onChangeUserRole={setUserRole}
        onSelectParcel={handleSelectParcel}
        onSelectBuilding={handleSelectBuilding}
        onSelectUnit={handleSelectUnit}
        onSelectFloor={handleSelectFloor}
        onSelectElevator={handleSelectElevator}
        onSelectBuildingUtility={handleSelectBuildingUtility}
        onResetToLandOverview={handleResetToLandOverview}
      />

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* LEFT SIDEBAR: SIMPLE INSPECTION CONTROLS */}
        <LayerPanel
          currentMode={inspectionMode}
          onChangeMode={handleChangeMode}
          showHierarchy={showHierarchy}
          onToggleHierarchy={() => setShowHierarchy(!showHierarchy)}
          activeConflictId={activeConflictId}
          onSelectConflict={handleSelectConflict}
          activeBuildingName={
            selectedBuilding
              ? selectedBuilding.name
              : selectedParcel && selectedParcel.buildingIds.length === 0
              ? `${selectedParcel.surveyNumber} (Empty Land)`
              : 'All Land Parcels'
          }
        />

        {/* CENTER VIEWPORT (PURE FULL-HEIGHT MAP CANVAS - ZERO BLANK SPACE) */}
        <div className="flex-1 relative h-full w-full overflow-hidden">
          {/* 3D / 2D MAP CANVAS VIEW */}
          <main className="h-full w-full relative overflow-hidden">
            <MapView
              parcels={mockParcels}
              buildings={mockBuildings}
              elevators={mockElevators}
              buildingUtilities={mockBuildingUtilities}
              selectedParcel={selectedParcel}
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedUnit={selectedUnit}
              selectedElevator={selectedElevator}
              selectedBuildingUtility={selectedBuildingUtility}
              activeConflictId={activeConflictId}
              inspectionMode={inspectionMode}
              mapDimension={mapDimension}
              onSelectParcel={handleSelectParcel}
              onSelectBuilding={handleSelectBuilding}
              onSelectFloor={handleSelectFloor}
              onSelectUnit={handleSelectUnit}
              onSelectElevator={handleSelectElevator}
              onSelectBuildingUtility={handleSelectBuildingUtility}
              onSelectConflict={handleSelectConflict}
              onOpenHierarchy={() => setShowHierarchy(true)}
            />
          </main>

          {/* FLOATING HIERARCHY & FLAT DIRECTORY MODAL */}
          {showHierarchy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <PropertyHierarchyPanel
                  parcels={mockParcels}
                  buildings={mockBuildings}
                  selectedParcel={selectedParcel}
                  selectedBuilding={selectedBuilding}
                  selectedFloor={selectedFloor}
                  selectedUnit={selectedUnit}
                  onSelectParcel={handleSelectParcel}
                  onSelectBuilding={handleSelectBuilding}
                  onSelectFloor={handleSelectFloor}
                  onSelectUnit={(unit, bldg) => {
                    handleSelectUnit(unit, bldg);
                    setShowHierarchy(false);
                  }}
                  onClose={() => setShowHierarchy(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: PROPERTY DETAILS (STRICTLY SELECTION-DRIVEN) */}
        {isDetailsOpen && (
          <PropertyPanel
            unit={selectedUnit}
            building={selectedBuilding}
            floorNumber={selectedFloor}
            parcel={selectedParcel}
            elevator={selectedElevator}
            buildingUtility={selectedBuildingUtility}
            userRole={userRole}
            onClose={handleClosePropertyPanel}
            onSelectUnit={handleSelectUnit}
            onSelectFloor={handleSelectFloor}
            onOpenEncroachmentNotice={() => setIsEncroachmentModalOpen(true)}
          />
        )}

        {/* FORMAL SPATIAL CONFLICT & ENCROACHMENT MODAL */}
        {isEncroachmentModalOpen && (
          <EncroachmentPanel
            encroachment={
              mockEncroachments.find((e) => e.id === activeConflictId) ||
              mockEncroachments[0] ||
              mockEncroachment
            }
            isOpen={isEncroachmentModalOpen}
            onClose={() => setIsEncroachmentModalOpen(false)}
            onZoomToEncroachment={() => {
              setIsEncroachmentModalOpen(false);
              handleSelectConflict(activeConflictId);
            }}
          />
        )}
      </div>
    </div>
  );
}
