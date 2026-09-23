import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Printer, Download, Check, X, Box, Layers, QrCode } from 'lucide-react';
import { PropertyUnit, CadastralBuilding } from '../types/gis';

interface SpatialDeedModalProps {
  unit: PropertyUnit | null;
  building: CadastralBuilding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpatialDeedModal: React.FC<SpatialDeedModalProps> = ({
  unit,
  building,
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const currentUnit = unit || {
    id: 'unit-a-4-402',
    unitNumber: '402',
    buildingId: 'bldg-a',
    floorNumber: 4,
    floorName: 'Floor 4',
    ownerName: 'Ramesh Kumar',
    surveyNumber: '42/B',
    areaSqFt: 1250,
    areaSqM: 116.1,
    landSharePercent: 2.4,
    taxStatus: 'Paid' as const,
    propertyType: 'Residential' as const,
    verificationStatus: 'Verified' as const,
    ulpin3D: '28-502-14029384721-A-F04-U402',
    heightAboveGroundM: 12.5,
    ceilingHeightM: 2.9,
    rooms: '3 BHK',
    registrationDate: '18-Aug-2021',
    coordinates: { x: -1.5, y: 13.95, z: -10.5, width: 8, depth: 8, height: 2.9 },
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#2563EB]" />
            <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
              Spatial Property Deed Record
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs font-medium text-[#1F2937] bg-white border border-[#D1D5DB] rounded hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Download className="w-3.5 h-3.5 text-[#4B5563]" />}
              <span>{downloaded ? 'Exported' : 'Export PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#9CA3AF] hover:text-[#4B5563] rounded hover:bg-[#E5E7EB] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Interior */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#FCFDFE]">
          {/* Certificate Header with Seal */}
          <div className="border-b-2 border-[#1E3A8A] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/cadastral_emblem_1790148154140.jpg"
                alt="Cadastral Emblem"
                className="w-14 h-14 object-contain rounded-md border border-[#E5E7EB]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <div className="text-[11px] font-bold text-[#1E40AF] uppercase tracking-widest">
                  Government of Maharashtra · Land Records Authority
                </div>
                <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">
                  Spatial Property Deed &amp; 3D-ULPIN Certificate
                </h2>
                <div className="text-[11px] text-[#6B7280]">
                  Haveli Sub-District Cadastral Registry · Form 3D-CP
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#6B7280]">Certificate Serial</div>
              <div className="font-mono text-xs font-bold text-[#1F2937]">SPD-2026-90412</div>
              <span className="inline-block mt-1 text-[9px] bg-[#DCFCE7] text-[#166534] font-semibold px-2 py-0.5 rounded">
                ● Registered &amp; Verified
              </span>
            </div>
          </div>

          {/* 3D-ULPIN Banner */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider">
                Unique 3D Land Parcel Identifier (3D-ULPIN)
              </div>
              <div className="text-sm font-bold font-mono text-[#1E3A8A] mt-0.5">
                {currentUnit.ulpin3D}
              </div>
            </div>
            <div className="text-right text-[10px] text-[#4B5563]">
              <div>Volumetric Voxel Hash: <span className="font-mono text-[#1E40AF]">0x78a4...e9</span></div>
              <div>Z-Datum Elevation: <span className="font-mono">{currentUnit.heightAboveGroundM} m AGL</span></div>
            </div>
          </div>

          {/* Property Identity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Property Unit ID</div>
              <div className="font-bold text-[#1F2937] mt-0.5 font-mono">Flat {currentUnit.unitNumber}</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Cadastral Survey No.</div>
              <div className="font-bold text-[#1F2937] mt-0.5 font-mono">{currentUnit.surveyNumber}</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Title Owner</div>
              <div className="font-bold text-[#1F2937] mt-0.5">{currentUnit.ownerName}</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Registration Date</div>
              <div className="font-bold text-[#1F2937] mt-0.5">{currentUnit.registrationDate}</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Carpet Area</div>
              <div className="font-bold text-[#1F2937] mt-0.5 font-mono">
                {currentUnit.areaSqFt} sq.ft ({currentUnit.areaSqM} m²)
              </div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Vertical Level</div>
              <div className="font-bold text-[#1F2937] mt-0.5">{currentUnit.floorName}</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Undivided Land Share</div>
              <div className="font-bold text-[#1F2937] mt-0.5 font-mono">{currentUnit.landSharePercent}%</div>
            </div>

            <div className="p-2 bg-white rounded border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Property Category</div>
              <div className="font-bold text-[#1F2937] mt-0.5">{currentUnit.propertyType}</div>
            </div>
          </div>

          {/* Simplified 3D Boundary Geometry Diagram */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>3D Spatial Boundary Bounding Box</span>
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">UTM Zone 43N / WGS84</span>
            </div>

            {/* Visual representation of 3D unit bounding box */}
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-white p-3 rounded border border-[#E2E8F0]">
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#6B7280] font-sans font-medium">X Bounds (Easting)</div>
                <div className="text-[#1F2937] font-semibold">min: 374,212.4m</div>
                <div className="text-[#1F2937] font-semibold">max: 374,220.4m</div>
                <div className="text-[10px] text-[#2563EB]">Span: 8.0 m</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-[#6B7280] font-sans font-medium">Y Bounds (Northing)</div>
                <div className="text-[#1F2937] font-semibold">min: 2,051,890.2m</div>
                <div className="text-[#1F2937] font-semibold">max: 2,051,898.2m</div>
                <div className="text-[10px] text-[#2563EB]">Span: 8.0 m</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-[10px] text-[#6B7280] font-sans font-medium">Z Elevation (Height)</div>
                <div className="text-[#1F2937] font-semibold">Floor: 12.5m AGL</div>
                <div className="text-[#1F2937] font-semibold">Ceiling: 15.4m AGL</div>
                <div className="text-[10px] text-[#2563EB]">Clearance: 2.9 m</div>
              </div>
            </div>

            <p className="text-[10px] text-[#6B7280] mt-2 italic">
              * Boundary coordinates validated by terrestrial LiDAR and drone photogrammetric triangulation.
            </p>
          </div>

          {/* Prototype / Sample Record Label as required */}
          <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-md text-center text-xs font-semibold text-[#B45309]">
            Prototype / Sample Record · Smart India Hackathon Demonstration Cadastre
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#6B7280]">
            Cadastral Record Verification Key: <span className="font-mono text-[#1F2937]">GEO-VOXEL-3D-ULPIN-CERT</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
