import React from 'react';
import {
  Map,
  Layers,
  Sliders,
  AlertTriangle,
  Activity,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface StatusBarProps {
  onResetMapView: () => void;
  isHierarchyOpen: boolean;
  onToggleHierarchy: () => void;
  isLayersOpen: boolean;
  onToggleLayers: () => void;
  isEncroachmentActive: boolean;
  onToggleEncroachment: () => void;
  isUtilitiesOpen: boolean;
  onToggleUtilities: () => void;
  isDetailsOpen: boolean;
  onToggleDetails: () => void;
  propertyCount: number;
  buildingCount: number;
  floorCount: number;
  lastSync: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  onResetMapView,
  isHierarchyOpen,
  onToggleHierarchy,
  isLayersOpen,
  onToggleLayers,
  isEncroachmentActive,
  onToggleEncroachment,
  isUtilitiesOpen,
  onToggleUtilities,
  isDetailsOpen,
  onToggleDetails,
  propertyCount,
  buildingCount,
  floorCount,
  lastSync,
}) => {
  return (
    <footer className="h-11 bg-white border-t border-[#E5E7EB] px-3 sm:px-4 flex items-center justify-between text-xs text-[#6B7280] shrink-0 select-none z-30 font-sans shadow-sm">
      {/* Bottom Navigation Buttons (Sections 8 & 20) */}
      <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Bottom Navigation">
        {/* 1. Map View */}
        <button
          onClick={onResetMapView}
          className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#1F2937] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Return to Complete Neighborhood 3D Map View"
        >
          <Map className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Map View</span>
        </button>

        {/* 2. Property Hierarchy - THE SINGLE SOLE INSTANCE IN THE APP */}
        <button
          onClick={onToggleHierarchy}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isHierarchyOpen
              ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#1F2937]'
          }`}
          title="Open Property Hierarchy Registry"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Property Hierarchy</span>
        </button>

        {/* 3. Layers */}
        <button
          onClick={onToggleLayers}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isLayersOpen
              ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#1F2937]'
          }`}
          title="Toggle Layers Control"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>

        {/* 4. Encroachment */}
        <button
          onClick={onToggleEncroachment}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isEncroachmentActive
              ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] font-semibold shadow-xs'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#1F2937]'
          }`}
          title="Inspect Encroachment Conflict (Flat 402)"
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${isEncroachmentActive ? 'text-[#DC2626]' : 'text-[#D97706]'}`} />
          <span>Encroachment</span>
        </button>

        {/* 5. Utilities */}
        <button
          onClick={onToggleUtilities}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isUtilitiesOpen
              ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#1F2937]'
          }`}
          title="Inspect Underground Utility Pipelines"
        >
          <Activity className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Utilities</span>
        </button>

        {/* 6. Property Details */}
        <button
          onClick={onToggleDetails}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDetailsOpen
              ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#1F2937]'
          }`}
          title="Toggle Property Details Panel"
        >
          <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Property Details</span>
        </button>
      </nav>

      {/* Right GIS Status Metrics */}
      <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-1.5 text-[#16A34A] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>Online</span>
        </div>

        <span className="text-[#D1D5DB]" aria-hidden="true">|</span>

        <div className="flex items-center gap-2 text-[#4B5563]">
          <span>
            <strong className="font-semibold text-[#1F2937] font-mono">{propertyCount}</strong> Properties
          </span>
          <span className="text-[#D1D5DB]" aria-hidden="true">·</span>
          <span>
            <strong className="font-semibold text-[#1F2937] font-mono">{buildingCount}</strong> Buildings
          </span>
          <span className="text-[#D1D5DB]" aria-hidden="true">·</span>
          <span>
            <strong className="font-semibold text-[#1F2937] font-mono">{floorCount}</strong> Floors
          </span>
        </div>

        <span className="text-[#D1D5DB]" aria-hidden="true">|</span>

        <span>
          Datum: <span className="font-mono text-[#4B5563]">EPSG:32643</span>
        </span>
      </div>
    </footer>
  );
};
