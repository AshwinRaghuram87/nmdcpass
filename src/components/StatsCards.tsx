import React from 'react';
import { EntryPass } from '../types';
import { 
  Users, 
  HardHat, 
  Package, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  FileText,
  Building2,
  FileCheck,
  Shield,
  ArrowRight
} from 'lucide-react';

interface StatsCardsProps {
  passes: EntryPass[];
  onSelectFilter: (type: string, status?: string, materialCategory?: string, procedureStage?: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ passes, onSelectFilter }) => {
  const total = passes.length;
  const employees = passes.filter(p => p.passType === 'Employee').length;
  const contractors = passes.filter(p => p.passType === 'Contractor').length;
  const vehicles = passes.filter(p => p.passType === 'Vehicle').length;
  const materials = passes.filter(p => p.passType === 'Materials').length;

  // Contractor passes: Total & Pending
  const contractorPasses = passes.filter(p => p.passType === 'Contractor');
  const contractorPending = contractorPasses.filter(p => p.procedureStage !== 'Pass Obtained').length;
  const contractorObtained = contractorPasses.filter(p => p.procedureStage === 'Pass Obtained').length;

  // Material passes: Total & Pending
  const materialPasses = passes.filter(p => p.passType === 'Materials');
  // Material pending = passes not yet obtained OR Returnable passes awaiting return to stores
  const materialProcedurePending = materialPasses.filter(p => p.procedureStage !== 'Pass Obtained').length;
  const materialRgpPendingReturn = materialPasses.filter(
    p => p.materialCategory === 'Returnable' && p.materialReturnStatus === 'Pending Return'
  ).length;
  const materialTotalPending = materialPasses.filter(
    p => p.procedureStage !== 'Pass Obtained' || (p.materialCategory === 'Returnable' && p.materialReturnStatus === 'Pending Return')
  ).length;

  // Material Returnable (RGP) vs Non-Returnable (NRGP)
  const rgpTotal = materialPasses.filter(p => p.materialCategory === 'Returnable').length;
  const nrgpTotal = materialPasses.filter(p => p.materialCategory === 'Non-Returnable').length;

  // Procedure pipeline metrics across all passes:
  // Step 1: Prepared -> Step 2: C&IT Approval -> Step 3: CISF Signature -> Step 4: Pass Obtained
  const preparedCount = passes.filter(p => p.procedureStage === 'Pass Prepared').length;
  const citPendingCount = passes.filter(p => p.procedureStage === 'Submitted to C&IT').length;
  const cisfPendingCount = passes.filter(p => p.procedureStage === 'Submitted to CISF').length;
  const obtainedCount = passes.filter(p => p.procedureStage === 'Pass Obtained').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Passes Overview */}
      <div 
        id="card-total-passes"
        onClick={() => onSelectFilter('ALL')}
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-blue-400/80 hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Passes</span>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500 font-medium">Registered</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-1 text-center">
          <div className="bg-slate-50 rounded py-1 px-0.5" title="Employees">
            <span className="block text-[10px] text-slate-500 font-medium">Emp</span>
            <span className="text-xs font-bold text-slate-700">{employees}</span>
          </div>
          <div className="bg-amber-50/70 rounded py-1 px-0.5" title="Contractors">
            <span className="block text-[10px] text-amber-700 font-medium">Cont</span>
            <span className="text-xs font-bold text-amber-900">{contractors}</span>
          </div>
          <div className="bg-slate-50 rounded py-1 px-0.5" title="Vehicles">
            <span className="block text-[10px] text-slate-500 font-medium">Veh</span>
            <span className="text-xs font-bold text-slate-700">{vehicles}</span>
          </div>
          <div className="bg-indigo-50/70 rounded py-1 px-0.5" title="Materials">
            <span className="block text-[10px] text-indigo-700 font-medium">Mat</span>
            <span className="text-xs font-bold text-indigo-900">{materials}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Contractor Passes (Total Numbers & Pending) */}
      <div 
        id="card-contractor-passes"
        onClick={() => onSelectFilter('Contractor')}
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-amber-400/80 hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Contractor Passes</span>
          <span className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition">
            <HardHat className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-950">{contractors}</span>
          <span className="text-xs text-amber-700 font-medium">Total Passes</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Pending: {contractorPending}</span>
          </div>
          <div className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Obtained: {contractorObtained}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Material Passes (Total Numbers & Pending) */}
      <div 
        id="card-material-passes"
        onClick={() => onSelectFilter('Materials')}
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-indigo-400/80 hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">Material Passes</span>
          <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 transition">
            <Package className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-indigo-950">{materials}</span>
          <span className="text-xs text-indigo-700 font-medium">Total Passes</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Pending: {materialTotalPending}</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium">
            <span className="text-amber-800 font-bold">{rgpTotal} RGP</span>
            <span className="mx-1 text-slate-300">•</span>
            <span className="text-emerald-800 font-bold">{nrgpTotal} NRGP</span>
          </div>
        </div>
      </div>

      {/* Card 4: Official Procedure Pipeline (Amnex -> C&IT -> CISF -> Obtained) */}
      <div 
        id="card-procedure-pipeline"
        onClick={() => onSelectFilter('ALL')}
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-emerald-400/80 hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Procedure Pipeline</span>
          <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition">
            <FileCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700">{obtainedCount}</span>
          <span className="text-xs text-emerald-600 font-medium">Passes Obtained</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[10px]">
          <div 
            onClick={(e) => { e.stopPropagation(); onSelectFilter('ALL', undefined, undefined, 'Pass Prepared'); }}
            className="bg-slate-50 hover:bg-slate-100 rounded py-1 px-1 transition"
            title="Step 1: Prepared by Amnex"
          >
            <span className="block text-slate-500">1. Prepared</span>
            <span className="font-bold text-slate-800">{preparedCount}</span>
          </div>
          <div 
            onClick={(e) => { e.stopPropagation(); onSelectFilter('ALL', undefined, undefined, 'Submitted to C&IT'); }}
            className="bg-amber-50/80 hover:bg-amber-100 rounded py-1 px-1 transition"
            title="Step 2: Submitted for C&IT Approval"
          >
            <span className="block text-amber-700">2. C&IT</span>
            <span className="font-bold text-amber-900">{citPendingCount}</span>
          </div>
          <div 
            onClick={(e) => { e.stopPropagation(); onSelectFilter('ALL', undefined, undefined, 'Submitted to CISF'); }}
            className="bg-blue-50/80 hover:bg-blue-100 rounded py-1 px-1 transition"
            title="Step 3: Submitted to CISF for Signature"
          >
            <span className="block text-blue-700">3. CISF</span>
            <span className="font-bold text-blue-900">{cisfPendingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
