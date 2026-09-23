import React from 'react';
import { History, Calendar, CheckCircle2, FileCheck, Layers, X } from 'lucide-react';
import { PropertyHistoryEvent, PropertyUnit } from '../types/gis';

interface PropertyHistoryModalProps {
  unit: PropertyUnit | null;
  history: PropertyHistoryEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyHistoryModal: React.FC<PropertyHistoryModalProps> = ({
  unit,
  history,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-md">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Property History &amp; Cadastral Ledger
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                {unit ? `Flat ${unit.unitNumber}, Building A (Survey ${unit.surveyNumber})` : 'Cadastral Timeline'}
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

        {/* Clean Vertical Timeline */}
        <div className="p-5 max-h-96 overflow-y-auto">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
            {history.map((evt, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#2563EB]">
                      {evt.year}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">•</span>
                    <span className="text-[11px] text-[#6B7280]">{evt.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#1F2937] mt-0.5">
                    {evt.title}
                  </h4>

                  <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-2 text-[10px] text-[#6B7280] flex items-center justify-between bg-[#F9FAFB] px-2 py-1 rounded border border-[#E5E7EB]">
                    <span>Authority: {evt.authority}</span>
                    {evt.documentRef && (
                      <span className="font-mono font-medium text-[#1F2937]">
                        Ref: {evt.documentRef}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center text-xs text-[#6B7280]">
          <span>Source: Digital Land Records Haveli Sub-Division</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-[#D1D5DB] rounded-md text-xs font-medium text-[#1F2937] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
