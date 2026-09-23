import React from 'react';
import { Activity, Droplet, Zap, GitCommit, Layers, X, ShieldAlert } from 'lucide-react';
import { UndergroundUtility } from '../types/gis';

interface UtilityModalProps {
  utility: UndergroundUtility | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UtilityModal: React.FC<UtilityModalProps> = ({ utility, isOpen, onClose }) => {
  if (!isOpen || !utility) return null;

  const getIcon = () => {
    switch (utility.type) {
      case 'Water Pipeline':
        return <Droplet className="w-4 h-4 text-[#0284C7]" />;
      case 'Power Cable':
        return <Zap className="w-4 h-4 text-[#D97706]" />;
      case 'Drainage Sewer':
        return <Layers className="w-4 h-4 text-[#0D9488]" />;
      case 'Optical Fiber':
        return <Activity className="w-4 h-4 text-[#7C3AED]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-md w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#F3F4F6] rounded-md">{getIcon()}</div>
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">UTILITY DETAILS</h3>
              <p className="text-[11px] text-[#6B7280]">
                Subsurface Municipal Infrastructure Layer
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

        {/* Content */}
        <div className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Type</div>
              <div className="font-bold text-[#1F2937] text-sm mt-0.5">
                {utility.type}
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">ID</div>
              <div className="font-bold text-[#1F2937] text-sm mt-0.5 font-mono">
                {utility.utilityCode}
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Depth Below Ground</div>
              <div className="font-bold text-[#2563EB] text-sm mt-0.5 font-mono">
                {utility.depthM} m
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Status</div>
              <div className="font-semibold text-[#16A34A] text-sm mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                <span>{utility.status}</span>
              </div>
            </div>

            <div className="col-span-2 p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Specifications &amp; Material</div>
              <div className="font-medium text-[#1F2937] mt-0.5">
                {utility.material} · Ø{utility.diameterMm}mm
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Flow / Conduit</div>
              <div className="font-medium text-[#1F2937] mt-0.5">
                {utility.flowDirection}
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Last Inspected</div>
              <div className="font-medium text-[#1F2937] mt-0.5 font-mono">
                {utility.lastInspected}
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-[11px] text-[#1E40AF]">
            Integrated into 3D cadastral volume to prevent digging damage during foundation and piling works.
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
