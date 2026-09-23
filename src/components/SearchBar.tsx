import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Building2, Layers, Hash, X, ArrowUpDown, Droplets, Zap, Radio } from 'lucide-react';
import {
  LandParcel,
  CadastralBuilding,
  PropertyUnit,
  BuildingElevator,
  BuildingUtilityRiser,
} from '../types/gis';

interface SearchBarProps {
  parcels: LandParcel[];
  buildings: CadastralBuilding[];
  units: PropertyUnit[];
  elevators?: BuildingElevator[];
  buildingUtilities?: BuildingUtilityRiser[];
  onSelectParcel: (parcel: LandParcel) => void;
  onSelectBuilding: (building: CadastralBuilding) => void;
  onSelectUnit: (unit: PropertyUnit) => void;
  onSelectFloor?: (floorNumber: number) => void;
  onSelectElevator?: (elevator: BuildingElevator) => void;
  onSelectBuildingUtility?: (utility: BuildingUtilityRiser) => void;
}

interface SearchResult {
  id: string;
  type: 'parcel' | 'building' | 'unit' | 'floor' | 'elevator' | 'utility';
  title: string;
  subtitle: string;
  badge: string;
  item: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  parcels,
  buildings,
  units,
  elevators = [],
  buildingUtilities = [],
  onSelectParcel,
  onSelectBuilding,
  onSelectUnit,
  onSelectFloor,
  onSelectElevator,
  onSelectBuildingUtility,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResults = (): SearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Search Basements & Floors
    if (q.includes('base') || q.includes('b1') || q.includes('b2') || q.includes('under') || q.includes('floor') || q.includes('pent')) {
      if (q.includes('1') || q.includes('b1') || q === 'base' || q === 'basement') {
        results.push({
          id: 'floor-b1',
          type: 'floor',
          title: 'Basement 1 (-3.0 m Depth)',
          subtitle: 'Building A · Reserved Parking, Electrical Substation, Water Tank',
          badge: 'Basement Level',
          item: -1,
        });
      }
      if (q.includes('2') || q.includes('b2') || q === 'base' || q === 'basement') {
        results.push({
          id: 'floor-b2',
          type: 'floor',
          title: 'Basement 2 (-6.0 m Depth)',
          subtitle: 'Building A · Visitor Parking, EV Bays, Booster Pump Room',
          badge: 'Basement Level',
          item: -2,
        });
      }
    }

    // Search Elevators
    elevators.forEach((e) => {
      if (
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        `elevator ${e.code}`.toLowerCase().includes(q) ||
        `lift ${e.code}`.toLowerCase().includes(q) ||
        (q === 'lift' || q === 'elevator' || q === 'elevators')
      ) {
        results.push({
          id: e.id,
          type: 'elevator',
          title: `${e.name} (${e.code})`,
          subtitle: `${e.buildingName} · ${e.serves} · ${e.status}`,
          badge: 'Elevator Shaft',
          item: e,
        });
      }
    });

    // Search Building Utilities
    buildingUtilities.forEach((u) => {
      if (
        u.name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.utilityType.toLowerCase().includes(q) ||
        `pipe ${u.id}`.toLowerCase().includes(q) ||
        `utility ${u.id}`.toLowerCase().includes(q)
      ) {
        results.push({
          id: u.id,
          type: 'utility',
          title: `${u.name} [${u.id}]`,
          subtitle: `${u.utilityType} · ${u.route} · ${u.material}`,
          badge: 'Utility Pipeline',
          item: u,
        });
      }
    });

    // Search Parcels
    parcels.forEach((p) => {
      if (
        p.surveyNumber.toLowerCase().includes(q) ||
        `survey ${p.surveyNumber}`.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          type: 'parcel',
          title: `Survey ${p.surveyNumber}`,
          subtitle: `${p.ownerName} · ${(p.areaSqMeters).toLocaleString()} sq.m`,
          badge: '2D Parcel',
          item: p,
        });
      }
    });

    // Search Buildings
    buildings.forEach((b) => {
      if (
        b.name.toLowerCase().includes(q) ||
        `building ${b.name}`.toLowerCase().includes(q) ||
        b.surveyNumber.toLowerCase().includes(q)
      ) {
        results.push({
          id: b.id,
          type: 'building',
          title: b.name,
          subtitle: `Survey ${b.surveyNumber} · ${b.totalFloors} Floors · ${b.totalUnits} Units`,
          badge: '3D Building',
          item: b,
        });
      }
    });

    // Search Units
    units.forEach((u) => {
      if (
        u.unitNumber.toLowerCase().includes(q) ||
        `flat ${u.unitNumber}`.toLowerCase().includes(q) ||
        `unit ${u.unitNumber}`.toLowerCase().includes(q) ||
        u.ownerName.toLowerCase().includes(q) ||
        u.ulpin3D.toLowerCase().includes(q)
      ) {
        results.push({
          id: u.id,
          type: 'unit',
          title: `Flat ${u.unitNumber} (${u.floorName})`,
          subtitle: `${u.ownerName} · ${u.ulpin3D}`,
          badge: '3D-ULPIN Unit',
          item: u,
        });
      }
    });

    return results.slice(0, 8);
  };

  const results = getResults();

  const handleSelect = (res: SearchResult) => {
    if (res.type === 'parcel') {
      onSelectParcel(res.item as LandParcel);
    } else if (res.type === 'building') {
      onSelectBuilding(res.item as CadastralBuilding);
    } else if (res.type === 'unit') {
      onSelectUnit(res.item as PropertyUnit);
    } else if (res.type === 'floor' && onSelectFloor) {
      onSelectFloor(res.item as number);
    } else if (res.type === 'elevator' && onSelectElevator) {
      onSelectElevator(res.item as BuildingElevator);
    } else if (res.type === 'utility' && onSelectBuildingUtility) {
      onSelectBuildingUtility(res.item as BuildingUtilityRiser);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
        <Search className="w-4 h-4 text-[#6B7280] shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search flat (402), elevator (E-01), basement (B1/B2), or utility..."
          className="w-full bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="text-[#9CA3AF] hover:text-[#4B5563] p-0.5"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-1 divide-y divide-[#F3F4F6]">
              {results.map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleSelect(res)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F9FAFB] flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="p-1.5 bg-[#F3F4F6] text-[#4B5563] rounded shrink-0 group-hover:bg-[#E0E7FF] group-hover:text-[#2563EB] transition-colors">
                      {res.type === 'parcel' && <MapPin className="w-3.5 h-3.5" />}
                      {res.type === 'building' && <Building2 className="w-3.5 h-3.5" />}
                      {res.type === 'unit' && <Hash className="w-3.5 h-3.5" />}
                      {res.type === 'floor' && <Layers className="w-3.5 h-3.5 text-[#2563EB]" />}
                      {res.type === 'elevator' && <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB]" />}
                      {res.type === 'utility' && <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-[#1F2937] truncate">{res.title}</div>
                      <div className="text-xs text-[#6B7280] truncate">{res.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#6B7280] shrink-0 whitespace-nowrap">
                    {res.badge}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-[#6B7280]">
              No cadastral record matching &ldquo;{query}&rdquo;. Try <span className="font-mono text-[#2563EB]">Basement 1</span>, <span className="font-mono text-[#2563EB]">Elevator E-01</span>, or <span className="font-mono text-[#2563EB]">402</span>.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

