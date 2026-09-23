import React from 'react';
import { UserProfile, UserRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  User, 
  Check, 
  UploadCloud, 
  FileCheck, 
  Eye, 
  Download, 
  Lock, 
  Shield, 
  Building2 
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const adminProfile: UserProfile = {
    id: 'user-admin-1',
    name: 'Sanjay Sharma',
    role: 'admin',
    email: 'sanjay.sharma@amnex.com',
    organization: 'Amnex Infotechnologies / NMDC Security Control',
    designation: 'NMDC Project Manager & Site Admin'
  };

  const viewerProfile: UserProfile = {
    id: 'user-viewer-1',
    name: 'Rajeev Ranjan',
    role: 'user',
    email: 'cisf.gate1.nmdc@gov.in',
    organization: 'CISF Security Gate Unit / NMDC Plant',
    designation: 'Gate Duty Officer / Authorized Viewer'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Account & Role Access Management
              </h3>
              <p className="text-xs text-slate-400">
                Amnex Infotechnologies • NMDC Project Gate System (Monitored by CISF)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Select an account role to test different permission levels according to security protocol:
          </p>

          {/* Admin Role Card */}
          <div
            onClick={() => {
              onSelectRole('admin');
              onClose();
            }}
            className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${
              currentProfile.role === 'admin'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{adminProfile.name}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      ADMIN (Full Access)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {adminProfile.designation} • {adminProfile.organization}
                  </p>
                  
                  {/* Capabilities */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                      <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Excel Data</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                      <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Signed/Received Passes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                      <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Bills & Invoices</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Create, Edit & Delete Passes</span>
                    </div>
                  </div>
                </div>
              </div>

              {currentProfile.role === 'admin' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* User Role Card */}
          <div
            onClick={() => {
              onSelectRole('user');
              onClose();
            }}
            className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${
              currentProfile.role === 'user'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{viewerProfile.name}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      USER (View & Download Only)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {viewerProfile.designation} • {viewerProfile.organization}
                  </p>
                  
                  {/* Capabilities */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Passes & Materials List</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download Approved Pass Links</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download Bills & Reports</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Upload & Edit Restricted</span>
                    </div>
                  </div>
                </div>
              </div>

              {currentProfile.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Active session: <strong className="text-slate-800">{currentProfile.name} ({currentProfile.role.toUpperCase()})</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
