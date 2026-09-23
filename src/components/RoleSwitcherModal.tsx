import React from 'react';
import { UserProfile } from '../types';
import { SYSTEM_USERS } from '../utils/userProfiles';
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
  Sparkles,
  Plus
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectUser
}) => {
  if (!isOpen) return null;

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
                Switch Active User / Account
              </h3>
              <p className="text-xs text-slate-400">
                Amnex Infotechnologies • NMDC Donimalai Gate Access Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Users List */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Select an account to switch between administrator and user access levels:
          </p>

          {SYSTEM_USERS.map((user) => {
            const isSelected = currentProfile.username === user.username;
            const isAdmin = user.role === 'admin';

            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${
                  isSelected
                    ? isAdmin
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20'
                      : 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white ${
                        isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}
                    >
                      {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{user.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          (@{user.username})
                        </span>
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                            isAdmin
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isAdmin ? 'ADMIN (Full Access)' : 'USER (View & Verify)'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {user.designation} • {user.organization}
                      </p>

                      {/* Role Capabilities preview */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                        {isAdmin ? (
                          <>
                            <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                              <Plus className="w-3.5 h-3.5 text-blue-600" />
                              <span>Create & Edit Passes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                              <span>Upload Excel Data</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Upload Signed/CISF Passes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                              <Download className="w-3.5 h-3.5 text-blue-600" />
                              <span>Export Excel & Full Reports</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View All Passes & BOQ Items</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                              <Download className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Download Approved Passes</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                              <Download className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Download Attached Bills</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Pass Editing Restricted</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 ${
                        isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Active session: <strong className="text-slate-800">{currentProfile.name}</strong> (@{currentProfile.username})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
