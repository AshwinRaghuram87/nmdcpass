import React from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Shield, 
  Users, 
  HardHat, 
  Truck, 
  Package, 
  RotateCcw, 
  FileText, 
  Receipt,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PassType, ProcedureStage, DESIGNATED_GATES } from '../types';

interface PassFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  materialSearchQuery: string;
  onMaterialSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  procedureStageFilter: string; // 'ALL' | ProcedureStage | 'PENDING'
  onProcedureStageChange: (val: string) => void;
  gateFilter: string; // 'ALL' | DesignatedGate
  onGateFilterChange: (val: string) => void;
  validityFilter: string;
  onValidityChange: (val: string) => void;
  gateStatusFilter: string;
  onGateStatusChange: (val: string) => void;
  materialReturnFilter: string; // 'ALL' | 'Returnable' | 'Non-Returnable'
  onMaterialReturnChange: (val: string) => void;
  boqFilter: string; // 'ALL' | 'BOQ' | 'NON_BOQ'
  onBoqFilterChange: (val: string) => void;
  billFilter: string; // 'ALL' | 'HAS_BILL' | 'NO_BILL'
  onBillFilterChange: (val: string) => void;
  docStatusFilter: string;
  onDocStatusChange: (val: string) => void;
  onResetFilters: () => void;
  counts: {
    all: number;
    employee: number;
    contractor: number;
    vehicle: number;
    materials: number;
    rgp: number;
    nrgp: number;
  };
}

export const PassFilters: React.FC<PassFiltersProps> = ({
  searchQuery,
  onSearchChange,
  materialSearchQuery,
  onMaterialSearchChange,
  selectedType,
  onTypeChange,
  procedureStageFilter,
  onProcedureStageChange,
  gateFilter,
  onGateFilterChange,
  validityFilter,
  onValidityChange,
  gateStatusFilter,
  onGateStatusChange,
  materialReturnFilter,
  onMaterialReturnChange,
  boqFilter,
  onBoqFilterChange,
  billFilter,
  onBillFilterChange,
  docStatusFilter,
  onDocStatusChange,
  onResetFilters,
  counts
}) => {
  const isFiltered = 
    searchQuery || 
    materialSearchQuery ||
    selectedType !== 'ALL' || 
    procedureStageFilter !== 'ALL' ||
    gateFilter !== 'ALL' ||
    validityFilter !== 'ALL' || 
    gateStatusFilter !== 'ALL' || 
    materialReturnFilter !== 'ALL' ||
    boqFilter !== 'ALL' ||
    billFilter !== 'ALL' ||
    docStatusFilter !== 'ALL';

  const typeTabs = [
    { id: 'ALL', label: 'All Passes', icon: <Shield className="w-4 h-4" />, count: counts.all },
    { id: 'Employee', label: 'Employee', icon: <Users className="w-4 h-4 text-blue-500" />, count: counts.employee },
    { id: 'Contractor', label: 'Contractor', icon: <HardHat className="w-4 h-4 text-amber-500" />, count: counts.contractor },
    { id: 'Vehicle', label: 'Vehicle', icon: <Truck className="w-4 h-4 text-emerald-500" />, count: counts.vehicle },
    { id: 'Materials', label: 'Materials (All)', icon: <Package className="w-4 h-4 text-indigo-500" />, count: counts.materials },
    { id: 'Materials-RGP', label: 'RGP (Returnable)', icon: <RotateCcw className="w-4 h-4 text-amber-600" />, count: counts.rgp },
    { id: 'Materials-NRGP', label: 'NRGP (Non-Returnable)', icon: <Layers className="w-4 h-4 text-emerald-600" />, count: counts.nrgp },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-5 shadow-xs">
      {/* Category Tabs with Expanded RGP and NRGP */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 border-b border-slate-100 no-scrollbar">
        {typeTabs.map((tab) => {
          let isActive = false;
          if (tab.id === 'Materials-RGP') {
            isActive = selectedType === 'Materials' && materialReturnFilter === 'Returnable';
          } else if (tab.id === 'Materials-NRGP') {
            isActive = selectedType === 'Materials' && materialReturnFilter === 'Non-Returnable';
          } else if (tab.id === 'Materials') {
            isActive = selectedType === 'Materials' && materialReturnFilter === 'ALL';
          } else {
            isActive = selectedType === tab.id;
          }

          const handleClick = () => {
            if (tab.id === 'Materials-RGP') {
              onTypeChange('Materials');
              onMaterialReturnChange('Returnable');
            } else if (tab.id === 'Materials-NRGP') {
              onTypeChange('Materials');
              onMaterialReturnChange('Non-Returnable');
            } else if (tab.id === 'Materials') {
              onTypeChange('Materials');
              onMaterialReturnChange('ALL');
            } else {
              onTypeChange(tab.id);
              if (selectedType === 'Materials') {
                onMaterialReturnChange('ALL');
              }
            }
          };

          return (
            <button
              key={tab.id}
              onClick={handleClick}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-slate-700 text-white' : 'bg-slate-200/70 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bars Row */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* General Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-passes"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Pass #, Holder Name, Employees, Vehicle Reg..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dedicated Material Search Bar */}
        <div className="relative">
          <Package className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-material-items"
            type="text"
            value={materialSearchQuery}
            onChange={(e) => onMaterialSearchChange(e.target.value)}
            placeholder="Search Materials by Item Name, BOQ # (e.g. BOQ-4.1), Bill / Invoice #..."
            className="w-full pl-9 pr-8 py-2 bg-indigo-50/40 hover:bg-indigo-50/70 focus:bg-white border border-indigo-200 rounded-lg text-xs text-slate-900 placeholder:text-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium"
          />
          {materialSearchQuery && (
            <button
              onClick={() => onMaterialSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Procedure Stage Filter (Workflow: Amnex -> C&IT -> CISF -> Obtained) */}
        <select
          id="filter-procedure-stage"
          value={procedureStageFilter}
          onChange={(e) => onProcedureStageChange(e.target.value)}
          className="bg-blue-50/80 border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs text-blue-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">Procedure: All Stages</option>
          <option value="Pass Prepared">Stage 1: Pass Prepared (Amnex)</option>
          <option value="Submitted to C&IT">Stage 2: Submitted to C&IT</option>
          <option value="Submitted to CISF">Stage 3: Submitted to CISF</option>
          <option value="Pass Obtained">Stage 4: Pass Obtained (Signed)</option>
          <option value="PENDING_PROCEDURE">Pending Approval / In-Pipeline</option>
        </select>

        {/* Designated Gate Filter (DIOM, KIOM, Admin Building, PPT) */}
        <select
          id="filter-designated-gate"
          value={gateFilter}
          onChange={(e) => onGateFilterChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">All Designated Gates</option>
          {DESIGNATED_GATES.map((gate) => (
            <option key={gate} value={gate}>
              {gate} Gate
            </option>
          ))}
        </select>

        {/* Validity Filter */}
        <select
          id="filter-validity"
          value={validityFilter}
          onChange={(e) => onValidityChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">All Validity</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon (≤ 5 Days)</option>
          <option value="Expired">Expired</option>
        </select>

        {/* Gate Status Filter */}
        <select
          id="filter-gate-status"
          value={gateStatusFilter}
          onChange={(e) => onGateStatusChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">All Gate Status</option>
          <option value="In-Premises">In-Premises (At Site)</option>
          <option value="Approved">Approved (Awaiting Entry)</option>
          <option value="Exited">Exited</option>
          <option value="Expired">Expired</option>
        </select>

        {/* Material Category Filter (Returnable vs Non-Returnable) */}
        <select
          id="filter-material-return"
          value={materialReturnFilter}
          onChange={(e) => onMaterialReturnChange(e.target.value)}
          className="bg-indigo-50/70 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-indigo-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Materials: All Types</option>
          <option value="Returnable">RGP (Returnable Gate Pass)</option>
          <option value="Non-Returnable">NRGP (Non-Returnable Gate Pass)</option>
        </select>

        {/* BOQ vs Non-BOQ Filter */}
        <select
          id="filter-boq-status"
          value={boqFilter}
          onChange={(e) => onBoqFilterChange(e.target.value)}
          className="bg-blue-50/70 border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-blue-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">BOQ: All Materials</option>
          <option value="BOQ">BOQ Items Only</option>
          <option value="NON_BOQ">Non-BOQ Items Only</option>
        </select>

        {/* Bill Status Filter */}
        <select
          id="filter-bill-status"
          value={billFilter}
          onChange={(e) => onBillFilterChange(e.target.value)}
          className="bg-emerald-50/70 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs text-emerald-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">Bill: All</option>
          <option value="HAS_BILL">Bill Uploaded</option>
          <option value="NO_BILL">Bill Pending Upload</option>
        </select>

        {/* Approved Pass Document Attached Filter */}
        <select
          id="filter-doc-status"
          value={docStatusFilter}
          onChange={(e) => onDocStatusChange(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
        >
          <option value="ALL">Pass Document: All</option>
          <option value="HAS_DOC">With Approved Pass Document</option>
          <option value="NO_DOC">No Document Uploaded</option>
        </select>

        {isFiltered && (
          <button
            id="btn-reset-filters"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            title="Reset all filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
