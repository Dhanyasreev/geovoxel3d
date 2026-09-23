import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle2, FileText, ChevronRight, X } from 'lucide-react';
import { EncroachmentRecord } from '../types/gis';

interface EncroachmentPanelProps {
  encroachment: EncroachmentRecord;
  isOpen: boolean;
  onClose: () => void;
  onZoomToEncroachment: () => void;
}

export const EncroachmentPanel: React.FC<EncroachmentPanelProps> = ({
  encroachment,
  isOpen,
  onClose,
  onZoomToEncroachment,
}) => {
  const [showNoticeDetails, setShowNoticeDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FEF2F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#FEE2E2] text-[#DC2626] rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#991B1B]">
                ENCROACHMENT ANALYSIS
              </h3>
              <p className="text-[11px] text-[#B91C1C]">
                Spatial overlap detected in 3D cadastral boundary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded hover:bg-white/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#EFF6FF] p-2.5 rounded-lg border border-[#BFDBFE]">
              <div className="text-[10px] text-[#2563EB] font-medium">Property</div>
              <div className="font-bold text-[#1E3A8A] text-sm mt-0.5">
                {encroachment.flatNumber || 'Flat 402'}
              </div>
            </div>

            <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Building</div>
              <div className="font-semibold text-[#1F2937] text-sm mt-0.5">
                {encroachment.buildingName || 'Building A'}
              </div>
            </div>

            <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Survey</div>
              <div className="font-semibold text-[#1F2937] text-sm mt-0.5 font-mono">
                {encroachment.primaryParcel.replace('Survey ', '')}
              </div>
            </div>

            <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Floor</div>
              <div className="font-semibold text-[#1F2937] text-sm mt-0.5">
                {encroachment.floorNumber || 4}
              </div>
            </div>

            <div className="col-span-2 bg-[#FEF2F2] p-2.5 rounded-lg border border-[#FECACA]">
              <div className="text-[10px] text-[#991B1B]">Status</div>
              <div className="font-bold text-[#DC2626] text-sm mt-0.5">
                {encroachment.status || 'Potential 3D Boundary Conflict'}
              </div>
            </div>

            <div className="bg-[#FEF2F2] p-2.5 rounded-lg border border-[#FECACA]">
              <div className="text-[10px] text-[#991B1B]">Affected Area</div>
              <div className="font-bold text-[#DC2626] text-sm mt-0.5 font-mono">
                {encroachment.affectedAreaSqFt} sq.ft
              </div>
              <div className="text-[10px] text-[#B91C1C]">({encroachment.affectedAreaSqM} sq.m)</div>
            </div>

            <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Affected Side</div>
              <div className="font-semibold text-[#1F2937] text-sm mt-0.5">
                {encroachment.affectedSide || encroachment.affectedBoundary}
              </div>
            </div>

            <div className="col-span-2 bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Confidence</div>
              <div className="font-semibold text-[#16A34A] text-sm mt-0.5 font-mono">
                {encroachment.confidenceScore}%
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-[#4B5563] leading-relaxed">
            <span className="font-semibold text-[#1F2937]">Cadastral Summary: </span>
            {encroachment.summary}
          </div>

          {showNoticeDetails && (
            <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg text-xs space-y-1.5 text-[#92400E]">
              <div className="font-bold">
                {encroachment.legalActReference || 'Notice Recommendation (Section 132 Land Revenue Code)'}:
              </div>
              <p className="text-[11px] leading-relaxed">
                {encroachment.id === 'enc-house-1'
                  ? 'Municipal Road Encroachment Notice: Under Section 231 of the Municipal Corporation Act, constructing gates, porches, or compound walls beyond demarcated property limits into public street carriageways is prohibited. Notice issued for clearance.'
                  : encroachment.id === 'enc-house-2'
                  ? 'Demarcation Transgression Notice: Under Section 132 of the Maharashtra Land Revenue Code 1966, construction extending 1.6m across survey boundary lines into adjacent public land requires immediate rectification or regularization hearing.'
                  : 'Vertical 3D setback verification confirmed: Ground floor and floors 1-3 have standard 4.5m boundary setback. Floor 4 cantilever balcony extends 0.38m into vertical column easement of Survey 42/C.'}
              </p>
            </div>
          )}

          {/* Action Buttons requested in #15 */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setShowNoticeDetails(!showNoticeDetails)}
              className="px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:text-[#1F2937] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              {showNoticeDetails ? 'Hide Details' : 'Details'}
            </button>
            <button
              onClick={() => {
                onZoomToEncroachment();
                onClose();
              }}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View on Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
