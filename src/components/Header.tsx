import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  LandPlot,
  ChevronRight,
  User,
  Shield,
  Map as MapIcon,
  Box,
  ChevronDown,
  Check,
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import {
  LandParcel,
  CadastralBuilding,
  PropertyUnit,
  BuildingElevator,
  BuildingUtilityRiser,
} from '../types/gis';

export type MapDimension = '2d' | '3d';
export type UserRole = 'citizen' | 'official';

interface HeaderProps {
  parcels: LandParcel[];
  buildings: CadastralBuilding[];
  units: PropertyUnit[];
  elevators?: BuildingElevator[];
  buildingUtilities?: BuildingUtilityRiser[];
  selectedParcel: LandParcel | null;
  selectedBuilding: CadastralBuilding | null;
  selectedFloor: number | null;
  selectedUnit: PropertyUnit | null;
  mapDimension: MapDimension;
  userRole: UserRole;
  onChangeMapDimension: (dim: MapDimension) => void;
  onChangeUserRole: (role: UserRole) => void;
  onSelectParcel: (parcel: LandParcel) => void;
  onSelectBuilding: (building: CadastralBuilding) => void;
  onSelectUnit: (unit: PropertyUnit) => void;
  onSelectFloor?: (floorNumber: number) => void;
  onSelectElevator?: (elevator: BuildingElevator) => void;
  onSelectBuildingUtility?: (utility: BuildingUtilityRiser) => void;
  onResetToLandOverview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  parcels,
  buildings,
  units,
  elevators = [],
  buildingUtilities = [],
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  selectedUnit,
  mapDimension,
  userRole,
  onChangeMapDimension,
  onChangeUserRole,
  onSelectParcel,
  onSelectBuilding,
  onSelectUnit,
  onSelectFloor,
  onSelectElevator,
  onSelectBuildingUtility,
  onResetToLandOverview,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-3 md:px-5 flex items-center justify-between z-30 shrink-0 select-none shadow-2xs font-sans">
      {/* 1. Left Zone: Brand & Cadastral Breadcrumbs (NO "Community" label) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onResetToLandOverview}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
          title="Reset to Cadastral Land Overview"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#0F172A] tracking-tight block leading-tight">
              GeoVoxel 3D
            </span>
            <span className="text-[10px] text-[#64748B] block leading-tight">
              Cadastral Land &amp; Property Registry
            </span>
          </div>
        </button>

        {/* Dynamic Cadastral Breadcrumb */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#64748B] pl-3 border-l border-[#E2E8F0]">
          <button
            onClick={onResetToLandOverview}
            className="hover:text-[#2563EB] flex items-center gap-1 font-medium cursor-pointer"
          >
            <LandPlot className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Land Parcels</span>
          </button>

          {selectedParcel && !selectedBuilding && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <span className="font-semibold text-[#2563EB]">
                {selectedParcel.surveyNumber}
              </span>
            </>
          )}

          {selectedBuilding && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <button
                onClick={() => onSelectBuilding(selectedBuilding)}
                className={`font-semibold cursor-pointer ${
                  !selectedFloor && !selectedUnit ? 'text-[#2563EB]' : 'hover:text-[#2563EB]'
                }`}
              >
                {selectedBuilding.name}
              </button>
            </>
          )}

          {selectedFloor !== null && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <span className={`font-semibold ${!selectedUnit ? 'text-[#2563EB]' : ''}`}>
                {selectedFloor === 6
                  ? 'Penthouse'
                  : selectedFloor === 0
                  ? 'Ground Floor'
                  : selectedFloor === -1
                  ? 'Basement 1'
                  : selectedFloor === -2
                  ? 'Basement 2'
                  : `Floor ${selectedFloor}`}
              </span>
            </>
          )}

          {selectedUnit && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <span
                className={`font-bold px-1.5 py-0.2 rounded ${
                  selectedUnit.unitNumber === '402' || selectedUnit.hasConflict
                    ? 'bg-[#FEE2E2] text-[#DC2626]'
                    : 'bg-[#EFF6FF] text-[#2563EB]'
                }`}
              >
                Flat {selectedUnit.unitNumber}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. Center: Search Bar */}
      <div className="flex-1 max-w-sm lg:max-w-md mx-3">
        <SearchBar
          parcels={parcels}
          buildings={buildings}
          units={units}
          elevators={elevators}
          buildingUtilities={buildingUtilities}
          onSelectParcel={onSelectParcel}
          onSelectBuilding={onSelectBuilding}
          onSelectUnit={onSelectUnit}
          onSelectFloor={onSelectFloor}
          onSelectElevator={onSelectElevator}
          onSelectBuildingUtility={onSelectBuildingUtility}
        />
      </div>

      {/* 3. Right Zone: 2D/3D Toggle + Citizen/User Login Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 2D / 3D Map Toggle */}
        <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
          <button
            onClick={() => onChangeMapDimension('2d')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mapDimension === '2d'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="2D Cadastral Survey Map"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D</span>
          </button>
          <button
            onClick={() => onChangeMapDimension('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mapDimension === '3d'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="3D Spatial Vertical Cadastre"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
        </div>

        {/* User / Citizen Role Login Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
            title="Switch User / Citizen Access Mode"
          >
            {userRole === 'citizen' ? (
              <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-[10px]">
                <User className="w-3 h-3" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-[10px]">
                <Shield className="w-3 h-3" />
              </div>
            )}
            <span className="font-semibold text-[#1E293B]">
              {userRole === 'citizen' ? 'Citizen' : 'Official'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-xl py-1.5 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">
                Select Portal Mode
              </div>

              {/* Citizen option */}
              <button
                onClick={() => {
                  onChangeUserRole('citizen');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                  userRole === 'citizen' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <div className="font-bold">Citizen / Property Owner</div>
                    <div className="text-[10px] text-[#64748B]">Property Title, Tax &amp; Mutation</div>
                  </div>
                </div>
                {userRole === 'citizen' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>

              {/* Official / Surveyor option */}
              <button
                onClick={() => {
                  onChangeUserRole('official');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                  userRole === 'official' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <div className="font-bold">Surveyor / Land Official</div>
                    <div className="text-[10px] text-[#64748B]">3D-ULPIN, GIS &amp; Boundary Audit</div>
                  </div>
                </div>
                {userRole === 'official' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>
            </div>
          )}
        </div>

        {/* Reset View Button */}
        <button
          onClick={onResetToLandOverview}
          className="p-1.5 hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors cursor-pointer"
          title="Reset to Full Land Map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
