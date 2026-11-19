import React, { useState, useRef } from 'react';
import { 
  EntryPass, 
  UserRole,
  ProcedureStage
} from '../types';
import { 
  X, 
  ShieldCheck, 
  Download, 
  UploadCloud, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  Building2, 
  Truck, 
  Package, 
  Clock, 
  RotateCcw,
  BadgeAlert,
  FileCheck,
  Receipt,
  Tag,
  Lock,
  Layers,
  ArrowRight,
  CheckCircle2,
  Shield,
  Printer,
  Eye,
  Image as ImageIcon,
  Link2,
  ExternalLink,
  ClipboardCheck
} from 'lucide-react';
import {
  isGoogleDriveDoc,
  isExternalDocUrl,
  getGoogleDriveDirectDownloadUrl
} from '../utils/passUtils';
import { computePassBoqSummary, isBoqMaterialItem } from '../utils/boqUtils';
import { verifyItemMakeAndModel } from '../utils/boqAnnexureData';
import { BoqDeliveryTrackerBar } from './BoqDeliveryTrackerBar';

interface PassDetailModalProps {
  pass: EntryPass | null;
  allPasses?: EntryPass[];
  userRole: UserRole;
  onClose: () => void;
  onPrint: (pass: EntryPass) => void;
  onEdit: (pass: EntryPass) => void;
  onUploadDoc: (pass: EntryPass) => void;
  onUploadBill: (pass: EntryPass) => void;
  onToggleGateStatus: (pass: EntryPass) => void;
  onToggleMaterialReturn: (pass: EntryPass) => void;
  onAdvanceProcedureStage?: (pass: EntryPass, nextStage: ProcedureStage) => void;
  onReviewBoqPass?: (pass: EntryPass) => void;
}

export const PassDetailModal: React.FC<PassDetailModalProps> = ({
  pass,
  allPasses,
  userRole,
  onClose,
  onPrint,
  onEdit,
  onUploadDoc,
  onUploadBill,
  onToggleGateStatus,
  onToggleMaterialReturn,
  onAdvanceProcedureStage,
  onReviewBoqPass
}) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  if (!pass) return null;
  const isAdmin = userRole === 'admin';
  const boqSummary = computePassBoqSummary(pass, allPasses || [pass]);

  const isImageDoc = (url?: string, name?: string) => {
    if (!url) return false;
    return url.startsWith('data:image/') || (name && /\.(jpe?g|png|webp|bmp)$/i.test(name));
  };

  const triggerDownload = (docUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = docUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Official Security Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md border border-blue-400/40 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/80">
                    {pass.passNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {pass.passType} Pass
                  </span>
                  {pass.passType === 'Materials' && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      pass.materialCategory === 'Returnable'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    }`}>
                      {pass.materialCategory === 'Returnable' ? 'RGP (Returnable)' : 'NRGP (Non-Returnable)'}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  CISF Security Entry Pass & Material Follow-Up Record
                </h2>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Amnex Infotechnologies • Client: NMDC , Donimalai • Monitored at {pass.gateNumber}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Procedure Workflow Pipeline Banner (Pass Prepared -> Submitted to C&IT -> Submitted to CISF -> Pass Obtained) */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Mandatory Entry Pass Issuance Procedure Pipeline
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Department: <span className="font-semibold text-blue-400">{pass.departmentOrProject || 'C&IT'}</span> • Gate: <span className="font-semibold text-slate-200">{pass.gateNumber}</span>
              </div>
            </div>

            {/* 4-Step Interactive Pipeline Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {/* Step 1: Pass Prepared */}
              <div className={`p-2.5 rounded-lg border text-xs ${
                pass.procedureStage === 'Pass Prepared'
                  ? 'bg-blue-950/80 border-blue-500 text-white ring-1 ring-blue-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px]">1. Prepared</span>
                  {pass.procedureStage !== 'Pass Prepared' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">By Amnex Infotechnologies</div>
                {pass.preparedDate && <div className="text-[9px] text-slate-400 mt-1">{pass.preparedDate}</div>}
              </div>

              {/* Step 2: Submitted to C&IT */}
              <div className={`p-2.5 rounded-lg border text-xs ${
                pass.procedureStage === 'Submitted to C&IT'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                  : ['Submitted to CISF', 'Pass Obtained'].includes(pass.procedureStage || '')
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px]">2. C&IT Approval</span>
                  {['Submitted to CISF', 'Pass Obtained'].includes(pass.procedureStage || '') ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : pass.procedureStage === 'Submitted to C&IT' ? (
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Step 2</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">NMDC C&IT Department</div>
                {pass.citSubmittedDate && <div className="text-[9px] text-slate-400 mt-1">{pass.citSubmittedDate}</div>}
              </div>

              {/* Step 3: Submitted to CISF */}
              <div className={`p-2.5 rounded-lg border text-xs ${
                pass.procedureStage === 'Submitted to CISF'
                  ? 'bg-blue-950/80 border-blue-400 text-blue-200 ring-1 ring-blue-400'
                  : pass.procedureStage === 'Pass Obtained'
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px]">3. CISF Signature</span>
                  {pass.procedureStage === 'Pass Obtained' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : pass.procedureStage === 'Submitted to CISF' ? (
                    <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Step 3</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">CISF Security Gate</div>
                {pass.cisfSubmittedDate && <div className="text-[9px] text-slate-400 mt-1">{pass.cisfSubmittedDate}</div>}
              </div>

              {/* Step 4: Pass Obtained */}
              <div className={`p-2.5 rounded-lg border text-xs ${
                pass.procedureStage === 'Pass Obtained'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px]">4. Pass Obtained</span>
                  {pass.procedureStage === 'Pass Obtained' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Final</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Signed & Received</div>
                {pass.passObtainedDate && <div className="text-[9px] text-emerald-400 mt-1">{pass.passObtainedDate}</div>}
              </div>
            </div>

            {/* Quick Progression Control Bar for Admin */}
            {isAdmin && onAdvanceProcedureStage && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Procedure Control: Move to next stage in NMDC / CISF protocol
                </span>
                <div className="flex items-center gap-2">
                  {pass.procedureStage === 'Pass Prepared' && (
                    <button
                      onClick={() => onAdvanceProcedureStage(pass, 'Submitted to C&IT')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-2xs transition cursor-pointer"
                    >
                      <span>Submit for C&IT Approval</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {pass.procedureStage === 'Submitted to C&IT' && (
                    <button
                      onClick={() => onAdvanceProcedureStage(pass, 'Submitted to CISF')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-2xs transition cursor-pointer"
                    >
                      <span>Approve by C&IT & Submit to CISF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {pass.procedureStage === 'Submitted to CISF' && (
                    <button
                      onClick={() => onAdvanceProcedureStage(pass, 'Pass Obtained')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-2xs transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CISF Signed: Mark Pass Obtained</span>
                    </button>
                  )}
                  {pass.procedureStage === 'Pass Obtained' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Procedure Fulfilled</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status & Validity Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CISF Gate Status</span>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  pass.status === 'In-Premises'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {pass.status}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => onToggleGateStatus(pass)}
                    className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Validity Period</span>
              <div className="mt-1 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{pass.validFrom}</span>
                <span className="text-slate-400">to</span>
                <span>{pass.validTo}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Clearance</span>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{pass.cisfVerified ? 'CISF Verified & Monitored' : 'Verification In Progress'}</span>
              </div>
            </div>
          </div>

          {/* Pass Holder Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Pass Holder & Project Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Authorized Pass Holder:</span>
                <span className="font-bold text-slate-900 text-sm">{pass.passHolderName}</span>
                <span className="block text-slate-600 text-[11px]">{pass.passHolderDesignation || 'Lead / Representative'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Assigned Project / Department:</span>
                <span className="font-semibold text-blue-800">{pass.departmentOrProject}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Contact Number:</span>
                <span className="font-medium text-slate-800">{pass.passHolderContact || 'Provided at gate'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">ID / Proof Ref:</span>
                <span className="font-mono text-slate-800">{pass.passHolderIdProof || 'Company ID Badge'}</span>
              </div>
            </div>
          </div>

          {/* List of Employees Covered Under This Pass */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>List of Employees / Personnel Covered ({pass.employees.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Verified at CISF Gate
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Full Name</th>
                    <th className="py-2 px-3">Designation / Role</th>
                    <th className="py-2 px-3">Govt ID / Aadhaar / Amnex ID</th>
                    <th className="py-2 px-3">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pass.employees.map((emp, index) => (
                    <tr key={emp.id || index} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{emp.name}</td>
                      <td className="py-2 px-3 text-slate-600">{emp.designation}</td>
                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{emp.idNumber || 'Verified in person'}</td>
                      <td className="py-2 px-3 text-slate-600">{emp.contactNumber || 'On file'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Details (If Vehicle Pass) */}
          {pass.passType === 'Vehicle' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Vehicle & Driver Authorization</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle Registration No:</span>
                  <span className="font-mono text-sm font-bold text-slate-900">{pass.vehicleNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle Type / Model:</span>
                  <span className="font-medium text-slate-800">{pass.vehicleType || 'Project Utility'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Driver License No:</span>
                  <span className="font-mono text-slate-800">{pass.driverLicenseNumber || 'Verified by CISF'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Materials Section: RGP vs NRGP, BOQ classification, Bills */}
          {pass.passType === 'Materials' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Material Gate Pass & BOQ Specification
                  </h3>
                </div>

                {pass.materialCategory === 'Returnable' ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      <span>RGP (Returnable Gate Pass)</span>
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => onToggleMaterialReturn(pass)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                      >
                        {pass.materialReturnStatus === 'Returned' ? 'Mark Pending Return' : 'Mark as Returned'}
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                    <Layers className="w-3.5 h-3.5 text-indigo-700" />
                    <span>NRGP (Non-Returnable Gate Pass)</span>
                  </span>
                )}
              </div>

              {/* RGP / NRGP Key Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Pass Classification:</span>
                  <span className="font-bold text-slate-900">
                    {pass.materialCategory === 'Returnable' ? 'Returnable Gate Pass (RGP)' : 'Non-Returnable Gate Pass (NRGP)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Delivery Challan / Invoice #:</span>
                  <span className="font-mono font-semibold text-slate-800">{pass.challanInvoiceNumber || 'AMN/CH-2025'}</span>
                  {pass.deliveryChallanDriveUrl && (
                    <div className="mt-1">
                      <a
                        href={pass.deliveryChallanDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow-2xs transition"
                        title={`Open Delivery Challan in Google Drive: ${pass.deliveryChallanDriveUrl}`}
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Open Challan Drive</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
                {pass.materialCategory === 'Returnable' ? (
                  <div>
                    <span className="text-slate-500 text-[11px] block">Expected Return Deadline:</span>
                    <span className="font-bold text-amber-800">{pass.expectedReturnDate || 'Within 15 days'}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-500 text-[11px] block">Material Destination:</span>
                    <span className="font-semibold text-emerald-800">Permanent Consignment to NMDC</span>
                  </div>
                )}
                {pass.vehicleNumber && (
                  <div>
                    <span className="text-slate-500 text-[11px] block">Transport Vehicle:</span>
                    <span className="font-mono font-bold text-blue-900">{pass.vehicleNumber}</span>
                    {pass.vehicleType && <span className="text-slate-500 text-[11px] ml-1">({pass.vehicleType})</span>}
                  </div>
                )}
                {pass.recommendedBy && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 text-[11px] block">Recommended By:</span>
                    <span className="font-semibold text-slate-800">{pass.recommendedBy}</span>
                  </div>
                )}
              </div>

              {/* BOQ Delivery Tracking Summary (Total BOQ, Present Delivering, Already Delivered, Pending) */}
              {boqSummary && (
                <BoqDeliveryTrackerBar
                  summary={boqSummary}
                  passNumber={pass.passNumber}
                  pass={pass}
                  onReviewMakeModel={onReviewBoqPass ? () => onReviewBoqPass(pass) : undefined}
                />
              )}

              {/* Material Items List with BOQ & Bill Fields */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Materials Inventory &amp; BOQ Item Breakdown ({pass.materialItems?.length || 0} Items)</span>
                  </h4>
                  {boqSummary && onReviewBoqPass && (
                    <button
                      type="button"
                      onClick={() => onReviewBoqPass(pass)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-2xs transition cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Review Make &amp; Model (Annexure 2)</span>
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                        <th className="py-2 px-3">Item Description</th>
                        <th className="py-2 px-3">Make &amp; Model</th>
                        <th className="py-2 px-3">Quantity &amp; Unit</th>
                        <th className="py-2 px-3">Bill / Challan Number</th>
                        <th className="py-2 px-3">Serial No / Tag #</th>
                        <th className="py-2 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {pass.materialItems && pass.materialItems.length > 0 ? (
                        pass.materialItems.map((item, idx) => {
                          const isBoq = isBoqMaterialItem(item, pass);
                          const verification = isBoq ? verifyItemMakeAndModel(item) : null;
                          return (
                          <tr key={item.id || idx} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 font-semibold text-slate-900">
                              {item.itemName}
                              {item.specification && (
                                <span className="text-[11px] text-slate-500 font-normal block">{item.specification}</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-[11px]">
                              {(item.oem || item.oemModel) ? (
                                <div>
                                  <span className="font-bold text-slate-800">{item.oem || '—'}</span>
                                  {item.oemModel && (
                                    <span className="block font-mono text-[10px] text-slate-600">{item.oemModel}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Not entered</span>
                              )}
                              {verification && (
                                <span
                                  className={`mt-0.5 inline-block text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    verification.status === 'verified'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : verification.status === 'mismatch'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {verification.status === 'verified'
                                    ? '✓ Annexure 2 Match'
                                    : verification.status === 'mismatch'
                                      ? '⚠ Check Annexure 2'
                                      : 'Verify Make/Model'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                              {item.billNumber || pass.billNumber || '-'}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                              {item.serialNumber || '-'}
                            </td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">
                              {item.remarks || '-'}
                            </td>
                          </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-3 px-3 text-center text-slate-400">
                            No individual items listed.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Uploaded Bill & Delivery Challan Drive Link Box */}
              <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-indigo-950">
                      Material Tax Invoice / Bill &amp; Delivery Challan
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      id="btn-upload-bill-modal"
                      onClick={() => onUploadBill(pass)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{pass.billDocument || pass.deliveryChallanDriveUrl ? 'Update Bill / Challan' : 'Add Bill / Challan Link'}</span>
                    </button>
                  )}
                </div>

                {pass.deliveryChallanDriveUrl && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-950 block">
                          Delivery Challan — Google Drive Link
                        </span>
                        <span className="text-[11px] text-emerald-800 font-mono truncate block max-w-[300px]" title={pass.deliveryChallanDriveUrl}>
                          {pass.challanInvoiceNumber ? `DC #${pass.challanInvoiceNumber} • ` : ''}
                          {pass.deliveryChallanDriveUrl}
                        </span>
                      </div>
                    </div>
                    <a
                      href={pass.deliveryChallanDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow-2xs transition shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Challan</span>
                    </a>
                  </div>
                )}

                {pass.billDocument ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-indigo-200 rounded-lg gap-2">
                    <div className="flex items-center gap-3">
                      {isImageDoc(pass.billDocument.fileUrl, pass.billDocument.fileName) ? (
                        <div 
                          onClick={() => setPreviewImage({ url: pass.billDocument!.fileUrl, title: pass.billDocument!.fileName })}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-indigo-300 bg-white cursor-pointer group shrink-0 shadow-2xs"
                          title="Click to view full image"
                        >
                          <img 
                            src={pass.billDocument.fileUrl} 
                            alt="Bill" 
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 block truncate max-w-[240px]">
                            {pass.billDocument.fileName}
                          </span>
                          {isImageDoc(pass.billDocument.fileUrl, pass.billDocument.fileName) && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-100 text-indigo-800 rounded">
                              JPEG
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Bill Ref: <strong className="font-mono text-slate-800">{pass.billNumber || pass.challanInvoiceNumber || 'On file'}</strong> • {pass.billDocument.uploadedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isImageDoc(pass.billDocument.fileUrl, pass.billDocument.fileName) && (
                        <button
                          onClick={() => setPreviewImage({ url: pass.billDocument!.fileUrl, title: pass.billDocument!.fileName })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View JPEG</span>
                        </button>
                      )}

                      {/* Download Bill Link - Available to both Admin & User */}
                      <button
                        id="btn-download-bill-link"
                        onClick={() => triggerDownload(pass.billDocument!.fileUrl, pass.billDocument!.fileName)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold shadow-2xs transition cursor-pointer"
                        title="Download attached Tax Invoice / Bill"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2.5 text-xs text-indigo-700 font-medium">
                    No bill copy attached yet. Bill Ref: <strong className="font-mono">{pass.billNumber || 'Pending'}</strong>
                    {isAdmin ? ' • Click "Upload Bill" above to attach invoice.' : ' • Only Admin can upload bills.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approved Pass Document Upload & Download Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Approved Pass Document (Official Signed & Stamped Copy)</span>
              </h3>
              
              {isAdmin && (
                <button
                  id="btn-upload-replacement-doc"
                  onClick={() => onUploadDoc(pass)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{pass.approvedDocument ? 'Replace / Change Link' : 'Upload / Paste Drive Link'}</span>
                </button>
              )}
            </div>

            {pass.approvedDocument ? (() => {
              const doc = pass.approvedDocument;
              const isDrive = isGoogleDriveDoc(doc.fileUrl, doc.fileType);
              const isImg = !isDrive && isImageDoc(doc.fileUrl, doc.fileName);
              const driveDirectUrl = isDrive ? getGoogleDriveDirectDownloadUrl(doc.fileUrl) : null;

              return (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {isImg ? (
                      <div 
                        onClick={() => setPreviewImage({ url: doc.fileUrl, title: doc.fileName })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-emerald-300 bg-white cursor-pointer group shrink-0 shadow-2xs"
                        title="Click to view full image"
                      >
                        <img 
                          src={doc.fileUrl} 
                          alt="Pass Document" 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : isDrive ? (
                      <div className="w-11 h-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Link2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 block truncate max-w-[260px]">
                          {doc.fileName}
                        </span>
                        {isImg && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-200 text-emerald-900 rounded">
                            JPEG
                          </span>
                        )}
                        {isDrive && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 rounded">
                            Google Drive
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {isDrive ? 'Linked' : 'Uploaded'} by {doc.uploadedBy || 'Security Office'} • {doc.uploadedAt}
                      </span>
                      {isDrive ? (
                        <span className="text-[10px] text-blue-700 font-mono block truncate max-w-[300px] mt-0.5" title={doc.fileUrl}>
                          {doc.fileUrl}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                          Stored in database: {doc.fileSize || 'Attached'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {isImg && (
                      <button
                        onClick={() => setPreviewImage({ url: doc.fileUrl, title: doc.fileName })}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View JPEG</span>
                      </button>
                    )}

                    {isDrive || isExternalDocUrl(doc.fileUrl) ? (
                      <>
                        <a
                          id="btn-open-drive-doc"
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{isDrive ? 'Open Google Drive' : 'Open Document'}</span>
                        </a>
                        {driveDirectUrl && (
                          <a
                            href={driveDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                            title="Direct download from Google Drive"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </>
                    ) : (
                      <button
                        id="btn-download-approved-doc"
                        onClick={() => triggerDownload(doc.fileUrl, doc.fileName)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Pass</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-600 font-medium">No approved document or Drive link attached yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAdmin ? 'Upload signed JPEG/PDF or paste Google Drive link for the scanned pass' : 'Admin upload or Drive link required to activate pass access'}
                </p>
              </div>
            )}
          </div>

          {/* CISF Gate Verification Notes */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-xs mb-1">CISF Gate Verification & Follow-Up Notes</h4>
            <p className="text-slate-600">{pass.followUpNotes || 'All gate records synchronized.'}</p>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verifier: <strong>{pass.cisfVerifierName || 'CISF Duty Officer'}</strong></span>
              <span>Last Activity: <strong>{pass.lastGateActivity || 'None'}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Current Access: <strong className="text-slate-800">{isAdmin ? 'Admin (Full Management)' : 'User (Viewer & Download)'}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(pass)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Print official NMDC entry pass (Standard & Annexure-I format)"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Print Official Pass</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(pass);
                }}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                Edit Pass Record
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden p-2 border border-slate-700 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white p-3 border-b border-slate-800">
              <span className="text-xs font-bold truncate max-w-md">{previewImage.title}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerDownload(previewImage.url, previewImage.title)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => setPreviewImage(null)}
                  className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-3 overflow-auto max-h-[75vh] flex items-center justify-center bg-slate-950/60 rounded-xl m-2">
              <img 
                src={previewImage.url} 
                alt="Document Full View" 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
