import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Building2,
  Layers,
  AlertTriangle,
  ArrowUpDown,
  Droplets,
  Zap,
  Radio,
  ShieldCheck,
  CheckCircle2,
  LandPlot,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import {
  PropertyUnit,
  CadastralBuilding,
  LandParcel,
  BuildingElevator,
  BuildingUtilityRiser,
} from '../types/gis';
import { UserRole } from './Header';

interface PropertyPanelProps {
  unit: PropertyUnit | null;
  building: CadastralBuilding | null;
  floorNumber: number | null;
  parcel: LandParcel | null;
  elevator?: BuildingElevator | null;
  buildingUtility?: BuildingUtilityRiser | null;
  userRole?: UserRole;
  onClose: () => void;
  onSelectUnit?: (unit: PropertyUnit) => void;
  onSelectFloor?: (floorNumber: number) => void;
  onOpenEncroachmentNotice?: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  unit,
  building,
  floorNumber,
  parcel,
  elevator,
  buildingUtility,
  userRole = 'citizen',
  onClose,
  onSelectUnit,
  onSelectFloor,
  onOpenEncroachmentNotice,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUlpin = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. EMPTY / VACANT LAND PARCEL SELECTED
  if (parcel && !building && !unit && floorNumber === null && !elevator && !buildingUtility) {
    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D97706] text-white flex items-center justify-center font-bold">
              <LandPlot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#92400E]">{parcel.surveyNumber}</h2>
              <p className="text-[11px] text-[#B45309]">Vacant Cadastral Land Parcel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#92400E] hover:bg-[#FDE68A] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Key Difference Callout */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-lg space-y-1 text-[#92400E]">
            <span className="font-bold flex items-center gap-1">
              <LandPlot className="w-3.5 h-3.5" />
              <span>Difference: Land Parcel vs Building</span>
            </span>
            <p className="text-[11px] text-[#B45309] leading-relaxed">
              This is raw 2D surface land with no vertical superstructure constructed. Traditional GIS only maps this surface layer; <strong>GeoVoxel 3D</strong> maps vertical 3D property units within buildings.
            </p>
          </div>

          {/* Specifications */}
          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              Cadastral Land Record
            </h4>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Survey Number</span>
              <span className="font-mono font-bold text-[#1E293B]">{parcel.surveyNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Plot Area</span>
              <span className="font-medium text-[#1E293B]">{parcel.areaSqMeters} m² ({parcel.areaHectares} Ha)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Registered Owner</span>
              <span className="font-medium text-[#1E293B] truncate max-w-[140px]">{parcel.ownerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Land Use</span>
              <span className="font-medium text-[#1E293B]">{parcel.landUse}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Title Status</span>
              <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {parcel.status}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Superstructure</span>
              <span className="font-semibold text-[#64748B]">None (Vacant)</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. ELEVATOR SELECTED
  if (elevator) {
    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">{elevator.name}</h2>
              <p className="text-[11px] text-[#64748B]">{elevator.buildingName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Type:</span>
              <span className="font-semibold text-[#1E293B]">{elevator.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Serves:</span>
              <span className="font-semibold text-[#1E293B]">{elevator.serves}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status:</span>
              <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                {elevator.status}
              </span>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              Technical Specifications
            </h4>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Rated Capacity</span>
              <span className="font-medium text-[#1E293B]">{elevator.capacity}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Operating Speed</span>
              <span className="font-medium text-[#1E293B]">{elevator.speed}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Manufacturer</span>
              <span className="font-medium text-[#1E293B]">{elevator.manufacturer}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Last Inspected</span>
              <span className="font-medium text-[#1E293B]">{elevator.lastInspection}</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 3. PIPELINE / BUILDING UTILITY SELECTED
  if (buildingUtility) {
    const isWater = buildingUtility.utilityType === 'Water Pipeline';
    const isDrain = buildingUtility.utilityType === 'Drainage Pipeline';
    const isPower = buildingUtility.utilityType === 'Electrical Conduit';

    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: buildingUtility.color }}
            >
              {isWater && <Droplets className="w-4 h-4" />}
              {isDrain && <ShieldCheck className="w-4 h-4" />}
              {isPower && <Zap className="w-4 h-4" />}
              {!isWater && !isDrain && !isPower && <Radio className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">{buildingUtility.name}</h2>
              <p className="text-[11px] text-[#64748B]">{buildingUtility.buildingName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Utility Type:</span>
              <span className="font-semibold text-[#1E293B]">{buildingUtility.utilityType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Route:</span>
              <span className="font-semibold text-[#1E293B]">{buildingUtility.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status:</span>
              <span className="font-semibold text-[#16A34A]">{buildingUtility.status}</span>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              Pipeline Specifications
            </h4>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Diameter</span>
              <span className="font-medium text-[#1E293B]">{buildingUtility.diameterMm} mm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Material</span>
              <span className="font-medium text-[#1E293B] truncate max-w-[150px]">{buildingUtility.material}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Connection Point</span>
              <span className="font-medium text-[#1E293B] truncate max-w-[150px]">{buildingUtility.connectionPoint}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Last Inspected</span>
              <span className="font-medium text-[#1E293B]">{buildingUtility.lastInspected}</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 4. BASEMENT SELECTED
  if (floorNumber !== null && floorNumber < 0 && !unit) {
    const isB1 = floorNumber === -1;
    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#0F172A] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-[#38BDF8]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{isB1 ? 'Basement 1 (Level -1)' : 'Basement 2 (Level -2)'}</h2>
              <p className="text-[11px] text-slate-400">{building?.name || 'Block A'} · Subterranean Infrastructure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Strict Notice: ZERO FLATS IN BASEMENT */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-lg space-y-1.5">
            <span className="font-bold text-[#1E40AF] flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Dedicated Utility &amp; Parking Level</span>
            </span>
            <p className="text-[11px] text-[#1E3A8A] leading-relaxed">
              <strong>Strictly Zero Residential Flats.</strong> Under urban cadastral bylaws, subterranean levels are reserved solely for vehicle parking, emergency staircases, backup DG generators, and mechanical pump equipment.
            </p>
          </div>

          {/* Depth & Dimensional Specs */}
          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2 bg-[#F8FAFC]">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              Subterranean Engineering Specs
            </h4>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Depth Below Ground</span>
              <span className="font-bold font-mono text-[#0F172A]">{isB1 ? '-3.0 meters' : '-6.0 meters'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Clear Vertical Height</span>
              <span className="font-semibold text-[#0F172A]">3.0 meters ceiling clearance</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Structural Footprint</span>
              <span className="font-semibold text-[#0F172A]">19.0m × 19.0m (361 m²)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Ventilation &amp; Exhaust</span>
              <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                Forced Mechanical Louvers
              </span>
            </div>
          </div>

          {/* Installed Subterranean Infrastructure */}
          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2.5">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              {isB1 ? 'Basement 1 Equipment & Facilities' : 'Basement 2 Equipment & Facilities'}
            </h4>

            {isB1 ? (
              <div className="space-y-2">
                <div className="p-2 bg-[#F1F5F9] rounded border border-[#E2E8F0]">
                  <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                    <span>🚗 Resident Car Parking</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">14 Slots</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Demarcated parking bays with wheel-stoppers &amp; epoxy floor coating.</div>
                </div>

                <div className="p-2 bg-[#ECFDF5] rounded border border-[#A7F3D0]">
                  <div className="font-semibold text-[#065F46] flex items-center justify-between">
                    <span>⚡ Standby Diesel Generator (DG Set)</span>
                    <span className="text-[10px] bg-[#059669] text-white px-1.5 py-0.5 rounded font-bold">500 kVA</span>
                  </div>
                  <div className="text-[11px] text-[#047857] mt-0.5">Acoustic soundproof canopy, auto-mains failure (AMF) panel, overhead exhaust riser.</div>
                </div>

                <div className="p-2 bg-[#EFF6FF] rounded border border-[#BFDBFE]">
                  <div className="font-semibold text-[#1E40AF] flex items-center justify-between">
                    <span>🪜 Emergency Fire Stairwell Core</span>
                    <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-bold">Pressurized</span>
                  </div>
                  <div className="text-[11px] text-[#1E3A8A] mt-0.5">Reinforced 2-hour fire-rated concrete core connecting B2, B1, and Ground Exit.</div>
                </div>

                <div className="p-2 bg-[#FFFBEB] rounded border border-[#FDE68A]">
                  <div className="font-semibold text-[#92400E] flex items-center justify-between">
                    <span>🔌 Main 11kV Electrical Substation</span>
                    <span className="text-[10px] bg-[#D97706] text-white px-1.5 py-0.5 rounded font-bold">Substation</span>
                  </div>
                  <div className="text-[11px] text-[#B45309] mt-0.5">Dry-type transformer, LT breaker panel, busduct feeder to upper riser.</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2 bg-[#F1F5F9] rounded border border-[#E2E8F0]">
                  <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                    <span>🚙 Visitor Parking &amp; EV Bays</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">12 Slots</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Equipped with 22kW AC Type-2 rapid vehicle charging stations.</div>
                </div>

                <div className="p-2 bg-[#EFF6FF] rounded border border-[#BFDBFE]">
                  <div className="font-semibold text-[#1E40AF] flex items-center justify-between">
                    <span>💧 Hydro-Pneumatic Booster Pumps</span>
                    <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-bold">Triple Unit</span>
                  </div>
                  <div className="text-[11px] text-[#1E3A8A] mt-0.5">Constant pressure booster pumping system feeding residential risers.</div>
                </div>

                <div className="p-2 bg-[#FEF2F2] rounded border border-[#FECACA]">
                  <div className="font-semibold text-[#991B1B] flex items-center justify-between">
                    <span>🧯 Fire Sump &amp; Sprinkler Reservoir</span>
                    <span className="text-[10px] bg-[#DC2626] text-white px-1.5 py-0.5 rounded font-bold">100,000 L</span>
                  </div>
                  <div className="text-[11px] text-[#B91C1C] mt-0.5">Dedicated underground fire safety water storage tank with main diesel jockey pump.</div>
                </div>

                <div className="p-2 bg-[#ECFDF5] rounded border border-[#A7F3D0]">
                  <div className="font-semibold text-[#065F46] flex items-center justify-between">
                    <span>⚙️ Auxiliary Generator Fuel Day Tank</span>
                    <span className="text-[10px] bg-[#059669] text-white px-1.5 py-0.5 rounded font-bold">990 L</span>
                  </div>
                  <div className="text-[11px] text-[#047857] mt-0.5">Underground bunded diesel fuel storage for 48-hour continuous power backup.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  }

  // 5. UNIT / FLAT SELECTED
  if (unit) {
    const isConflict = unit.unitNumber === '402' || unit.hasConflict;

    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isConflict ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }`}>
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                isConflict
                  ? 'bg-[#DC2626] text-white shadow-md animate-pulse'
                  : 'bg-[#2563EB] text-white shadow-xs'
              }`}
            >
              {unit.unitNumber}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <span>{unit.unitNumber === 'PH-01' ? 'Penthouse (PH-01)' : `Flat ${unit.unitNumber}`}</span>
                {isConflict && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#DC2626] text-white rounded font-bold tracking-wider">
                    ENCROACHMENT
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {unit.floorName} · {building?.name || 'Building'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {/* SPATIAL CONFLICT ENCROACHMENT HIGHLIGHT CARD */}
          {isConflict && (
            <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-xl p-3.5 space-y-2.5 shadow-md">
              <div className="flex items-center gap-2 text-[#DC2626] font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span className="uppercase tracking-wide">
                  {unit.buildingId === 'bldg-house-1'
                    ? 'Road Encroachment Error Detected'
                    : unit.buildingId === 'bldg-house-2'
                    ? 'Boundary Demarcation Transgression'
                    : '3D Cadastral Encroachment Violation'}
                </span>
              </div>
              <p className="text-[11px] text-[#991B1B] leading-relaxed">
                {unit.buildingId === 'bldg-house-1' ? (
                  <>
                    This individual house compound, entrance portico, and paved driveway occupy{' '}
                    <strong>2.2 meters into the public street right-of-way</strong> beyond its legal survey boundary.
                  </>
                ) : unit.buildingId === 'bldg-house-2' ? (
                  <>
                    This individual house rear wing and patio were constructed{' '}
                    <strong>1.6 meters beyond demarcated land</strong> into the adjacent government reserve.
                  </>
                ) : (
                  <>
                    This unit exhibits a <strong>3D spatial overhang cantilever</strong> crossing over the cadastral parcel setback line into adjacent airspace.
                  </>
                )}
              </p>

              <div className="space-y-1.5 bg-white/80 p-2.5 rounded-lg border border-[#FCA5A5] text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#991B1B]">
                    {unit.buildingId === 'bldg-house-1'
                      ? 'Road Carriage Overlap:'
                      : unit.buildingId === 'bldg-house-2'
                      ? 'Land Overstep Distance:'
                      : 'Cantilever Overhang:'}
                  </span>
                  <span className="font-bold text-[#DC2626]">
                    {unit.buildingId === 'bldg-house-1'
                      ? '+2.20 meters into public street'
                      : unit.buildingId === 'bldg-house-2'
                      ? '+1.60 meters beyond parcel boundary'
                      : '+1.60 meters over boundary'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#991B1B]">Affected Area:</span>
                  <span className="font-bold text-[#DC2626]">
                    {unit.buildingId === 'bldg-house-1'
                      ? '355.2 sq.ft (33.0 m²)'
                      : unit.buildingId === 'bldg-house-2'
                      ? '223.8 sq.ft (20.8 m²)'
                      : '18.4 sq.ft (1.71 m²)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#991B1B]">Boundary Affected:</span>
                  <span className="font-bold text-[#DC2626]">
                    {unit.buildingId === 'bldg-house-1'
                      ? 'South Public Street Right-of-Way'
                      : unit.buildingId === 'bldg-house-2'
                      ? 'East Cadastral Survey Boundary (Plot 47/B)'
                      : 'North-East Setback Line'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#991B1B]">Regulatory Clause:</span>
                  <span className="font-mono text-[#DC2626]">
                    {unit.buildingId === 'bldg-house-1'
                      ? 'Sec 231 Municipal Corp Act'
                      : unit.buildingId === 'bldg-house-2'
                      ? 'Sec 132 Maharashtra Land Revenue Code'
                      : 'Section 42(b) Bylaws'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#991B1B]">Legal Action Status:</span>
                  <span className="font-bold text-[#DC2626] uppercase">
                    {unit.buildingId === 'bldg-house-1'
                      ? 'DEMOLITION / CLEARANCE NOTICE'
                      : unit.buildingId === 'bldg-house-2'
                      ? 'SUMMONS ISSUED (HEARING SCHEDULED)'
                      : 'FROZEN (SHOW CAUSE ISSUED)'}
                  </span>
                </div>
              </div>

              {onOpenEncroachmentNotice && (
                <button
                  onClick={onOpenEncroachmentNotice}
                  className="w-full p-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Official Encroachment Deed & Notice</span>
                </button>
              )}
            </div>
          )}

          {/* 3D-ULPIN Identifier */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 space-y-1">
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider block">
              3D-ULPIN (Unique Property Identifier)
            </span>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[11px] text-[#1E3A8A] font-bold truncate">
                {unit.ulpin3D}
              </span>
              <button
                onClick={() => handleCopyUlpin(unit.ulpin3D)}
                className="p-1 hover:bg-[#E2E8F0] rounded text-[#64748B] transition-colors cursor-pointer"
                title="Copy ULPIN"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* COMPREHENSIVE PROPERTY SPECIFICATIONS: OWNER, TAX, AREA, HEIGHT */}
          <div className="border border-[#E2E8F0] rounded-xl p-3.5 space-y-2.5 bg-white shadow-xs">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B] pb-1 border-b border-[#F1F5F9] flex items-center justify-between">
              <span>Cadastral Property Record</span>
              <span className="text-[10px] font-normal text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">Verified Deed</span>
            </h4>

            {/* 1. REGISTERED OWNER */}
            <div className="py-1 border-b border-[#F1F5F9]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Registered Legal Owner</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-bold text-xs text-[#0F172A]">{unit.ownerName}</span>
              </div>
            </div>

            {/* 2. TAX STATUS */}
            <div className="py-1 border-b border-[#F1F5F9]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Property Tax Status</span>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    unit.taxStatus === 'Paid'
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{unit.taxStatus === 'Paid' ? 'Paid & Up to Date' : 'Assessment Pending'}</span>
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">AY 2025-2026</span>
              </div>
            </div>

            {/* 3. AREA SPECIFICATIONS */}
            <div className="py-1 border-b border-[#F1F5F9] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Area Measurements</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-[#F8FAFC] p-1.5 rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Carpet Area:</span>
                  <span className="font-bold text-xs text-[#0F172A]">{unit.areaSqFt} sq.ft</span>
                  <span className="text-[10px] text-[#64748B] block">({unit.areaSqM} m²)</span>
                </div>
                <div className="bg-[#F8FAFC] p-1.5 rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Land Share (UDS):</span>
                  <span className="font-bold text-xs text-[#2563EB]">{unit.landSharePercent}%</span>
                  <span className="text-[10px] text-[#64748B] block">Undivided Share</span>
                </div>
              </div>
            </div>

            {/* 4. 3D HEIGHT & VERTICAL ELEVATION */}
            <div className="py-1 border-b border-[#F1F5F9] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">3D Height &amp; Elevation (Z-Axis)</span>
              <div className="space-y-1 mt-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Ceiling Clear Height:</span>
                  <span className="font-bold text-[#0F172A]">{unit.ceilingHeightM || 2.9} meters (9.5 ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Elevation Above Ground:</span>
                  <span className="font-bold text-[#2563EB]">+{unit.heightAboveGroundM ?? (unit.floorNumber * 3.0)} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Absolute Elevation (MSL):</span>
                  <span className="font-mono text-[#0F172A]">{(542.3 + (unit.heightAboveGroundM ?? (unit.floorNumber * 3.0))).toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">3D Volume Bounding:</span>
                  <span className="font-mono text-[#64748B]">8.0m × 8.0m × 2.9m</span>
                </div>
              </div>
            </div>

            {/* 5. PROPERTY TYPE & LAYOUT */}
            <div className="py-1">
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748B]">Property Type</span>
                <span className="font-medium text-[#0F172A]">{unit.propertyType}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748B]">Spatial Layout</span>
                <span className="font-medium text-[#0F172A] truncate max-w-[150px]">{unit.rooms || '3 BHK Flat'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748B]">Cadastral Survey No</span>
                <span className="font-mono font-bold text-[#0F172A]">{unit.surveyNumber}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748B]">Deed Registration</span>
                <span className="font-medium text-[#0F172A]">{unit.registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Role specific section */}
          {userRole === 'citizen' ? (
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg space-y-1.5">
              <div className="flex items-center gap-1 text-[#1E40AF] font-bold">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Citizen Verification Status</span>
              </div>
              <p className="text-[11px] text-[#1E3A8A]">
                Title verified under Maharashtra Land Revenue Code 1966. No pending municipal property tax arrears recorded for Assessment Year 2025-26.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg space-y-1.5">
              <div className="flex items-center gap-1 text-[#92400E] font-bold">
                <Shield className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Government Cadastral Audit</span>
              </div>
              <p className="text-[11px] text-[#B45309]">
                Vertical vector: Z=+{unit.heightAboveGroundM}m · Survey parcel: {unit.surveyNumber} · GIS Verification: {unit.verificationStatus}
              </p>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 6. FLOOR SELECTED
  if (floorNumber !== null) {
    const flName =
      floorNumber === 6
        ? 'Penthouse'
        : floorNumber === 0
        ? 'Ground Floor'
        : `Floor ${floorNumber}`;

    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">{flName}</h2>
              <p className="text-[11px] text-[#64748B]">{building?.name || 'Building'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Elevation:</span>
              <span className="font-bold text-[#2563EB]">
                {floorNumber === 6 ? '+18.5 m' : `+${floorNumber * 3.0} m`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Units Count:</span>
              <span className="font-semibold text-[#1E293B]">
                {floorNumber === 6 ? '1 Penthouse Suite' : 'Flats on Floor'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status:</span>
              <span className="font-semibold text-[#16A34A]">Operational</span>
            </div>
          </div>

          {floorNumber === 4 && building?.id === 'bldg-a' && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-md p-3 space-y-1">
              <div className="flex items-center gap-1 text-[#DC2626] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Notice: Flat 402 Conflict</span>
              </div>
              <p className="text-[11px] text-[#7F1D1D]">
                Flat 402 on this floor has an active boundary overhang dispute.
              </p>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 7. BUILDING / BLOCK SELECTED
  if (building) {
    return (
      <aside className="w-80 md:w-88 bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-xl z-20 overflow-y-auto font-sans">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">{building.name}</h2>
              <p className="text-[11px] text-[#64748B]">{building.surveyNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Total Levels:</span>
              <span className="font-bold text-[#2563EB]">{building.totalFloors} Floors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Building Type:</span>
              <span className="font-semibold text-[#1E293B]">{building.buildingType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Survey Number:</span>
              <span className="font-mono text-[#1E3A8A] font-semibold">{building.surveyNumber}</span>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-md p-3 space-y-2">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#64748B]">
              Inspection Instructions
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Use the bottom Property Hierarchy or left sidebar to inspect specific floors, individual flats, basements, and elevator systems.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
