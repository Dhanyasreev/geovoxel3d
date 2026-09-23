import React from 'react';
import { Info, Cpu, Map, Globe, Database, CheckCircle2, X } from 'lucide-react';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-md w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-md">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Cadastral System Specifications
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                GeoVoxel 3D Spatial Engine &amp; Spatial Reference System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical specs table */}
        <div className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2563EB]" />
              <span>3D Engine</span>
            </span>
            <span className="font-semibold text-[#1F2937]">Three.js (WebGL 2.0)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Map className="w-4 h-4 text-[#2563EB]" />
              <span>Spatial Data Model</span>
            </span>
            <span className="font-semibold text-[#1F2937]">GeoJSON / Volumetric 3D Mesh</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2563EB]" />
              <span>Coordinate System</span>
            </span>
            <span className="font-semibold text-[#1F2937] font-mono">UTM Zone 43N (EPSG: 32643)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2563EB]" />
              <span>Vertical Datum</span>
            </span>
            <span className="font-semibold text-[#1F2937]">WGS84 Ellipsoid / Above Ground Level</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Data Status</span>
            </span>
            <span className="font-semibold text-[#16A34A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
              <span>Synchronized</span>
            </span>
          </div>

          <div className="pt-2 text-[11px] text-[#6B7280] leading-relaxed">
            Standardized for Smart India Hackathon cadastral compliance: assigns a vertical ULPIN subdivision string without relying on high-cost proprietary GIS licenses.
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-md hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
