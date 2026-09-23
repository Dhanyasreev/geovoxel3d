import React from 'react';
import {
  MapPin,
  Layers,
  Building2,
  Box,
  ArrowUpDown,
  Droplets,
  AlertTriangle,
  Search,
  CheckCircle2,
} from 'lucide-react';

export type InspectionMode =
  | 'community'
  | 'floors'
  | 'basements'
  | 'elevators'
  | 'pipelines'
  | 'conflict';

interface LeftSidebarProps {
  currentMode: InspectionMode;
  onChangeMode: (mode: InspectionMode) => void;
  showHierarchy: boolean;
  onToggleHierarchy: () => void;
  activeBuildingName: string;
  onFocusSearch?: () => void;
  activeConflictId?: string;
  onSelectConflict?: (conflictId: string) => void;
}

export const LayerPanel: React.FC<LeftSidebarProps> = ({
  currentMode,
  onChangeMode,
  showHierarchy,
  onToggleHierarchy,
  activeBuildingName,
  onFocusSearch,
  activeConflictId = 'enc-flat-402',
  onSelectConflict,
}) => {
  const menuItems = [
    {
      id: 'community' as InspectionMode,
      label: 'Map',
      description: 'Cadastral Land overview',
      icon: MapPin,
      action: () => onChangeMode('community'),
      active: currentMode === 'community',
      color: 'text-[#2563EB]',
    },
    {
      id: 'hierarchy',
      label: 'Flat Directory & Tree',
      description: 'Browse all units & blocks',
      icon: Layers,
      action: onToggleHierarchy,
      active: showHierarchy,
      color: 'text-[#2563EB]',
    },
    {
      id: 'floors' as InspectionMode,
      label: 'Floors',
      description: 'Ground through Penthouse',
      icon: Building2,
      action: () => onChangeMode('floors'),
      active: currentMode === 'floors',
      color: 'text-[#2563EB]',
    },
    {
      id: 'basements' as InspectionMode,
      label: 'Basements',
      description: 'Basement 1 (-3m) & 2 (-6m)',
      icon: Box,
      action: () => onChangeMode('basements'),
      active: currentMode === 'basements',
      color: 'text-[#2563EB]',
    },
    {
      id: 'elevators' as InspectionMode,
      label: 'Elevators',
      description: 'Elevator E-01 & E-02 shafts',
      icon: ArrowUpDown,
      action: () => onChangeMode('elevators'),
      active: currentMode === 'elevators',
      color: 'text-[#2563EB]',
    },
    {
      id: 'pipelines' as InspectionMode,
      label: 'Pipelines',
      description: 'Water, Drainage, Power, Fiber',
      icon: Droplets,
      action: () => onChangeMode('pipelines'),
      active: currentMode === 'pipelines',
      color: 'text-[#2563EB]',
    },
    {
      id: 'conflict' as InspectionMode,
      label: 'Spatial Conflicts',
      description: '3 Active boundary violations',
      icon: AlertTriangle,
      action: () => onChangeMode('conflict'),
      active: currentMode === 'conflict',
      badge: '3 Conflicts',
      color: 'text-[#DC2626]',
    },
  ];

  const conflictItems = [
    {
      id: 'enc-flat-402',
      name: 'Flat 402 (Apex Residency)',
      subtitle: '+1.6m Airspace Cantilever Overhang',
      tag: 'Airspace Overhang',
    },
    {
      id: 'enc-house-1',
      name: 'Villa Ananda (Plot 46/A)',
      subtitle: '+2.2m Road Encroachment Error',
      tag: 'Road Error',
    },
    {
      id: 'enc-house-2',
      name: 'Green Crest (Plot 47/B)',
      subtitle: '+1.6m Beyond Land Boundary',
      tag: 'Boundary Overstep',
    },
  ];

  return (
    <aside className="w-64 md:w-72 bg-white border-r border-[#E2E8F0] h-full flex flex-col z-20 select-none shadow-xs font-sans">
      {/* Active Building Context */}
      <div className="p-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
          Current Focus
        </span>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2563EB]" />
            <span className="text-xs font-bold text-[#0F172A] truncate">
              {activeBuildingName}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" title="Active"></span>
        </div>
      </div>

      {/* Quick Search Shortcut */}
      {onFocusSearch && (
        <div className="px-3 pt-3">
          <button
            onClick={onFocusSearch}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Search property or unit...</span>
            </div>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1] text-[#64748B]">
              /
            </kbd>
          </button>
        </div>
      )}

      {/* Simple Inspection Navigation */}
      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider px-2 block mb-1">
          Inspection Mode
        </span>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.active;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                isItemActive
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border border-[#BFDBFE] shadow-xs'
                  : 'hover:bg-[#F8FAFC] text-[#334155] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    isItemActive
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isItemActive ? item.color : 'text-[#64748B]'}`} />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-tight">{item.label}</div>
                  <div className="text-[10px] text-[#64748B] leading-tight truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] shrink-0 border border-[#FECACA]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Specific Conflicts List when in Conflict Inspection Mode */}
        {currentMode === 'conflict' && (
          <div className="mt-3 pt-3 border-t border-[#F1F5F9] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#DC2626] tracking-wider px-2 block flex items-center justify-between">
              <span>Select Active Conflict:</span>
              <span className="text-[9px] bg-red-100 text-red-700 px-1.5 rounded font-mono">3 Found</span>
            </span>

            <div className="space-y-1.5">
              {conflictItems.map((c) => {
                const isConflictActive = activeConflictId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectConflict?.(c.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                      isConflictActive
                        ? 'bg-[#FEF2F2] border-[#DC2626] shadow-xs'
                        : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F172A] truncate">
                        {c.name}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase ${
                          c.tag === 'Road Error'
                            ? 'bg-amber-100 text-amber-800'
                            : c.tag === 'Boundary Overstep'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#DC2626] font-medium mt-0.5 leading-tight">
                      {c.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Status */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-[11px] text-[#64748B] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Cadastral GIS v3.0</span>
        </span>
        <span className="text-[10px] text-[#94A3B8]">Pune West</span>
      </div>
    </aside>
  );
};
