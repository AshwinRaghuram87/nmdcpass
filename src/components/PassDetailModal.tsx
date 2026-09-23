import React, { useRef } from 'react';
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
  Printer, 
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
  Shield
} from 'lucide-react';

interface PassDetailModalProps {
  pass: EntryPass | null;
  userRole: UserRole;
  onClose: () => void;
  onPrint: (pass: EntryPass) => void;
  onEdit: (pass: EntryPass) => void;
  onUploadDoc: (pass: EntryPass) => void;
  onUploadBill: (pass: EntryPass) => void;
  onToggleGateStatus: (pass: EntryPass) => void;
  onToggleMaterialReturn: (pass: EntryPass) => void;
  onAdvanceProcedureStage?: (pass: EntryPass, nextStage: ProcedureStage) => void;
}

export const PassDetailModal: React.FC<PassDetailModalProps> = ({
  pass,
  userRole,
  onClose,
  onPrint,
  onEdit,
  onUploadDoc,
  onUploadBill,
  onToggleGateStatus,
  onToggleMaterialReturn,
  onAdvanceProcedureStage
}) => {
  if (!pass) return null;
  const isAdmin = userRole === 'admin';

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

              {/* Material Items List with BOQ & Bill Fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Materials Inventory & BOQ Item Breakdown ({pass.materialItems?.length || 0} Items)</span>
                  </h4>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                        <th className="py-2 px-3">Item Description</th>
                        <th className="py-2 px-3">Quantity & Unit</th>
                        <th className="py-2 px-3">Bill / Challan Number</th>
                        <th className="py-2 px-3">Serial No / Tag #</th>
                        <th className="py-2 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {pass.materialItems && pass.materialItems.length > 0 ? (
                        pass.materialItems.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 font-semibold text-slate-900">
                              {item.itemName}
                              {item.specification && (
                                <span className="text-[11px] text-slate-500 font-normal block">{item.specification}</span>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-3 px-3 text-center text-slate-400">
                            No individual items listed.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Uploaded Bill & Tax Invoice Box */}
              <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-indigo-950">
                      Material Tax Invoice / Bill Document
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      id="btn-upload-bill-modal"
                      onClick={() => onUploadBill(pass)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{pass.billDocument ? 'Replace Bill' : 'Upload Bill'}</span>
                    </button>
                  )}
                </div>

                {pass.billDocument ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-indigo-200 rounded-lg gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block truncate max-w-[280px]">
                          {pass.billDocument.fileName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Bill Ref: <strong className="font-mono text-slate-800">{pass.billNumber || pass.challanInvoiceNumber || 'On file'}</strong> • {pass.billDocument.uploadedAt}
                        </span>
                      </div>
                    </div>

                    {/* Download Bill Link - Available to both Admin & User */}
                    <button
                      id="btn-download-bill-link"
                      onClick={() => triggerDownload(pass.billDocument!.fileUrl, pass.billDocument!.fileName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold shadow-2xs transition cursor-pointer"
                      title="Download attached Tax Invoice / Bill"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Bill Link</span>
                    </button>
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
                <span>Approved Pass Document (Official Signed & Received Copy)</span>
              </h3>
              
              {isAdmin && (
                <button
                  id="btn-upload-replacement-doc"
                  onClick={() => onUploadDoc(pass)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{pass.approvedDocument ? 'Replace Signed Pass' : 'Upload Signed Pass'}</span>
                </button>
              )}
            </div>

            {pass.approvedDocument ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[280px]">
                      {pass.approvedDocument.fileName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Uploaded by {pass.approvedDocument.uploadedBy || 'Security Office'} • {pass.approvedDocument.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Download Approved Pass Link - Available to both Admin and User */}
                  <button
                    id="btn-download-approved-doc"
                    onClick={() => triggerDownload(pass.approvedDocument!.fileUrl, pass.approvedDocument!.fileName)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Pass Link</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-600 font-medium">No approved document uploaded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isAdmin ? 'Upload signed copy from NMDC Security / CISF Gate In-Charge' : 'Admin upload required to activate pass download link'}
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
              title="Print standard 2-page NMDC official entry pass format with instructions"
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
    </div>
  );
};
