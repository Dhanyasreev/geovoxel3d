import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, X, ArrowRight, Loader2 } from 'lucide-react';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataIngested?: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onDataIngested,
}) => {
  const [selectedFileType, setSelectedFileType] = useState<'DXF' | 'GeoJSON' | 'PDF' | 'LAS'>('GeoJSON');
  const [fileState, setFileState] = useState<{
    name: string;
    size: string;
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'success';
  }>({
    name: 'viman_nagar_cadastre_revised.geojson',
    size: '3.4 MB',
    progress: 0,
    status: 'idle',
  });

  if (!isOpen) return null;

  const handleStartImport = () => {
    setFileState((prev) => ({ ...prev, status: 'uploading', progress: 15 }));

    const timer1 = setTimeout(() => {
      setFileState((prev) => ({ ...prev, progress: 65, status: 'processing' }));
    }, 600);

    const timer2 = setTimeout(() => {
      setFileState((prev) => ({ ...prev, progress: 100, status: 'success' }));
      if (onDataIngested) onDataIngested();
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toUpperCase() as any;
      if (['DXF', 'GEOJSON', 'PDF', 'LAS'].includes(ext)) {
        setSelectedFileType(ext);
      }
      setFileState({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        progress: 0,
        status: 'idle',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs select-none p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-md">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Spatial Data Ingestion
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Import 2D/3D Cadastral Surveys and Architectural Models
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

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Format Selector */}
          <div>
            <label className="text-xs font-semibold text-[#1F2937] block mb-1.5">
              Supported Data Formats
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['GeoJSON', 'DXF', 'LAS', 'PDF'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    setSelectedFileType(fmt);
                    setFileState((prev) => ({
                      ...prev,
                      name: `survey_layer_data.${fmt.toLowerCase()}`,
                      status: 'idle',
                      progress: 0,
                    }));
                  }}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                    selectedFileType === fmt
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-bold shadow-xs'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="p-4 border-2 border-dashed border-[#D1D5DB] rounded-xl text-center bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".geojson,.dxf,.las,.pdf,.json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileCode className="w-8 h-8 text-[#9CA3AF] mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-[#1F2937]">
              Click to select or drag &amp; drop spatial file
            </div>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Auto-projects to UTM Zone 43N &amp; generates 3D volumetric parcels
            </p>
          </div>

          {/* Selected File & Progress Card */}
          <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#1F2937]">{fileState.name}</span>
                <span className="text-[10px] text-[#6B7280] ml-2 font-mono">
                  {fileState.size} · {selectedFileType}
                </span>
              </div>
              <span className="font-mono text-xs text-[#2563EB] font-bold">
                {fileState.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full transition-all duration-300 rounded-full"
                style={{ width: `${fileState.progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>
                Processing Status:{' '}
                <span className="font-medium text-[#1F2937]">
                  {fileState.status === 'idle' && 'Ready for parsing'}
                  {fileState.status === 'uploading' && 'Uploading spatial polygons...'}
                  {fileState.status === 'processing' && 'Triangulating 3D floor slabs...'}
                  {fileState.status === 'success' && 'Completed'}
                </span>
              </span>
              {fileState.status === 'processing' && (
                <Loader2 className="w-3.5 h-3.5 text-[#2563EB] animate-spin" />
              )}
            </div>
          </div>

          {/* Success Message as required in #19 */}
          {fileState.status === 'success' && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#166534] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Data processed successfully</span>
              </div>
              <p className="text-[11px] text-[#15803D]">
                24 property geometries generated. 3D building floors and units mapped to cadastral grid.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-[#4B5563] hover:text-[#1F2937] rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={fileState.status === 'success' ? onClose : handleStartImport}
            disabled={fileState.status === 'processing'}
            className="px-4 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-md hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {fileState.status === 'idle' && 'Ingest & Process Data'}
            {fileState.status === 'processing' && 'Processing...'}
            {fileState.status === 'success' && 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
