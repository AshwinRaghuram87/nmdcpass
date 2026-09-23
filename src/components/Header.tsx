import React from 'react';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  Plus, 
  Upload, 
  RotateCcw, 
  Trash2,
  User, 
  Shield, 
  Lock, 
  ChevronDown 
} from 'lucide-react';
import { downloadSampleTemplate } from '../utils/excelHelper';
import { UserProfile } from '../types';

interface HeaderProps {
  currentProfile: UserProfile;
  onOpenRoleSwitcher: () => void;
  onOpenNewPassModal: () => void;
  onOpenExcelModal: () => void;
  onExportExcel: () => void;
  onResetData: () => void;
  totalPasses: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onOpenRoleSwitcher,
  onOpenNewPassModal,
  onOpenExcelModal,
  onExportExcel,
  onResetData,
  totalPasses,
}) => {
  const isAdmin = currentProfile.role === 'admin';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Security & Entity Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 text-slate-300">
            <div className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CISF Gate Security Access Control System</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">Vendor: Amnex Infotechnologies</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-medium">Client: NMDC Ltd (Navratna PSU)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Account & Role Indicator */}
            <button
              id="btn-switch-role"
              onClick={onOpenRoleSwitcher}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs transition cursor-pointer"
              title="Click to switch between Admin and User login"
            >
              <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-200">{currentProfile.name}</span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                  isAdmin 
                    ? 'bg-blue-900/60 text-blue-300 border border-blue-700' 
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                }`}>
                  {isAdmin ? 'ADMIN' : 'USER (VIEWER)'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <span className="text-slate-500 hidden sm:inline">({totalPasses} records)</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Client Identification */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Amnex <span className="text-blue-400 font-normal">| NMDC Ltd</span>
                </h1>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded border border-blue-500/30">
                  CISF Gate Entry Pass & Material Follow-Up
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                RGP/NRGP Material Tracker, BOQ & Bill Management, and CISF Security Pass Records
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Excel Template - available for both */}
            <button
              id="btn-download-template"
              onClick={downloadSampleTemplate}
              title="Download Excel upload template with sample format for bulk pass entry"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel Template</span>
            </button>

            {/* Export Excel - available for both */}
            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              title="Export current pass follow-up records to Excel file"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 rotate-180 text-blue-400" />
              <span>Export Excel</span>
            </button>

            {/* Upload Excel Data - Admin only */}
            {isAdmin ? (
              <button
                id="btn-upload-excel"
                onClick={onOpenExcelModal}
                title="Upload Excel (.xlsx) or CSV file with entry pass records"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40 transition shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Upload Excel Data</span>
              </button>
            ) : (
              <button
                id="btn-upload-excel-disabled"
                onClick={onOpenRoleSwitcher}
                title="Only Admin can upload Excel data. Click to switch to Admin role."
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-pointer hover:bg-slate-800"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Upload Data (Admin)</span>
              </button>
            )}

            {/* New Entry Pass - Admin only */}
            {isAdmin ? (
              <button
                id="btn-create-pass"
                onClick={onOpenNewPassModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-2xs shadow-blue-600/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Entry Pass</span>
              </button>
            ) : (
              <button
                id="btn-create-pass-disabled"
                onClick={onOpenRoleSwitcher}
                title="Only Admin can register new passes. Click to switch to Admin role."
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-pointer hover:bg-slate-800"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>New Pass (Admin)</span>
              </button>
            )}

            {/* Clear All Records */}
            {isAdmin && (
              <button
                id="btn-clear-all-data"
                onClick={onResetData}
                title="Delete all records and start with empty database"
                className="inline-flex items-center gap-1.5 p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-xs">Clear Records</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
