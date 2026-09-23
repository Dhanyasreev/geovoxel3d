import React, { useState } from 'react';
import { GitBranch, FileText, CheckCircle2, Download, ExternalLink, X, ArrowRight } from 'lucide-react';
import { MutationRecord } from '../types/gis';

interface MutationHistoryModalProps {
  mutation: MutationRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const MutationHistoryModal: React.FC<MutationHistoryModalProps> = ({
  mutation,
  isOpen,
  onClose,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-md">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1F2937]">
                  Mutation #{mutation.mutationNumber}
                </h3>
                <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                  {mutation.status}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Digital Land Mutation &amp; Title Transfer Record
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

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Ownership Transfer Transition Box */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#6B7280]">Previous Owner</div>
              <div className="text-xs font-bold text-[#1F2937] mt-0.5">
                {mutation.previousOwner}
              </div>
              <span className="text-[10px] text-[#9CA3AF]">Seller / Transferor</span>
            </div>

            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] text-[#2563EB] font-medium">{mutation.reason}</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB] my-0.5" />
              <span className="text-[10px] text-[#6B7280]">{mutation.date}</span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#6B7280]">New Owner</div>
              <div className="text-xs font-bold text-[#16A34A] mt-0.5">
                {mutation.newOwner}
              </div>
              <span className="text-[10px] text-[#9CA3AF]">Title Holder</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Survey &amp; Unit</div>
              <div className="font-semibold text-[#1F2937] mt-0.5 font-mono">
                {mutation.surveyNumber} · {mutation.unitNumber}
              </div>
            </div>

            <div className="p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Sanction Date</div>
              <div className="font-semibold text-[#1F2937] mt-0.5">
                {mutation.date}
              </div>
            </div>

            <div className="col-span-2 p-2.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="text-[10px] text-[#6B7280]">Noting Revenue Officer</div>
              <div className="font-semibold text-[#1F2937] mt-0.5">
                {mutation.notingOfficer}
              </div>
            </div>
          </div>

          {/* Documents Section requested in #17 */}
          <div>
            <div className="text-xs font-semibold text-[#1F2937] mb-2 flex items-center justify-between">
              <span>Attached Legal &amp; Revenue Documents</span>
              <span className="text-[10px] text-[#6B7280]">{mutation.documents.length} verified files</span>
            </div>

            <div className="space-y-1.5">
              {mutation.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-between hover:border-[#BFDBFE] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-medium text-[#1F2937] truncate">{doc.name}</div>
                      <div className="text-[10px] text-[#6B7280]">
                        {doc.refNo} · {doc.fileSize}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDoc(doc.name)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedDoc && (
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-xs text-[#1E40AF]">
              <div className="font-semibold flex items-center justify-between">
                <span>Document Preview: {selectedDoc}</span>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-[#3B82F6] hover:text-[#1E40AF] text-[11px]"
                >
                  Dismiss
                </button>
              </div>
              <p className="mt-1 text-[11px] text-[#1E3A8A]">
                Digital certified copy verified with Sub-Registrar repository. Hash signature valid.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#6B7280]">Status: Title Mutated in 3D Cadastre</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-md text-xs font-medium hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
