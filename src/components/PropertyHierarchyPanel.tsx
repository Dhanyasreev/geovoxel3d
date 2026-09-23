import React, { useState } from 'react';
import {
  Building2,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  LandPlot,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CadastralBuilding, LandParcel, PropertyUnit } from '../types/gis';

interface PropertyHierarchyPanelProps {
  parcels: LandParcel[];
  buildings: CadastralBuilding[];
  selectedParcel: LandParcel | null;
  selectedBuilding: CadastralBuilding | null;
  selectedFloor: number | null;
  selectedUnit: PropertyUnit | null;
  onSelectParcel: (parcel: LandParcel) => void;
  onSelectBuilding: (building: CadastralBuilding) => void;
  onSelectFloor: (floorNumber: number, building: CadastralBuilding) => void;
  onSelectUnit: (unit: PropertyUnit, building: CadastralBuilding) => void;
  onClose?: () => void;
}

export const PropertyHierarchyPanel: React.FC<PropertyHierarchyPanelProps> = ({
  parcels,
  buildings,
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  selectedUnit,
  onSelectParcel,
  onSelectBuilding,
  onSelectFloor,
  onSelectUnit,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  // Active block tab in bottom viewer: defaults to selectedBuilding or Block A
  const activeBldgId = selectedBuilding?.id || 'bldg-a';
  const activeBldg = buildings.find((b) => b.id === activeBldgId) || buildings[0];

  // Find empty parcel (e.g. Plot-45/Open)
  const emptyParcel = parcels.find((p) => p.buildingIds.length === 0);

  return (
    <div className="w-full bg-white border-t border-[#E2E8F0] shadow-2xl z-20 select-none font-sans transition-all duration-200">
      {/* Top Header Bar with Block Selection Pills & Toggle */}
      <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] uppercase tracking-wide">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <span>Property Hierarchy:</span>
          </div>
          <span className="text-[11px] text-[#64748B] hidden sm:inline">
            Select any Flat to zoom &amp; inspect
          </span>
        </div>

        {/* All Blocks & Vacant Parcel Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {buildings.map((bldg) => {
            const isSelected = selectedBuilding?.id === bldg.id;
            const hasConflict = bldg.id === 'bldg-a';

            return (
              <button
                key={bldg.id}
                onClick={() => {
                  onSelectBuilding(bldg);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#334155] border border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#64748B]'}`} />
                <span>{bldg.name}</span>
                {hasConflict && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" title="Contains Conflict Flat 402" />
                )}
              </button>
            );
          })}

          {/* Empty / Vacant Parcel Tab to show difference */}
          {emptyParcel && (
            <button
              onClick={() => {
                onSelectParcel(emptyParcel);
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                selectedParcel?.id === emptyParcel.id && !selectedBuilding
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] hover:bg-[#FDE68A]'
              }`}
              title="Inspect Vacant Land Parcel (No Building)"
            >
              <LandPlot className="w-3.5 h-3.5" />
              <span>{emptyParcel.surveyNumber} (Empty Land)</span>
            </button>
          )}
        </div>

        {/* Expand / Collapse & Close Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-[#E2E8F0] rounded text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Hierarchy' : 'Expand Hierarchy'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#E2E8F0] rounded text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              title="Close Hierarchy"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Floors & Flats Viewer */}
      {isExpanded && (
        <div className="p-3 bg-white max-h-56 overflow-y-auto space-y-2.5">
          {/* If Empty Parcel is selected */}
          {emptyParcel && selectedParcel?.id === emptyParcel.id && !selectedBuilding ? (
            <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg text-xs text-[#92400E] flex items-center justify-between">
              <div>
                <span className="font-bold block text-sm">
                  {emptyParcel.surveyNumber} — Vacant Land Parcel
                </span>
                <p className="text-[11px] text-[#B45309] mt-0.5">
                  This is an unconstructed open cadastral land parcel ({emptyParcel.areaSqMeters} m²). It demonstrates the difference between raw 2D land parcels and vertical 3D multi-level buildings.
                </p>
              </div>
              <button
                onClick={() => onSelectBuilding(buildings[0])}
                className="px-3 py-1.5 bg-[#D97706] text-white rounded font-bold hover:bg-[#B45309] transition-colors cursor-pointer"
              >
                Switch to Block A
              </button>
            </div>
          ) : (
            /* Active Block's Floors and Flats */
            <div className="space-y-2">
              {activeBldg.floors.map((floor) => {
                const isFloorActive = selectedFloor === floor.floorNumber && selectedBuilding?.id === activeBldg.id;

                return (
                  <div
                    key={floor.floorNumber}
                    className={`p-2 rounded-lg border transition-all ${
                      isFloorActive
                        ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {/* Floor Row Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <button
                        onClick={() => onSelectFloor(floor.floorNumber, activeBldg)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B] hover:text-[#2563EB] cursor-pointer"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#64748B]">
                          {floor.floorNumber < 0
                            ? `B${Math.abs(floor.floorNumber)}`
                            : floor.floorNumber === 6
                            ? 'PH'
                            : `F${floor.floorNumber}`}
                        </span>
                        <span>{floor.name}</span>
                        <span className="text-[10px] text-[#64748B] font-normal">
                          (+{floor.elevationM}m elevation)
                        </span>
                      </button>

                      <span className="text-[10px] text-[#64748B]">
                        {floor.units.length} {floor.units.length === 1 ? 'Unit' : 'Flats'}
                      </span>
                    </div>

                    {/* Flats Grid for this Floor */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {floor.units.map((unit) => {
                        const isFlatSelected = selectedUnit?.id === unit.id;
                        const isConflict = unit.unitNumber === '402' || unit.hasConflict;

                        return (
                          <button
                            key={unit.id}
                            onClick={() => onSelectUnit(unit, activeBldg)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                              isConflict
                                ? isFlatSelected
                                  ? 'bg-[#DC2626] text-white border border-[#B91C1C] ring-2 ring-[#F87171] shadow-md font-bold'
                                  : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FCA5A5] font-bold'
                                : isFlatSelected
                                ? 'bg-[#2563EB] text-white shadow-xs border border-[#1D4ED8]'
                                : 'bg-white text-[#334155] border border-[#CBD5E1] hover:border-[#2563EB] hover:text-[#2563EB]'
                            }`}
                            title={`Inspect ${unit.unitNumber} (${unit.ownerName})`}
                          >
                            {isConflict && <AlertTriangle className="w-3 h-3 text-[#DC2626] shrink-0" />}
                            <span>Flat {unit.unitNumber}</span>
                            {isConflict && (
                              <span className="text-[9px] px-1 py-0.2 bg-[#DC2626] text-white rounded font-bold ml-0.5">
                                CONFLICT
                              </span>
                            )}
                            <span className="text-[10px] opacity-75 ml-0.5">
                              {unit.areaSqFt} sqft
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
